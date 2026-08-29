import { Bot, InlineKeyboard, Keyboard, webhookCallback } from "grammy";
import { getEvent } from "./data";
import { loadSession, saveSession, listDueReminders, type Env } from "./db";
import {
  handleCallback,
  handleStart,
  handleText,
  replyKeyboard,
} from "./engine";
import { eventTitle, formatDateRange } from "./helpers";
import type { BotMessage, BotSession, Lang } from "./types";

function inlineKb(message: BotMessage): InlineKeyboard {
  const kb = new InlineKeyboard();
  message.buttons.forEach((row, i) => {
    row.forEach((b) => kb.text(b.text, b.data));
    if (i < message.buttons.length - 1) kb.row();
  });
  return kb;
}

function replyKb(lang: Lang): Keyboard {
  const [a, b] = replyKeyboard(lang);
  return new Keyboard().text(a).text(b).resized().persistent();
}

function createBot(env: Env): Bot {
  const bot = new Bot(env.TELEGRAM_TOKEN);

  async function withSession(
    userId: number | undefined,
    chatId: number | undefined,
    run: (
      session: BotSession,
    ) => Promise<{ message: BotMessage; session: BotSession; toast?: string }>,
    reply: (message: BotMessage, session: BotSession) => Promise<void>,
  ) {
    if (!userId || !chatId) return;
    const session = await loadSession(env.DB, userId, chatId);
    const result = await run(session);
    await saveSession(env.DB, userId, chatId, result.session);
    await reply(result.message, result.session);
  }

  bot.command("start", async (ctx) => {
    try {
      await ctx.api.setMyCommands([
        { command: "start", description: "启动机器人 / Start" },
        { command: "schedule", description: "未来赛事 / Schedule" },
      ]);
    } catch {
      /* ignore */
    }
    const userId = ctx.from?.id;
    const chatId = ctx.chat?.id;
    await withSession(
      userId,
      chatId,
      async (session) => handleStart(session),
      async (message, session) => {
        await ctx.reply(message.text, {
          reply_markup: inlineKb(message),
        });
        await ctx.reply("\u2060", {
          reply_markup: replyKb(session.language),
        });
      },
    );
  });

  bot.command("schedule", async (ctx) => {
    const userId = ctx.from?.id;
    const chatId = ctx.chat?.id;
    await withSession(
      userId,
      chatId,
      async (session) => handleText("/schedule", session),
      async (message) => {
        await ctx.reply(message.text, { reply_markup: inlineKb(message) });
      },
    );
  });

  bot.on("callback_query:data", async (ctx) => {
    const data = ctx.callbackQuery.data;
    const userId = ctx.from?.id;
    const chatId = ctx.callbackQuery.message?.chat.id;
    if (!userId || !chatId) {
      await ctx.answerCallbackQuery();
      return;
    }

    if (data === "noop") {
      await ctx.answerCallbackQuery();
      return;
    }

    const session = await loadSession(env.DB, userId, chatId);
    const result = handleCallback(data, session);
    await saveSession(env.DB, userId, chatId, result.session);

    if (result.toast) {
      await ctx.answerCallbackQuery({ text: result.toast });
    } else {
      await ctx.answerCallbackQuery();
    }

    try {
      await ctx.editMessageText(result.message.text, {
        reply_markup: inlineKb(result.message),
      });
    } catch {
      await ctx.reply(result.message.text, {
        reply_markup: inlineKb(result.message),
      });
    }
  });

  bot.on("message:text", async (ctx) => {
    if (ctx.message.text.startsWith("/")) return;
    const userId = ctx.from?.id;
    const chatId = ctx.chat?.id;
    await withSession(
      userId,
      chatId,
      async (session) => handleText(ctx.message.text, session),
      async (message) => {
        await ctx.reply(message.text, { reply_markup: inlineKb(message) });
      },
    );
  });

  return bot;
}

async function runReminders(env: Env): Promise<void> {
  const bot = createBot(env);
  const rows = await listDueReminders(env.DB);
  const tomorrow = new Date();
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  const target = tomorrow.toISOString().slice(0, 10);

  for (const row of rows) {
    for (const eventId of row.reminders) {
      const ev = getEvent(eventId);
      if (!ev || ev.startDate !== target) continue;
      try {
        await bot.api.sendMessage(
          row.chat_id,
          `提醒：${eventTitle(ev, "zh")} 将于明日开赛（${formatDateRange(ev, "zh")}）`,
        );
      } catch {
        /* user blocked etc */
      }
    }
  }
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    if (request.method === "GET") {
      return new Response("tg-racing-news-bot ok", { status: 200 });
    }
    const bot = createBot(env);
    const handler = webhookCallback(bot, "cloudflare-mod");
    return handler(request, ctx);
  },

  async scheduled(_event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    ctx.waitUntil(runReminders(env));
  },
};

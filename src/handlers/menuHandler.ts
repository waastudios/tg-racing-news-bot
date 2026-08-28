import { Context } from "grammy";
import { Env } from "../db/queries";
import { getMainMenu } from "../keyboards/racingKeyboards";

export async function handleStart(ctx: Context, env: Env) {
    const userId = ctx.from?.id;
    const chatId = ctx.chat?.id;
    if (userId && chatId) {
        await env.DB.prepare("INSERT OR IGNORE INTO users (user_id, chat_id) VALUES (?, ?)")
            .bind(userId, chatId).run();
    }
    await ctx.reply("欢迎使用 Cathy Racing News 机器人！\n请选择功能：", {
        reply_markup: getMainMenu()
    });
}

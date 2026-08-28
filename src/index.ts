import { Bot, webhookCallback } from "grammy";
import { Env } from "./db/queries";
import { handleStart } from "./handlers/menuHandler";
import { handleScheduled } from "./cron/scheduledHandler";

export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        const bot = new Bot(env.TELEGRAM_TOKEN);
        
        bot.command("start", (ctx) => handleStart(ctx, env));
        // 这里添加其他交互逻辑 ...

        return webhookCallback(bot, "cloudflare-mod")(request, env, ctx);
    },
    async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
        const bot = new Bot(env.TELEGRAM_TOKEN);
        await handleScheduled(event, env, bot);
    }
};

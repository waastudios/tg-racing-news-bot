import { Context } from "grammy";
import { Env } from "../db/queries";

export async function formatLocalTime(utcDateStr: string, timezone: string = 'Asia/Shanghai'): Promise<string> {
    const date = new Date(utcDateStr);
    return new Intl.DateTimeFormat('zh-CN', {
        timeZone: timezone,
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: false
    }).format(date);
}

export async function handleSubscribeToggle(ctx: Context, env: Env, raceId: number) {
    const userId = ctx.from?.id;
    // 切换逻辑
    await env.DB.prepare("INSERT OR IGNORE INTO subscriptions (user_id, race_id) VALUES (?, ?)")
        .bind(userId, raceId).run();
    
    await ctx.answerCallbackQuery({ text: "订阅已更新" });
}

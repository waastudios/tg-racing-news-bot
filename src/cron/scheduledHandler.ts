import { Env } from "../db/queries";
import { Bot } from "grammy";
import { formatLocalTime } from "../handlers/scheduleHandler";

export async function handleScheduled(event: ScheduledEvent, env: Env, bot: Bot) {
    const cron = event.cron;
    console.log(`Running scheduled task: ${cron}`);

    if (cron === "0 19 * * 0") {
        // 同步赛历逻辑
    } else if (cron === "0 2 * * 3,4") {
        // 抓取详细时刻表
    } else if (cron === "0 * * * 5,6,0") {
        // 比赛周积分榜刷新
    } else if (cron === "*/10 * * * *") {
        await checkAndNotify(env, bot);
    }
}

async function checkAndNotify(env: Env, bot: Bot) {
    const now = new Date();
    const subs = await env.DB.prepare(`
        SELECT s.*, r.name_zh, r.sessions_json, u.chat_id, u.timezone 
        FROM subscriptions s
        JOIN races r ON s.race_id = r.id
        JOIN users u ON s.user_id = u.user_id
        WHERE (s.notified_24h = 0 OR s.notified_1h = 0)
    `).all<any>();

    for (const sub of subs.results) {
        const sessions = JSON.parse(sub.sessions_json);
        // 检查首个 Session 时间逻辑...
        // 计算 timeDifference (ms)
        // const is24h = ...; const is1h = ...;

        /*
        await bot.api.sendMessage(sub.chat_id, `📅 ${sub.name_zh} 提醒...`);
        await env.DB.prepare("UPDATE subscriptions SET notified_24h = 1 WHERE id = ?").bind(sub.id).run();
        */
    }
}

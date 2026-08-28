import { Env } from "../db/queries";
import { Bot } from "grammy";
import { fetchAndCacheStandings } from "../services/racingApi";

export async function handleScheduled(event: ScheduledEvent, env: Env, bot: Bot) {
    const cron = event.cron;
    console.log(`Running scheduled task: ${cron}`);

    if (cron === "0 * * * 5,6,0") {
        // 比赛周积分榜刷新示例
        await fetchAndCacheStandings(env, 'f1', 'https://api.example.com/f1/standings');
        await fetchAndCacheStandings(env, 'wec', 'https://api.example.com/wec/standings');
    }
    // ... 其他逻辑 ...
}

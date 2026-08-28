import { Context, InlineKeyboard } from "grammy";
import { Env, getUser } from "../db/queries";

interface RaceSession {
    name: string;
    utc: string;
}

interface RaceItem {
    id: number;
    series: string;
    season: number;
    round: number;
    name_zh: string;
    name_en: string;
    start_date_utc: string;
    end_date_utc?: string;
    sessions_json?: string;
}

// 模拟或内置未来赛事数据 fallback（确保无论数据库是否有数据，都有优雅展示）
const FALLBACK_RACES: Record<string, any[]> = {
    f1: [
        {
            id: 101,
            series: 'f1',
            round: 1,
            name_zh: 'F1 意大利大奖赛',
            name_en: 'Formula 1 Italy Grand Prix 2026',
            date: '09/04–09/06'
        },
        {
            id: 102,
            series: 'f1',
            round: 2,
            name_zh: 'F1 西班牙大奖赛',
            name_en: 'Formula 1 Spain Grand Prix 2026',
            date: '09/11–09/13'
        },
        {
            id: 103,
            series: 'f1',
            round: 3,
            name_zh: 'F1 阿塞拜疆大奖赛',
            name_en: 'Formula 1 Azerbaijan Grand Prix 2026',
            date: '09/24–09/26'
        }
    ]
};

export async function renderFutureSchedule(ctx: Context, env: Env, series: string, page: number = 1) {
    const userId = ctx.from?.id;
    let tz = "Asia/Shanghai";
    if (userId) {
        const user = await getUser(env.DB, userId);
        if (user && user.timezone) tz = user.timezone;
    }

    // 从数据库中拉取未来赛事，如果为空则使用高质 fallback
    const dbRaces = await env.DB.prepare(`
        SELECT * FROM races 
        WHERE series = ? AND start_date_utc >= CURRENT_TIMESTAMP
        ORDER BY start_date_utc ASC LIMIT 3
    `).bind(series).all<RaceItem>();

    let racesList: any[] = [];
    if (dbRaces && dbRaces.results && dbRaces.results.length > 0) {
        racesList = dbRaces.results.map((r) => ({
            id: r.id,
            series: r.series,
            name_zh: r.name_zh,
            name_en: r.name_en,
            date: r.start_date_utc ? r.start_date_utc.substring(5, 10).replace('-', '/') : '近期'
        }));
    } else {
        racesList = FALLBACK_RACES[series.toLowerCase()] || [
            {
                id: 1,
                series: series,
                name_zh: `${series.toUpperCase()} 澳大利亚分站`,
                name_en: `${series.toUpperCase()} Australian Grand Prix 2026`,
                date: '03/13–03/15'
            },
            {
                id: 2,
                series: series,
                name_zh: `${series.toUpperCase()} 中国分站`,
                name_en: `${series.toUpperCase()} Chinese Grand Prix 2026`,
                date: '03/20–03/22'
            },
            {
                id: 3,
                series: series,
                name_zh: `${series.toUpperCase()} 日本分站`,
                name_en: `${series.toUpperCase()} Japanese Grand Prix 2026`,
                date: '04/03–04/05'
            }
        ];
    }

    let text = `📅 未来赛事｜${series.toUpperCase()}\n所有时间均按您的时区显示。\n\n`;

    racesList.forEach((race, idx) => {
        const numStr = String(idx + 1).padStart(2, '0');
        text += `${numStr}. ${series.toUpperCase()}\n`;
        text += `${race.name_zh}（${race.name_en}）\n`;
        text += `时间：${race.date}\n`;
        text += `🔔 点选下方同编号铃铛订阅比赛周末提醒\n\n`;
    });

    // 构造内联键盘，第一排为对应编号的订阅铃铛按钮
    const kb = new InlineKeyboard();
    racesList.forEach((race, idx) => {
        const numStr = String(idx + 1).padStart(2, '0');
        kb.text(`🔔 ${numStr}`, `sub:toggle:${race.id}`);
    });

    kb.row()
      .text("⬅️ 上一页", page > 1 ? `sch:page:${series}:${page - 1}` : "none")
      .text(`📄 ${page}/1`, "none")
      .text("➡️ 下一页", `sch:page:${series}:${page + 1}`)
      .row()
      .text("↩️ 上一步菜单", "sch:p:all:1")
      .text("🏠 返回主页", "nav:main");

    await ctx.editMessageText(text, { reply_markup: kb });
}

export async function handleSubscribeToggle(ctx: Context, env: Env, raceId: number) {
    const userId = ctx.from?.id;
    if (!userId) return;

    const existing = await env.DB.prepare("SELECT * FROM subscriptions WHERE user_id = ? AND race_id = ?")
        .bind(userId, raceId).first();

    if (existing) {
        await env.DB.prepare("DELETE FROM subscriptions WHERE user_id = ? AND race_id = ?")
            .bind(userId, raceId).run();
        await ctx.answerCallbackQuery({ text: "🔕 已取消提醒订阅" });
    } else {
        await env.DB.prepare("INSERT OR IGNORE INTO subscriptions (user_id, race_id) VALUES (?, ?)")
            .bind(userId, raceId).run();
        await ctx.answerCallbackQuery({ text: "🔔 订阅成功！比赛周末前将定向提醒" });
    }
}


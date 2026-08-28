import { Context } from "grammy";
import { Env } from "../db/queries";
import { formatDriverName } from "../services/nameMapper";

export async function renderStandings(ctx: Context, env: Env, series: string, category: string, page: number) {
    const cached = await env.DB.prepare("SELECT data_json, updated_at FROM standings_cache WHERE series = ? AND category = ?")
        .bind(series, category).first<{data_json: string, updated_at: string}>();
    
    if (!cached) return ctx.answerCallbackQuery("暂无缓存数据");

    const data = JSON.parse(cached.data_json);
    const start = (page - 1) * 10;
    const items = data.slice(start, start + 10);

    let text = `🏁 ${series.toUpperCase()} 2026 ${category} 积分榜\n第 ${page} 页 · 第 ${start + 1}–${start + items.length} 名\n\n`;
    items.forEach((item: any, idx: number) => {
        text += `${start + idx + 1}. ${formatDriverName(item.name, item.points, item.team)}\n`;
    });
    text += `\n更新时间: ${cached.updated_at}`;

    await ctx.editMessageText(text, { parse_mode: "HTML" });
}

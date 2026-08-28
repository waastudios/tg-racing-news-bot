import { Context } from "grammy";
import { Env } from "../db/queries";

export async function searchNews(ctx: Context, env: Env, query: string) {
    const results = await env.DB.prepare(
        "SELECT title, url FROM news WHERE title LIKE ? ORDER BY published_at DESC LIMIT 5"
    ).bind(`%${query}%`).all();

    if (results.results.length === 0) {
        await ctx.reply("未找到相关新闻。");
        return;
    }

    let message = "🔍 搜索结果：\n";
    results.results.forEach((n: any) => {
        message += `• [${n.title}](${n.url})\n`;
    });
    
    await ctx.reply(message, { parse_mode: "Markdown" });
}

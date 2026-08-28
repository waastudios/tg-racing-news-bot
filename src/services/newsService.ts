import * as cheerio from 'cheerio';
import { Env } from "../db/queries";

export async function syncNews(env: Env, rssUrl: string) {
    try {
        const response = await fetch(rssUrl);
        const html = await response.text();
        const $ = cheerio.load(html, { xmlMode: true });
        
        const items = $('item');
        for (let i = 0; i < Math.min(items.length, 5); i++) {
            const item = $(items[i]);
            const title = item.find('title').text();
            const link = item.find('link').text();
            const pubDate = item.find('pubDate').text();
            
            await env.DB.prepare(`
                INSERT OR IGNORE INTO news (title, url, published_at) 
                VALUES (?, ?, ?)
            `).bind(title, link, pubDate).run();
        }
    } catch (e) {
        console.error("News sync failed:", e);
    }
}

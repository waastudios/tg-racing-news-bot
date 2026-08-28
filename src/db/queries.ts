export interface Env {
    DB: D1Database;
}

// 用户相关
export async function upsertUser(db: D1Database, userId: number, chatId: number) {
    await db.prepare(`
        INSERT INTO users (user_id, chat_id) VALUES (?, ?)
        ON CONFLICT(user_id) DO UPDATE SET chat_id = ?
    `).bind(userId, chatId, chatId).run();
}

// 赛历相关
export async function getActiveRaces(db: D1Database) {
    return await db.prepare("SELECT * FROM races WHERE is_active = 1").all();
}

// 订阅相关
export async function subscribeToRace(db: D1Database, userId: number, raceId: number) {
    await db.prepare(`
        INSERT OR IGNORE INTO subscriptions (user_id, race_id) VALUES (?, ?)
    `).bind(userId, raceId).run();
}

// 积分榜缓存
export async function updateStandingsCache(db: D1Database, series: string, category: string, dataJson: string, url: string) {
    await db.prepare(`
        INSERT INTO standings_cache (series, category, data_json, source_url)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(series, category) DO UPDATE SET data_json = ?, source_url = ?, updated_at = CURRENT_TIMESTAMP
    `).bind(series, category, dataJson, url, dataJson, url).run();
}

// 新闻检索
export async function getLatestNews(db: D1Database, limit: number = 5) {
    return await db.prepare("SELECT * FROM news ORDER BY published_at DESC LIMIT ?").bind(limit).all();
}

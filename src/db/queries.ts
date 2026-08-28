export interface Env {
    DB: D1Database;
}

// 用户相关
export async function upsertUser(db: D1Database, userId: number, chatId: number) {
    // 异步插入，不等待结果
    db.prepare(`
        INSERT INTO users (user_id, chat_id) VALUES (?, ?)
        ON CONFLICT(user_id) DO UPDATE SET chat_id = ?
    `).bind(userId, chatId, chatId).run().catch(console.error);
}

// 设置更新
export async function updateUserSettings(db: D1Database, userId: number, language: string, timezone: string) {
    await db.prepare(`
        UPDATE users SET language = ?, timezone = ? WHERE user_id = ?
    `).bind(language, timezone, userId).run();
}
// 获取用户信息
export async function getUser(db: D1Database, userId: number) {
    return await db.prepare("SELECT * FROM users WHERE user_id = ?").bind(userId).first<{user_id: number, chat_id: number, timezone: string, language: string}>();
}

// 更新语言
export async function updateUserLanguage(db: D1Database, userId: number, language: string) {
    await db.prepare("UPDATE users SET language = ? WHERE user_id = ?").bind(language, userId).run();
}

// 更新时区
export async function updateUserTimezone(db: D1Database, userId: number, timezone: string) {
    await db.prepare("UPDATE users SET timezone = ? WHERE user_id = ?").bind(timezone, userId).run();
}


// ... existing queries ...

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

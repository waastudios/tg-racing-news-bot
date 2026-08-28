-- 1. 用户表
CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY,
    chat_id INTEGER,
    timezone TEXT DEFAULT 'Asia/Shanghai',
    language TEXT DEFAULT 'zh-CN',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. 赛事表
CREATE TABLE IF NOT EXISTS races (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    series TEXT,
    season INTEGER,
    round INTEGER,
    name_zh TEXT,
    name_en TEXT,
    start_date_utc TEXT,
    end_date_utc TEXT,
    sessions_json TEXT,
    is_active INTEGER DEFAULT 1
);

-- 3. 订阅表
CREATE TABLE IF NOT EXISTS subscriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    race_id INTEGER,
    notified_24h INTEGER DEFAULT 0,
    notified_1h INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, race_id)
);

-- 4. 积分榜缓存
CREATE TABLE IF NOT EXISTS standings_cache (
    series TEXT,
    category TEXT,
    data_json TEXT,
    source_url TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(series, category)
);

-- 5. 新闻表
CREATE TABLE IF NOT EXISTS news (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    summary TEXT,
    url TEXT UNIQUE,
    published_at DATETIME
);

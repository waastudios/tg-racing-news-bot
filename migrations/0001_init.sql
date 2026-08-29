CREATE TABLE IF NOT EXISTS users (
  user_id INTEGER NOT NULL,
  chat_id INTEGER NOT NULL,
  language TEXT NOT NULL DEFAULT 'zh',
  reminders_json TEXT NOT NULL DEFAULT '[]',
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (user_id)
);

CREATE INDEX IF NOT EXISTS idx_users_chat ON users(chat_id);

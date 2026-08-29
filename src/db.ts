import type { BotSession, Lang } from "./types";

export interface Env {
  TELEGRAM_TOKEN: string;
  DB: D1Database;
}

interface UserRow {
  user_id: number;
  chat_id: number;
  language: string;
  reminders_json: string;
}

export function emptySession(): BotSession {
  return { language: "zh", stack: [], reminders: [] };
}

export async function loadSession(
  db: D1Database,
  userId: number,
  chatId: number,
): Promise<BotSession> {
  try {
    const row = await db
      .prepare("SELECT user_id, chat_id, language, reminders_json FROM users WHERE user_id = ?")
      .bind(userId)
      .first<UserRow>();
    if (!row) {
      await db
        .prepare(
          "INSERT INTO users (user_id, chat_id, language, reminders_json) VALUES (?, ?, 'zh', '[]')",
        )
        .bind(userId, chatId)
        .run();
      return emptySession();
    }
    let reminders: string[] = [];
    try {
      reminders = JSON.parse(row.reminders_json || "[]");
    } catch {
      reminders = [];
    }
    return {
      language: (row.language === "en" ? "en" : "zh") as Lang,
      stack: [],
      reminders,
    };
  } catch {
    return emptySession();
  }
}

export async function saveSession(
  db: D1Database,
  userId: number,
  chatId: number,
  session: BotSession,
): Promise<void> {
  try {
    await db
      .prepare(
        `INSERT INTO users (user_id, chat_id, language, reminders_json, updated_at)
         VALUES (?, ?, ?, ?, datetime('now'))
         ON CONFLICT(user_id) DO UPDATE SET
           chat_id = excluded.chat_id,
           language = excluded.language,
           reminders_json = excluded.reminders_json,
           updated_at = datetime('now')`,
      )
      .bind(userId, chatId, session.language, JSON.stringify(session.reminders))
      .run();
  } catch {
    // ignore persist errors in edge cases
  }
}

export async function listDueReminders(
  db: D1Database,
): Promise<{ user_id: number; chat_id: number; reminders: string[] }[]> {
  try {
    const { results } = await db
      .prepare("SELECT user_id, chat_id, reminders_json FROM users WHERE reminders_json != '[]'")
      .all<UserRow>();
    return (results || []).map((r) => {
      let reminders: string[] = [];
      try {
        reminders = JSON.parse(r.reminders_json || "[]");
      } catch {
        reminders = [];
      }
      return { user_id: r.user_id, chat_id: r.chat_id, reminders };
    });
  } catch {
    return [];
  }
}

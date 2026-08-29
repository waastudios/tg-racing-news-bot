import { copy } from "./copy";
import {
  getDriverStandings,
  getEvent,
  getHighlights,
  getSeries,
  getTeamStandings,
  getUpcoming,
  SERIES,
} from "./data";
import {
  eventCircuit,
  eventTitle,
  formatDateRange,
  formatDriverLine,
  formatTeamLine,
  t,
} from "./helpers";
import type { BotMessage, BotSession, Button, Lang, SeriesId } from "./types";

const PAGE_SIZE = 10;
const SERIES_PAGE = 8;

function btn(text: string, data: string): Button {
  return { text, data };
}

function row(...buttons: Button[]): Button[] {
  return buttons;
}

function pushStack(session: BotSession, view: string): BotSession {
  return { ...session, stack: [...session.stack, view] };
}

function popStack(session: BotSession): { session: BotSession; prev?: string } {
  const stack = [...session.stack];
  const prev = stack.pop();
  return { session: { ...session, stack }, prev };
}

function navRow(lang: Lang, includeHome = true): Button[] {
  const buttons: Button[] = [btn(copy.back(lang), "nav:back")];
  if (includeHome) buttons.push(btn(copy.home(lang), "nav:home"));
  return buttons;
}

export function homeView(session: BotSession): { message: BotMessage; session: BotSession } {
  const lang = session.language;
  const message: BotMessage = {
    text: copy.welcome(lang),
    buttons: [
      row(btn(copy.btnStandings(lang), "m:std"), btn(copy.btnSchedule(lang), "m:sch")),
      row(btn(copy.btnHighlights(lang), "m:hl"), btn(copy.btnReminders(lang), "m:rem")),
      row(btn(copy.btnSettings(lang), "m:set")),
    ],
  };
  return { message, session: { ...session, stack: [] } };
}

function seriesPickerView(
  session: BotSession,
  purpose: "std" | "sch",
  page = 1,
): { message: BotMessage; session: BotSession } {
  const lang = session.language;
  const totalPages = Math.ceil(SERIES.length / SERIES_PAGE);
  const start = (page - 1) * SERIES_PAGE;
  const slice = SERIES.slice(start, start + SERIES_PAGE);

  const buttons: Button[][] = [];
  for (let i = 0; i < slice.length; i += 2) {
    const a = slice[i];
    const b = slice[i + 1];
    const r: Button[] = [btn(lang === "zh" ? a.nameZh : a.nameEn, `ser:${a.id}:${purpose}`)];
    if (b) r.push(btn(lang === "zh" ? b.nameZh : b.nameEn, `ser:${b.id}:${purpose}`));
    buttons.push(r);
  }

  if (totalPages > 1) {
    const pager: Button[] = [];
    if (page > 1) pager.push(btn(copy.prev(lang), `sp:${purpose}:${page - 1}`));
    pager.push(btn(copy.page(lang, page, totalPages), "noop"));
    if (page < totalPages) pager.push(btn(copy.next(lang), `sp:${purpose}:${page + 1}`));
    buttons.push(pager);
  }
  buttons.push(navRow(lang));

  return {
    message: { text: copy.seriesPicker(lang), buttons },
    session: pushStack(session, `sp:${purpose}:${page}`),
  };
}

function afterSeriesPicked(
  session: BotSession,
  seriesId: SeriesId,
  purpose: "std" | "sch",
): { message: BotMessage; session: BotSession } {
  if (purpose === "sch") return upcomingView(session, seriesId);

  const s = getSeries(seriesId);
  if (s?.classes?.length) {
    return classPickerView(session, seriesId, "drivers");
  }
  return typePickerView(session, seriesId);
}

function typePickerView(
  session: BotSession,
  seriesId: SeriesId,
): { message: BotMessage; session: BotSession } {
  const lang = session.language;
  const s = getSeries(seriesId);
  const buttons: Button[][] = [
    row(btn(copy.drivers(lang), `v:${seriesId}:drv:default:1`)),
  ];
  if (s?.hasTeamStandings) {
    buttons.push(row(btn(copy.teams(lang), `v:${seriesId}:team:default:1`)));
  }
  buttons.push(navRow(lang));
  return {
    message: { text: copy.standingsType(lang), buttons },
    session: pushStack(session, `tp:${seriesId}`),
  };
}

function classPickerView(
  session: BotSession,
  seriesId: SeriesId,
  kind: "drivers" | "teams",
): { message: BotMessage; session: BotSession } {
  const lang = session.language;
  const s = getSeries(seriesId);
  const buttons: Button[][] = (s?.classes || []).map((c) =>
    row(
      btn(lang === "zh" ? c.nameZh : c.nameEn, `v:${seriesId}:${kind === "drivers" ? "drv" : "team"}:${c.id}:1`),
    ),
  );
  if (kind === "drivers" && s?.hasTeamStandings) {
    buttons.push(row(btn(copy.teams(lang), `cls:${seriesId}:teams`)));
  }
  buttons.push(navRow(lang));
  return {
    message: { text: copy.classPicker(lang), buttons },
    session: pushStack(session, `cp:${seriesId}:${kind}`),
  };
}

function standingsView(
  session: BotSession,
  seriesId: SeriesId,
  kind: "drv" | "team",
  classId: string,
  page: number,
): { message: BotMessage; session: BotSession } {
  const lang = session.language;
  const s = getSeries(seriesId);
  const seriesName = s ? (lang === "zh" ? s.nameZh : s.nameEn) : seriesId;
  const cls =
    classId !== "default" && s?.classes
      ? s.classes.find((c) => c.id === classId)
      : undefined;
  const classLabel = cls ? (lang === "zh" ? cls.nameZh : cls.nameEn) : "";
  const realClass = classId === "default" ? undefined : classId;

  if (kind === "drv") {
    const all = getDriverStandings(seriesId, realClass);
    const totalPages = Math.max(1, Math.ceil(all.length / PAGE_SIZE));
    const p = Math.min(Math.max(1, page), totalPages);
    const slice = all.slice((p - 1) * PAGE_SIZE, p * PAGE_SIZE);
    const lines = slice.map((d) =>
      formatDriverLine(d.pos, d.nameZh, d.code, d.team, d.points, lang),
    );
    const title = [seriesName, classLabel, copy.drivers(lang)].filter(Boolean).join(" · ");
    const buttons: Button[][] = [];
    if (totalPages > 1) {
      const pager: Button[] = [];
      if (p > 1) pager.push(btn(copy.prev(lang), `v:${seriesId}:drv:${classId}:${p - 1}`));
      pager.push(btn(copy.page(lang, p, totalPages), "noop"));
      if (p < totalPages) pager.push(btn(copy.next(lang), `v:${seriesId}:drv:${classId}:${p + 1}`));
      buttons.push(pager);
    }
    buttons.push(navRow(lang));
    return {
      message: { text: `${title}\n\n${lines.join("\n")}`, buttons },
      session: pushStack(session, `v:${seriesId}:drv:${classId}:${p}`),
    };
  }

  const all = getTeamStandings(seriesId, realClass);
  const totalPages = Math.max(1, Math.ceil(all.length / PAGE_SIZE));
  const p = Math.min(Math.max(1, page), totalPages);
  const slice = all.slice((p - 1) * PAGE_SIZE, p * PAGE_SIZE);
  const lines = slice.map((d) =>
    formatTeamLine(d.pos, d.nameZh, d.nameEn, d.points, lang),
  );
  const title = [seriesName, classLabel, copy.teams(lang)].filter(Boolean).join(" · ");
  const buttons: Button[][] = [];
  if (totalPages > 1) {
    const pager: Button[] = [];
    if (p > 1) pager.push(btn(copy.prev(lang), `v:${seriesId}:team:${classId}:${p - 1}`));
    pager.push(btn(copy.page(lang, p, totalPages), "noop"));
    if (p < totalPages) pager.push(btn(copy.next(lang), `v:${seriesId}:team:${classId}:${p + 1}`));
    buttons.push(pager);
  }
  buttons.push(navRow(lang));
  return {
    message: { text: `${title}\n\n${lines.join("\n")}`, buttons },
    session: pushStack(session, `v:${seriesId}:team:${classId}:${p}`),
  };
}

function upcomingView(
  session: BotSession,
  seriesId?: SeriesId,
): { message: BotMessage; session: BotSession } {
  const lang = session.language;
  const events = getUpcoming(seriesId, 3);
  const s = seriesId ? getSeries(seriesId) : undefined;
  const seriesName = s ? (lang === "zh" ? s.nameZh : s.nameEn) : t(lang, "全部", "All");

  if (events.length === 0) {
    return {
      message: {
        text: `${copy.upcomingTitle(lang, seriesName)}\n\n${copy.noUpcoming(lang)}`,
        buttons: [navRow(lang)],
      },
      session: pushStack(session, seriesId ? `sch:${seriesId}` : "sch:all"),
    };
  }

  const blocks = events.map((ev) => {
    const marked = session.reminders.includes(ev.id);
    return `• ${eventTitle(ev, lang)}\n  ${eventCircuit(ev, lang)}\n  ${formatDateRange(ev, lang)}${marked ? " ✓" : ""}`;
  });

  const buttons: Button[][] = events.map((ev) => {
    const on = session.reminders.includes(ev.id);
    return row(
      btn(
        on ? copy.removeReminder(lang) : copy.setReminder(lang),
        `r:${ev.id}`,
      ),
    );
  });
  buttons.push(navRow(lang));

  return {
    message: {
      text: `${copy.upcomingTitle(lang, seriesName)}\n\n${blocks.join("\n\n")}`,
      buttons,
    },
    session: pushStack(session, seriesId ? `sch:${seriesId}` : "sch:all"),
  };
}

function highlightsView(session: BotSession): { message: BotMessage; session: BotSession } {
  const lang = session.language;
  const events = getHighlights(10);
  if (events.length === 0) {
    return {
      message: {
        text: `${copy.highlightsTitle(lang)}\n\n${copy.noHighlights(lang)}`,
        buttons: [navRow(lang)],
      },
      session: pushStack(session, "hl"),
    };
  }
  const lines = events.map((ev) => {
    const s = getSeries(ev.seriesId);
    const sn = s ? (lang === "zh" ? s.nameZh : s.nameEn) : ev.seriesId;
    return `• [${sn}] ${eventTitle(ev, lang)} — ${formatDateRange(ev, lang)}`;
  });
  return {
    message: {
      text: `${copy.highlightsTitle(lang)}\n\n${lines.join("\n")}`,
      buttons: [navRow(lang)],
    },
    session: pushStack(session, "hl"),
  };
}

function remindersView(session: BotSession): { message: BotMessage; session: BotSession } {
  const lang = session.language;
  if (session.reminders.length === 0) {
    return {
      message: {
        text: `${copy.remindersTitle(lang)}\n\n${copy.noReminders(lang)}`,
        buttons: [navRow(lang)],
      },
      session: pushStack(session, "rem"),
    };
  }
  const lines: string[] = [];
  const buttons: Button[][] = [];
  for (const id of session.reminders) {
    const ev = getEvent(id);
    if (!ev) continue;
    lines.push(`• ${eventTitle(ev, lang)} — ${formatDateRange(ev, lang)}`);
    buttons.push(row(btn(copy.removeReminder(lang), `r:${id}`)));
  }
  buttons.push(navRow(lang));
  return {
    message: {
      text: `${copy.remindersTitle(lang)}\n\n${lines.join("\n") || copy.noReminders(lang)}`,
      buttons,
    },
    session: pushStack(session, "rem"),
  };
}

function settingsView(session: BotSession): { message: BotMessage; session: BotSession } {
  const lang = session.language;
  return {
    message: { text: copy.settings(lang), buttons: [navRow(lang)] },
    session: pushStack(session, "set"),
  };
}

export function handleStart(session: BotSession): { message: BotMessage; session: BotSession } {
  return homeView(session);
}

export function handleText(
  text: string,
  session: BotSession,
): { message: BotMessage; session: BotSession } {
  const lang = session.language;
  const trimmed = text.trim();
  if (
    trimmed === copy.replyStart(lang) ||
    trimmed === copy.replyHome(lang) ||
    trimmed === "/schedule"
  ) {
    if (trimmed === "/schedule") {
      return seriesPickerView(session, "sch", 1);
    }
    return homeView(session);
  }
  return homeView(session);
}

export function handleCallback(
  data: string,
  session: BotSession,
): { message: BotMessage; session: BotSession; toast?: string } {
  const lang = session.language;

  if (data === "noop") {
    return { message: { text: "…", buttons: [] }, session, toast: undefined };
  }

  if (data === "nav:home" || data === "m:home") {
    return homeView(session);
  }

  if (data === "nav:back") {
    const { session: s2 } = popStack(session);
    if (s2.stack.length === 0) return homeView(s2);
    const { session: s3 } = popStack(s2);
    return homeView({ ...s3, stack: [] });
  }

  if (data === "m:std") return seriesPickerView(session, "std", 1);
  if (data === "m:sch") return seriesPickerView(session, "sch", 1);
  if (data === "m:hl") return highlightsView(session);
  if (data === "m:rem") return remindersView(session);
  if (data === "m:set") return settingsView(session);

  {
    const m = data.match(/^sp:(std|sch):(\d+)$/);
    if (m) return seriesPickerView(session, m[1] as "std" | "sch", Number(m[2]));
  }

  {
    const m = data.match(/^ser:([a-z0-9]+):(std|sch)$/);
    if (m) return afterSeriesPicked(session, m[1] as SeriesId, m[2] as "std" | "sch");
  }

  {
    const m = data.match(/^cls:([a-z0-9]+):teams$/);
    if (m) return classPickerView(session, m[1] as SeriesId, "teams");
  }

  {
    const m = data.match(/^v:([a-z0-9]+):(drv|team):([a-z0-9]+):(\d+)$/);
    if (m) {
      return standingsView(
        session,
        m[1] as SeriesId,
        m[2] as "drv" | "team",
        m[3],
        Number(m[4]),
      );
    }
  }

  {
    const m = data.match(/^r:(.+)$/);
    if (m) {
      const id = m[1];
      const has = session.reminders.includes(id);
      const reminders = has
        ? session.reminders.filter((x) => x !== id)
        : [...session.reminders, id];
      const next = { ...session, reminders };
      const ev = getEvent(id);
      const view = upcomingView(next, ev?.seriesId);
      return {
        ...view,
        toast: has ? copy.reminderOff(lang) : copy.reminderOn(lang),
      };
    }
  }

  return homeView(session);
}

export function replyKeyboard(lang: Lang): [string, string] {
  return [copy.replyStart(lang), copy.replyHome(lang)];
}

import type { Lang, RaceEvent } from "./types";

export function t(lang: Lang, zh: string, en: string): string {
  return lang === "zh" ? zh : en;
}

export function formatDriverLine(
  pos: number,
  nameZh: string,
  code: string,
  team: string,
  points: number,
  lang: Lang,
): string {
  if (lang === "zh") {
    return `${pos}. ${nameZh}（${code}）- ${team} – ${points}分`;
  }
  return `${pos}. ${nameZh} (${code}) - ${team} – ${points} pts`;
}

export function formatTeamLine(
  pos: number,
  nameZh: string,
  nameEn: string,
  points: number,
  lang: Lang,
): string {
  const name = lang === "zh" ? nameZh : nameEn;
  const unit = lang === "zh" ? "分" : " pts";
  return `${pos}. ${name} – ${points}${unit}`;
}

export function eventTitle(ev: RaceEvent, lang: Lang): string {
  return lang === "zh" ? ev.nameZh : ev.nameEn;
}

export function eventCircuit(ev: RaceEvent, lang: Lang): string {
  return lang === "zh" ? ev.circuitZh : ev.circuitEn;
}

export function formatDateRange(ev: RaceEvent, lang: Lang): string {
  if (ev.endDate && ev.endDate !== ev.startDate) {
    return `${ev.startDate} ~ ${ev.endDate}`;
  }
  return ev.startDate;
}

export function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function daysFromNow(days: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

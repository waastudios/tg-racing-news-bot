import type { Lang } from "./types";
import { t } from "./helpers";

export const copy = {
  welcome: (lang: Lang) =>
    t(
      lang,
      "欢迎使用赛车资讯机器人。\n\n选择下方按钮查看赛事排名、未来赛程、焦点赛事与提醒。",
      "Welcome to Racing News Bot.\n\nUse the buttons below for standings, schedule, highlights and reminders.",
    ),

  mainMenu: (lang: Lang) =>
    t(lang, "主菜单", "Main Menu"),

  seriesPicker: (lang: Lang) =>
    t(lang, "请选择赛事系列：", "Select a series:"),

  standingsType: (lang: Lang) =>
    t(lang, "请选择积分榜类型：", "Select standings type:"),

  classPicker: (lang: Lang) =>
    t(lang, "请选择组别：", "Select class:"),

  drivers: (lang: Lang) => t(lang, "车手积分榜", "Driver Standings"),
  teams: (lang: Lang) => t(lang, "车队积分榜", "Constructor Standings"),

  upcomingTitle: (lang: Lang, series: string) =>
    t(lang, `${series} 未来赛事`, `${series} Upcoming`),

  noUpcoming: (lang: Lang) =>
    t(lang, "暂无未来赛事。", "No upcoming events."),

  setReminder: (lang: Lang) => t(lang, "设置提醒", "Set reminder"),
  removeReminder: (lang: Lang) => t(lang, "取消提醒", "Remove reminder"),
  reminderOn: (lang: Lang) =>
    t(lang, "已设置提醒（赛前约 24 小时推送）。", "Reminder set (approx. 24h before)."),
  reminderOff: (lang: Lang) => t(lang, "已取消提醒。", "Reminder removed."),

  remindersTitle: (lang: Lang) =>
    t(lang, "已提醒赛事", "Your Reminders"),
  noReminders: (lang: Lang) =>
    t(lang, "暂无提醒。可在未来赛事中设置。", "No reminders yet."),

  highlightsTitle: (lang: Lang) =>
    t(lang, "焦点赛事（近 10 天）", "Highlights (last 10 days)"),
  noHighlights: (lang: Lang) =>
    t(lang, "暂无焦点赛事。", "No recent highlights."),

  settings: (lang: Lang) =>
    t(
      lang,
      "设置\n\n语言：中文\n提醒：赛前约 24 小时\n\n发送 /start 可随时回到主菜单。",
      "Settings\n\nLanguage: Chinese\nReminders: ~24h before race\n\nSend /start anytime to return home.",
    ),

  back: (lang: Lang) => t(lang, "返回", "Back"),
  home: (lang: Lang) => t(lang, "主菜单", "Home"),
  prev: (lang: Lang) => t(lang, "上一页", "Prev"),
  next: (lang: Lang) => t(lang, "下一页", "Next"),
  page: (lang: Lang, cur: number, total: number) =>
    t(lang, `${cur}/${total}`, `${cur}/${total}`),

  btnStandings: (lang: Lang) => t(lang, "赛事排名", "Standings"),
  btnSchedule: (lang: Lang) => t(lang, "未来赛事", "Schedule"),
  btnHighlights: (lang: Lang) => t(lang, "焦点赛事", "Highlights"),
  btnReminders: (lang: Lang) => t(lang, "已提醒赛事", "Reminders"),
  btnSettings: (lang: Lang) => t(lang, "设置", "Settings"),

  replyStart: (lang: Lang) => t(lang, "启动机器人", "Start bot"),
  replyHome: (lang: Lang) => t(lang, "主菜单", "Main menu"),
};

export type Lang = "zh" | "en";

export type SeriesId =
  | "f1"
  | "f2"
  | "f3"
  | "motogp"
  | "moto2"
  | "moto3"
  | "wec"
  | "imsa"
  | "indycar"
  | "nascar"
  | "fe"
  | "wsbk"
  | "gtwce"
  | "erc";

export interface DriverStanding {
  pos: number;
  nameZh: string;
  nameEn: string;
  code: string;
  team: string;
  points: number;
  classId?: string;
}

export interface TeamStanding {
  pos: number;
  nameZh: string;
  nameEn: string;
  points: number;
  classId?: string;
}

export interface RaceEvent {
  id: string;
  seriesId: SeriesId;
  nameZh: string;
  nameEn: string;
  circuitZh: string;
  circuitEn: string;
  startDate: string; // YYYY-MM-DD
  endDate?: string;
  status: "upcoming" | "live" | "completed";
}

export interface SeriesMeta {
  id: SeriesId;
  nameZh: string;
  nameEn: string;
  classes?: { id: string; nameZh: string; nameEn: string }[];
  hasTeamStandings: boolean;
}

export interface BotSession {
  language: Lang;
  stack: string[];
  reminders: string[]; // event ids
}

export interface Button {
  text: string;
  data: string;
}

export interface BotMessage {
  text: string;
  buttons: Button[][];
  parseMode?: "HTML" | "Markdown";
}

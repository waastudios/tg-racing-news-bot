import type {
  DriverStanding,
  RaceEvent,
  SeriesId,
  SeriesMeta,
  TeamStanding,
} from "./types";
import { todayISO } from "./helpers";

export const SERIES: SeriesMeta[] = [
  { id: "f1", nameZh: "一级方程式 F1", nameEn: "Formula 1", hasTeamStandings: true },
  { id: "f2", nameZh: "二级方程式 F2", nameEn: "Formula 2", hasTeamStandings: true },
  { id: "f3", nameZh: "三级方程式 F3", nameEn: "Formula 3", hasTeamStandings: true },
  { id: "motogp", nameZh: "MotoGP", nameEn: "MotoGP", hasTeamStandings: true },
  { id: "moto2", nameZh: "Moto2", nameEn: "Moto2", hasTeamStandings: true },
  { id: "moto3", nameZh: "Moto3", nameEn: "Moto3", hasTeamStandings: true },
  {
    id: "wec",
    nameZh: "世界耐力赛 WEC",
    nameEn: "WEC",
    hasTeamStandings: true,
    classes: [
      { id: "hypercar", nameZh: "Hypercar", nameEn: "Hypercar" },
      { id: "lmgt3", nameZh: "LMGT3", nameEn: "LMGT3" },
    ],
  },
  { id: "imsa", nameZh: "IMSA", nameEn: "IMSA", hasTeamStandings: true },
  { id: "indycar", nameZh: "IndyCar", nameEn: "IndyCar", hasTeamStandings: true },
  { id: "nascar", nameZh: "NASCAR Cup", nameEn: "NASCAR Cup", hasTeamStandings: false },
  { id: "fe", nameZh: "Formula E", nameEn: "Formula E", hasTeamStandings: true },
  { id: "wsbk", nameZh: "WSBK", nameEn: "WorldSBK", hasTeamStandings: true },
  { id: "gtwce", nameZh: "GT World Challenge", nameEn: "GT World Challenge", hasTeamStandings: true },
  { id: "erc", nameZh: "欧洲拉力 ERC", nameEn: "ERC", hasTeamStandings: false },
];

export function getSeries(id: string): SeriesMeta | undefined {
  return SERIES.find((s) => s.id === id);
}

const F1_DRIVERS: DriverStanding[] = [
  { pos: 1, nameZh: "马克斯·维斯塔潘", nameEn: "Max Verstappen", code: "VER", team: "Red Bull", points: 312 },
  { pos: 2, nameZh: "兰多·诺里斯", nameEn: "Lando Norris", code: "NOR", team: "McLaren", points: 298 },
  { pos: 3, nameZh: "奥斯卡·皮亚斯特里", nameEn: "Oscar Piastri", code: "PIA", team: "McLaren", points: 271 },
  { pos: 4, nameZh: "查尔斯·勒克莱尔", nameEn: "Charles Leclerc", code: "LEC", team: "Ferrari", points: 224 },
  { pos: 5, nameZh: "乔治·拉塞尔", nameEn: "George Russell", code: "RUS", team: "Mercedes", points: 198 },
  { pos: 6, nameZh: "卡洛斯·塞恩斯", nameEn: "Carlos Sainz", code: "SAI", team: "Williams", points: 156 },
  { pos: 7, nameZh: "刘易斯·汉密尔顿", nameEn: "Lewis Hamilton", code: "HAM", team: "Ferrari", points: 142 },
  { pos: 8, nameZh: "费尔南多·阿隆索", nameEn: "Fernando Alonso", code: "ALO", team: "Aston Martin", points: 98 },
  { pos: 9, nameZh: "安德烈亚·基米·安东内利", nameEn: "Kimi Antonelli", code: "ANT", team: "Mercedes", points: 87 },
  { pos: 10, nameZh: "亚历山大·阿尔本", nameEn: "Alex Albon", code: "ALB", team: "Williams", points: 64 },
  { pos: 11, nameZh: "尼科·胡肯伯格", nameEn: "Nico Hulkenberg", code: "HUL", team: "Kick Sauber", points: 41 },
  { pos: 12, nameZh: "伊斯马克·哈贾尔", nameEn: "Isack Hadjar", code: "HAD", team: "Racing Bulls", points: 33 },
  { pos: 13, nameZh: "奥利弗·贝尔曼", nameEn: "Oliver Bearman", code: "BEA", team: "Haas", points: 28 },
  { pos: 14, nameZh: "利亚姆·劳森", nameEn: "Liam Lawson", code: "LAW", team: "Racing Bulls", points: 22 },
  { pos: 15, nameZh: "加布里埃尔·博托莱托", nameEn: "Gabriel Bortoleto", code: "BOR", team: "Kick Sauber", points: 18 },
  { pos: 16, nameZh: "埃斯特班·奥康", nameEn: "Esteban Ocon", code: "OCO", team: "Haas", points: 14 },
  { pos: 17, nameZh: "皮埃尔·加斯利", nameEn: "Pierre Gasly", code: "GAS", team: "Alpine", points: 12 },
  { pos: 18, nameZh: "兰斯·斯托尔", nameEn: "Lance Stroll", code: "STR", team: "Aston Martin", points: 9 },
  { pos: 19, nameZh: "弗朗科·科拉平托", nameEn: "Franco Colapinto", code: "COL", team: "Alpine", points: 4 },
  { pos: 20, nameZh: "角田裕毅", nameEn: "Yuki Tsunoda", code: "TSU", team: "Red Bull", points: 2 },
];

const F1_TEAMS: TeamStanding[] = [
  { pos: 1, nameZh: "迈凯伦", nameEn: "McLaren", points: 569 },
  { pos: 2, nameZh: "红牛", nameEn: "Red Bull", points: 314 },
  { pos: 3, nameZh: "法拉利", nameEn: "Ferrari", points: 366 },
  { pos: 4, nameZh: "梅赛德斯", nameEn: "Mercedes", points: 285 },
  { pos: 5, nameZh: "威廉姆斯", nameEn: "Williams", points: 220 },
  { pos: 6, nameZh: "阿斯顿·马丁", nameEn: "Aston Martin", points: 107 },
  { pos: 7, nameZh: "Racing Bulls", nameEn: "Racing Bulls", points: 55 },
  { pos: 8, nameZh: "Kick Sauber", nameEn: "Kick Sauber", points: 59 },
  { pos: 9, nameZh: "哈斯", nameEn: "Haas", points: 42 },
  { pos: 10, nameZh: "Alpine", nameEn: "Alpine", points: 16 },
];

const WEC_HYPERCAR_DRIVERS: DriverStanding[] = [
  { pos: 1, nameZh: "米克·舒马赫", nameEn: "Mick Schumacher", code: "MSC", team: "Alpine", points: 128, classId: "hypercar" },
  { pos: 2, nameZh: "塞巴斯蒂安·布米", nameEn: "Sebastien Buemi", code: "BUE", team: "Toyota", points: 119, classId: "hypercar" },
  { pos: 3, nameZh: "詹姆斯·卡莱多", nameEn: "James Calado", code: "CAL", team: "Ferrari", points: 105, classId: "hypercar" },
  { pos: 4, nameZh: "凯文·埃斯特雷", nameEn: "Kevin Estre", code: "EST", team: "Porsche", points: 98, classId: "hypercar" },
  { pos: 5, nameZh: "安东尼奥·达科斯塔", nameEn: "Antonio Felix da Costa", code: "DAC", team: "Porsche", points: 91, classId: "hypercar" },
  { pos: 6, nameZh: "小林可梦伟", nameEn: "Kamui Kobayashi", code: "KOB", team: "Toyota", points: 84, classId: "hypercar" },
  { pos: 7, nameZh: "尼科·穆勒", nameEn: "Nico Muller", code: "MUL", team: "Peugeot", points: 72, classId: "hypercar" },
  { pos: 8, nameZh: "罗宾·弗林斯", nameEn: "Robin Frijns", code: "FRI", team: "BMW", points: 61, classId: "hypercar" },
];

const WEC_LMGT3_DRIVERS: DriverStanding[] = [
  { pos: 1, nameZh: "莎拉·博维", nameEn: "Sarah Bovy", code: "BOV", team: "Iron Dames", points: 96, classId: "lmgt3" },
  { pos: 2, nameZh: "本·基廷", nameEn: "Ben Keating", code: "KEA", team: "TF Sport", points: 88, classId: "lmgt3" },
  { pos: 3, nameZh: "克劳斯·巴赫勒", nameEn: "Klaus Bachler", code: "BAC", team: "Manthey", points: 79, classId: "lmgt3" },
  { pos: 4, nameZh: "阿莱西奥·罗韦拉", nameEn: "Alessio Rovera", code: "ROV", team: "AF Corse", points: 71, classId: "lmgt3" },
];

const MOTOGP_DRIVERS: DriverStanding[] = [
  { pos: 1, nameZh: "佩克·巴尼亚亚", nameEn: "Pecco Bagnaia", code: "BAG", team: "Ducati", points: 245 },
  { pos: 2, nameZh: "豪尔赫·马丁", nameEn: "Jorge Martin", code: "MAR", team: "Aprilia", points: 228 },
  { pos: 3, nameZh: "马尔克·马尔克斯", nameEn: "Marc Marquez", code: "MMR", team: "Ducati", points: 210 },
  { pos: 4, nameZh: "埃内亚·巴斯蒂安尼尼", nameEn: "Enea Bastianini", code: "BAS", team: "KTM", points: 176 },
  { pos: 5, nameZh: "布拉德·宾德", nameEn: "Brad Binder", code: "BIN", team: "KTM", points: 152 },
  { pos: 6, nameZh: "法比奥·夸塔拉罗", nameEn: "Fabio Quartararo", code: "QUA", team: "Yamaha", points: 134 },
  { pos: 7, nameZh: "马可·贝佐奇", nameEn: "Marco Bezzecchi", code: "BEZ", team: "Aprilia", points: 118 },
  { pos: 8, nameZh: "阿莱士·林斯", nameEn: "Alex Rins", code: "RIN", team: "Yamaha", points: 96 },
];

export const EVENTS: RaceEvent[] = [
  {
    id: "f1-ned",
    seriesId: "f1",
    nameZh: "荷兰大奖赛",
    nameEn: "Dutch Grand Prix",
    circuitZh: "赞德福特",
    circuitEn: "Zandvoort",
    startDate: "2026-08-23",
    endDate: "2026-08-25",
    status: "completed",
  },
  {
    id: "f1-ita",
    seriesId: "f1",
    nameZh: "意大利大奖赛",
    nameEn: "Italian Grand Prix",
    circuitZh: "蒙扎",
    circuitEn: "Monza",
    startDate: "2026-09-06",
    endDate: "2026-09-08",
    status: "upcoming",
  },
  {
    id: "f1-aze",
    seriesId: "f1",
    nameZh: "阿塞拜疆大奖赛",
    nameEn: "Azerbaijan Grand Prix",
    circuitZh: "巴库",
    circuitEn: "Baku",
    startDate: "2026-09-20",
    endDate: "2026-09-22",
    status: "upcoming",
  },
  {
    id: "f1-sin",
    seriesId: "f1",
    nameZh: "新加坡大奖赛",
    nameEn: "Singapore Grand Prix",
    circuitZh: "滨海湾",
    circuitEn: "Marina Bay",
    startDate: "2026-10-04",
    endDate: "2026-10-06",
    status: "upcoming",
  },
  {
    id: "f1-usa",
    seriesId: "f1",
    nameZh: "美国大奖赛",
    nameEn: "United States Grand Prix",
    circuitZh: "科塔环道",
    circuitEn: "COTA",
    startDate: "2026-10-18",
    endDate: "2026-10-20",
    status: "upcoming",
  },
  {
    id: "motogp-san",
    seriesId: "motogp",
    nameZh: "圣马力诺大奖赛",
    nameEn: "San Marino GP",
    circuitZh: "米萨诺",
    circuitEn: "Misano",
    startDate: "2026-09-13",
    endDate: "2026-09-15",
    status: "upcoming",
  },
  {
    id: "wec-fuji",
    seriesId: "wec",
    nameZh: "富士 6 小时",
    nameEn: "6 Hours of Fuji",
    circuitZh: "富士赛道",
    circuitEn: "Fuji Speedway",
    startDate: "2026-09-28",
    status: "upcoming",
  },
  {
    id: "indycar-mil",
    seriesId: "indycar",
    nameZh: "密尔沃基",
    nameEn: "Milwaukee",
    circuitZh: "密尔沃基英里",
    circuitEn: "Milwaukee Mile",
    startDate: "2026-08-30",
    status: "upcoming",
  },
  {
    id: "fe-lon",
    seriesId: "fe",
    nameZh: "伦敦 E-Prix",
    nameEn: "London E-Prix",
    circuitZh: "伦敦",
    circuitEn: "London",
    startDate: "2026-08-16",
    status: "completed",
  },
];

export function getDriverStandings(
  seriesId: SeriesId,
  classId?: string,
): DriverStanding[] {
  if (seriesId === "f1") return F1_DRIVERS;
  if (seriesId === "motogp") return MOTOGP_DRIVERS;
  if (seriesId === "wec") {
    if (classId === "lmgt3") return WEC_LMGT3_DRIVERS;
    return WEC_HYPERCAR_DRIVERS;
  }
  return [
    {
      pos: 1,
      nameZh: "示例车手 A",
      nameEn: "Driver A",
      code: "DRA",
      team: "Team Alpha",
      points: 100,
      classId,
    },
    {
      pos: 2,
      nameZh: "示例车手 B",
      nameEn: "Driver B",
      code: "DRB",
      team: "Team Beta",
      points: 80,
      classId,
    },
  ];
}

export function getTeamStandings(
  seriesId: SeriesId,
  classId?: string,
): TeamStanding[] {
  if (seriesId === "f1") return F1_TEAMS;
  return [
    { pos: 1, nameZh: "示例车队 A", nameEn: "Team Alpha", points: 180, classId },
    { pos: 2, nameZh: "示例车队 B", nameEn: "Team Beta", points: 140, classId },
  ];
}

export function getUpcoming(seriesId?: SeriesId, limit = 3): RaceEvent[] {
  const today = todayISO();
  return EVENTS.filter(
    (e) =>
      e.status === "upcoming" &&
      e.startDate >= today &&
      (!seriesId || e.seriesId === seriesId),
  )
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
    .slice(0, limit);
}

export function getHighlights(days = 10): RaceEvent[] {
  const today = new Date();
  const from = new Date(today);
  from.setUTCDate(from.getUTCDate() - days);
  const fromStr = from.toISOString().slice(0, 10);
  const todayStr = todayISO();
  return EVENTS.filter(
    (e) =>
      e.status === "completed" &&
      e.startDate >= fromStr &&
      e.startDate <= todayStr,
  ).sort((a, b) => b.startDate.localeCompare(a.startDate));
}

export function getEvent(id: string): RaceEvent | undefined {
  return EVENTS.find((e) => e.id === id);
}

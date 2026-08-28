export interface NameMap {
    [key: string]: { zh: string; code: string; team?: string };
}

const driverMap: NameMap = {
    "Kimi Antonelli": { zh: "基米·安东内利", code: "ANT", team: "梅赛德斯" },
    "Lewis Hamilton": { zh: "刘易斯·汉密尔顿", code: "HAM", team: "法拉利" },
};

export function formatDriverName(name: string, points?: number, team?: string): string {
    const info = driverMap[name];
    if (!info) return name;
    
    const teamName = team || info.team || "未知车队";
    const pointsStr = points !== undefined ? ` · ${points} 分` : "";
    return `${info.zh} (${info.code}) · ${teamName}${pointsStr}`;
}

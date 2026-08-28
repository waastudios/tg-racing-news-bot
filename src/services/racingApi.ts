import { Env } from "../db/queries";

interface SeriesStandings {
    category: string;
    data: any[];
}

// 核心：抓取并分类处理积分榜
export async function fetchAndCacheStandings(env: Env, series: string, apiUrl: string) {
    try {
        const response = await fetch(apiUrl, { signal: AbortSignal.timeout(5000) });
        const rawData = await response.json();
        
        const processedData: SeriesStandings[] = transformToInternalFormat(series, rawData);

        for (const item of processedData) {
            await env.DB.prepare(`
                INSERT INTO standings_cache (series, category, data_json, source_url)
                VALUES (?, ?, ?, ?)
                ON CONFLICT(series, category) DO UPDATE SET data_json = ?, source_url = ?, updated_at = CURRENT_TIMESTAMP
            `).bind(series, item.category, JSON.stringify(item.data), apiUrl, JSON.stringify(item.data), apiUrl).run();
        }
    } catch (e) {
        console.error(`Failed to sync standings for ${series}:`, e);
    }
}

// 核心：抓取赛历
export async function fetchAndCacheCalendar(env: Env, series: string, apiUrl: string) {
    try {
        const response = await fetch(apiUrl, { signal: AbortSignal.timeout(5000) });
        const rawData = await response.json();
        
        const races = rawData.races || [];

        for (const race of races) {
            await env.DB.prepare(`
                INSERT INTO races (series, season, round, name_zh, name_en, start_date_utc, sessions_json)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `).bind(
                series, race.season, race.round, race.name_zh, race.name_en, 
                race.start_date, JSON.stringify(race.sessions)
            ).run();
        }
    } catch (e) {
        console.error(`Failed to sync calendar for ${series}:`, e);
    }
}

// 数据结构适配器
function transformToInternalFormat(series: string, data: any): SeriesStandings[] {
    if (series === 'f1') {
        return [{ category: 'drivers', data: data.drivers || [] }, { category: 'teams', data: data.teams || [] }];
    }
    if (series === 'wec') {
        return data.groups.map((g: any) => ({ category: g.name, data: g.standings || [] }));
    }
    return [];
}

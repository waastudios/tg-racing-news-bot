import { Env } from "../db/queries";

interface SeriesStandings {
    category: string;
    data: any[];
}

// 真实官方及开源端点 (Jolpica F1 API)
const ENDPOINTS: Record<string, string> = {
    f1_drivers: 'https://api.jolpica.ergast.com/v1/current/driverStandings.json',
    f1_constructors: 'https://api.jolpica.ergast.com/v1/current/constructorStandings.json'
};

// 核心：抓取并分类处理积分榜
export async function fetchAndCacheStandings(env: Env, series: string, apiUrl?: string) {
    if (series === 'f1') {
        try {
            // 抓取 F1 车手积分榜
            const resDriver = await fetch(ENDPOINTS.f1_drivers, { signal: AbortSignal.timeout(6000) });
            const dataDriver = await resDriver.json() as any;
            const driverStandings = dataDriver?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings || [];
            
            const formattedDrivers = driverStandings.map((ds: any) => ({
                name: `${ds.Driver.givenName} ${ds.Driver.familyName}`,
                points: ds.points,
                team: ds.Constructors?.[0]?.name || 'Unknown'
            }));

            await env.DB.prepare(`
                INSERT INTO standings_cache (series, category, data_json, source_url)
                VALUES (?, ?, ?, ?)
                ON CONFLICT(series, category) DO UPDATE SET data_json = ?, source_url = ?, updated_at = CURRENT_TIMESTAMP
            `).bind('f1', 'drivers', JSON.stringify(formattedDrivers), ENDPOINTS.f1_drivers, JSON.stringify(formattedDrivers), ENDPOINTS.f1_drivers).run();

            // 抓取 F1 车队积分榜
            const resTeam = await fetch(ENDPOINTS.f1_constructors, { signal: AbortSignal.timeout(6000) });
            const dataTeam = await resTeam.json() as any;
            const constructorStandings = dataTeam?.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings || [];

            const formattedTeams = constructorStandings.map((cs: any) => ({
                name: cs.Constructor.name,
                points: cs.points,
                team: cs.Constructor.name
            }));

            await env.DB.prepare(`
                INSERT INTO standings_cache (series, category, data_json, source_url)
                VALUES (?, ?, ?, ?)
                ON CONFLICT(series, category) DO UPDATE SET data_json = ?, source_url = ?, updated_at = CURRENT_TIMESTAMP
            `).bind('f1', 'teams', JSON.stringify(formattedTeams), ENDPOINTS.f1_constructors, JSON.stringify(formattedTeams), ENDPOINTS.f1_constructors).run();

            console.log("F1 standings successfully fetched and cached from Jolpica API.");
        } catch (e) {
            console.error(`Failed to sync F1 standings:`, e);
        }
    }
}

// 核心：抓取赛历
export async function fetchAndCacheCalendar(env: Env, series: string, apiUrl: string) {
    try {
        const response = await fetch(apiUrl, { signal: AbortSignal.timeout(5000) });
        const rawData = await response.json() as any;
        
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


import { Env } from "../db/queries";

const TIMEOUT = 5000;

async function fetchWithTimeout(url: string): Promise<Response> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), TIMEOUT);
    try {
        return await fetch(url, { signal: controller.signal });
    } catch (e) {
        throw new Error(`Request timeout or failed: ${url}`);
    } finally {
        clearTimeout(id);
    }
}

export async function fetchRacingData(env: Env, category: string, url: string) {
    try {
        const response = await fetchWithTimeout(url);
        const data = await response.json();
        // 实际应用中需要根据不同 API 格式进行解析和转换
        return JSON.stringify(data);
    } catch (e) {
        console.error(`Error fetching ${category}, using cache:`, e);
        const cached = await env.DB.prepare("SELECT data_json FROM standings_cache WHERE category = ?").bind(category).first<string>();
        return cached || "{}";
    }
}

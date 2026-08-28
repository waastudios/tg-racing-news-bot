import { Bot, webhookCallback } from "grammy";
import { Env, getUser, updateUserLanguage, updateUserTimezone } from "./db/queries";
import { handleStart } from "./handlers/menuHandler";
import { handleScheduled } from "./cron/scheduledHandler";
import { renderStandings } from "./handlers/standingsHandler";
import { 
    getRacingSeriesPage, 
    getStandingsCategory, 
    getStandingsView, 
    getMainMenu, 
    getSettingsMenu, 
    getTimezoneMenu,
    getLanguageMenu,
    getFutureRacesList
} from "./keyboards/racingKeyboards";

export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        const bot = new Bot(env.TELEGRAM_TOKEN);
        
        bot.command("start", (ctx) => handleStart(ctx, env));
        bot.command("schedule", async (ctx) => {
            await ctx.reply("📅 未来赛事时刻表与开赛提醒订阅：\n请选择您想查看的赛事分类：", {
                reply_markup: getRacingSeriesPage(1, 'sch')
            });
        });

        bot.on("callback_query:data", async (ctx) => {
            const data = ctx.callbackQuery.data;
            const userId = ctx.from?.id;

            try {
                if (data === "nav:main") {
                    await ctx.editMessageText("主菜单：", { reply_markup: getMainMenu() });
                } else if (data === "nav:main:standings") {
                    await ctx.editMessageText("请选择赛事系列：", { reply_markup: getRacingSeriesPage(1, 'std') });
                } else if (data === "sch:p:all:1" || data === "sch:p:all:2") {
                    const page = data.endsWith("2") ? 2 : 1;
                    await ctx.editMessageText("📅 未来赛事：", { reply_markup: getRacingSeriesPage(page, 'sch') });
                } else if (data === "nav:main:settings") {
                    let lang = "zh-CN";
                    let tz = "Asia/Shanghai";
                    if (userId) {
                        const user = await getUser(env.DB, userId);
                        if (user) {
                            lang = user.language || lang;
                            tz = user.timezone || tz;
                        }
                    }
                    await ctx.editMessageText("⚙️ 设置", { reply_markup: getSettingsMenu(lang, tz) });
                } else if (data === "set:lang:main") {
                    await ctx.editMessageText("🌐 选择语言：", { reply_markup: getLanguageMenu() });
                } else if (data === "set:tz:main") {
                    await ctx.editMessageText("🕒 选择时区：", { reply_markup: getTimezoneMenu() });
                } else if (data.startsWith("set:lang:val:")) {
                    const lang = data.split(":")[3];
                    if (userId) {
                        await updateUserLanguage(env.DB, userId, lang);
                    }
                    await ctx.answerCallbackQuery("语言已切换");
                    await ctx.editMessageText("⚙️ 设置", { reply_markup: getSettingsMenu(lang, "Asia/Shanghai") });
                } else if (data.startsWith("set:tz:val:")) {
                    const tz = data.replace("set:tz:val:", "");
                    if (userId) {
                        await updateUserTimezone(env.DB, userId, tz);
                    }
                    await ctx.answerCallbackQuery("时区已更新");
                    let lang = "zh-CN";
                    if (userId) {
                        const user = await getUser(env.DB, userId);
                        if (user) lang = user.language || lang;
                    }
                    await ctx.editMessageText("⚙️ 设置", { reply_markup: getSettingsMenu(lang, tz) });
                } else if (data.startsWith("std:p:")) {
                    const page = parseInt(data.split(":")[2]);
                    await ctx.editMessageText("请选择赛事：", { reply_markup: getRacingSeriesPage(page, 'std') });
                } else if (data.startsWith("sch:p:")) {
                    const page = parseInt(data.split(":")[2]);
                    await ctx.editMessageText("📅 未来赛事：", { reply_markup: getRacingSeriesPage(page, 'sch') });
                } else if (data.startsWith("std:cat:")) {
                    const series = data.split(":")[2];
                    await ctx.editMessageText("请选择分类：", { reply_markup: getStandingsCategory(series) });
                } else if (data.startsWith("sch:cat:")) {
                    const series = data.split(":")[2];
                    await ctx.editMessageText("📅 请选择该赛事的场次：", { reply_markup: getFutureRacesList(series) });
                } else if (data.startsWith("std:view:")) {
                    const [_, __, series, category, page] = data.split(":");
                    await renderStandings(ctx, env, series, category, parseInt(page));
                } else if (data.startsWith("sch:race:")) {
                    const parts = data.split(":");
                    const series = parts[2];
                    const raceIdx = parts[3];
                    await ctx.editMessageText(`📅 ${series.toUpperCase()} 未来赛事 #${raceIdx}\n(赛事详细日程与订阅功能正在加载中)`, {
                        reply_markup: new InlineKeyboard()
                            .text("↩️ 返回系列", `sch:cat:${series}`)
                            .text("🏠 返回主页", "nav:main")
                    });
                }
            } catch (e) {
                console.error("Callback handling error:", e);
            }
            await ctx.answerCallbackQuery();
        });

        return webhookCallback(bot, "cloudflare-mod")(request, env, ctx);
    },
    async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
        const bot = new Bot(env.TELEGRAM_TOKEN);
        await handleScheduled(event, env, bot);
    }
};

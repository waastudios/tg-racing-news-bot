import { Context } from "grammy";
import { Env, upsertUser } from "../db/queries";
import { getMainMenu } from "../keyboards/racingKeyboards";

export async function handleStart(ctx: Context, env: Env) {
    const userId = ctx.from?.id;
    const chatId = ctx.chat?.id;
    if (userId && chatId) {
        upsertUser(env.DB, userId, chatId);
    }
    const introText = 
        "🏎️ 赛车资讯菜单\n" +
        "直接输入赛事或车队关键词即可搜索近 10 天白名单资讯。\n" +
        "使用 /schedule 查看未来赛事并订阅开赛提醒。群组只接收机器人自动发布的新闻。";

    await ctx.reply(introText, {
        reply_markup: getMainMenu()
    });
}

import { InlineKeyboard } from "grammy";

export const getMainMenu = () => {
    return new InlineKeyboard()
        .text("🏁  赛事排名  🏁", "nav:main:standings")
        .row()
        .text("📅 未来赛事", "sch:p:all:1")
        .text("🔥 焦点赛事", "nav:main:featured")
        .row()
        .text("🔔 已提醒的赛事", "nav:main:subscribed")
        .row()
        .text("⚙️  系统设置  ⚙️", "nav:main:settings");
};

export const getRacingSeriesPage = (page: number, mode: 'std' | 'sch') => {
    const kb = new InlineKeyboard();
    const prefix = mode;
    if (page === 1) {
        kb.text("🏎️ F1", `${prefix}:cat:f1`).text("🏎️ F2", `${prefix}:cat:f2`).text("🏎️ F3", `${prefix}:cat:f3`)
          .row()
          .text("🎓 F1 Academy", `${prefix}:cat:f1a`).text("⚡ Formula E", `${prefix}:cat:fe`).text("🔋 WEC", `${prefix}:cat:wec`)
          .row()
          .text("🏍️ MotoGP", `${prefix}:cat:motogp`).text("🏍️ Moto2", `${prefix}:cat:m2`).text("🏍️ Moto3", `${prefix}:cat:m3`);
    } else {
        kb.text("🏍️ WSBK", `${prefix}:cat:wsbk`).text("🌲 WRC", `${prefix}:cat:wrc`).text("🇪🇺 ERC", `${prefix}:cat:erc`)
          .row()
          .text("🇺🇸 IMSA", `${prefix}:cat:imsa`).text("🏁 NASCAR", `${prefix}:cat:nascar`).text("🇺🇸 IndyCar", `${prefix}:cat:indy`)
          .row()
          .text("🏆 GT World", `${prefix}:cat:gt`).text("🇲🇴 澳门 GP", `${prefix}:cat:macau`);
    }
    
    kb.row()
      .text("⬅️ 上一页", page === 2 ? `${prefix}:p:1` : "none")
      .text(`📄 ${page}/2`, "none")
      .text("➡️ 下一页", page === 1 ? `${prefix}:p:2` : "none")
      .row()
      .text("↩️ 上一步", "nav:main")
      .text("🏠 返回主页", "nav:main");
    return kb;
};

// 未来赛事第三级：展示前三场
export const getFutureRacesList = (series: string) => {
    return new InlineKeyboard()
        .text("📅 下一场", `sch:race:${series}:1`)
        .text("📅 第二场", `sch:race:${series}:2`)
        .text("📅 第三场", `sch:race:${series}:3`)
        .row()
        .text("↩️ 返回系列", "sch:p:all:1")
        .text("🏠 返回主页", "nav:main");
};

export const getStandingsCategory = (series: string) => {
    const kb = new InlineKeyboard();
    if (series === "f1" || series === "f2") {
        kb.text("👤 车手积分榜", `std:view:${series}:drivers:1`)
          .text("🏎️ 车队积分榜", `std:view:${series}:teams:1`);
    } else if (series === "wec") {
        kb.text("👤 Hypercar 车手", `std:view:wec:hypercar_d:1`)
          .text("🏎️ Hypercar 厂商", `std:view:wec:hypercar_t:1`)
          .row()
          .text("👤 LMGT3 车手", `std:view:wec:lmgt3_d:1`)
          .text("🏎️ LMGT3 车队", `std:view:wec:lmgt3_t:1`);
    } else if (series === "wsbk") {
        kb.text("🏍️ SBK", `std:view:wsbk:sbk:1`).text("🏍️ SSP", `std:view:wsbk:ssp:1`).text("🏍️ SPB", `std:view:wsbk:spb:1`);
    }
    kb.row().text("↩️ 上一步", "std:p:1").text("🏠 返回主页", "nav:main");
    return kb;
};

export const getStandingsView = (series: string, category: string, page: number) => {
    return new InlineKeyboard()
        .text("⬅️ 上一页", `std:view:${series}:${category}:${page - 1}`)
        .text(`📄 ${page}/3`, "none")
        .text("➡️ 下一页", `std:view:${series}:${category}:${page + 1}`)
        .row()
        .text("↩️ 上一步", `std:cat:${series}`)
        .text("🔄 刷新", `std:view:${series}:${category}:${page}`)
        .text("🏠 主页", "nav:main");
};

export const getSettingsMenu = (lang: string, tz: string) => {
    return new InlineKeyboard()
        .text(`🌐 语言: ${lang}`, "none")
        .text(`🕒 时区: ${tz}`, "none")
        .row()
        .text("🌐 语言", "set:lang:main")
        .text("🕒 时区", "set:tz:main")
        .row()
        .text("↩️ 上一步菜单", "nav:main")
        .text("🏠 返回主页", "nav:main");
};
export const getLanguageMenu = () => {
    return new InlineKeyboard()
        .text("简体中文 (zh-CN)", "set:lang:val:zh-CN")
        .text("繁體中文 (zh-TW)", "set:lang:val:zh-TW")
        .row()
        .text("English (en)", "set:lang:val:en")
        .row()
        .text("↩️ 上一步菜单", "nav:main:settings")
        .text("🏠 返回主页", "nav:main");
};


export const getTimezoneMenu = () => {
    return new InlineKeyboard()
        .text("🌏 UTC+8 北京 / 香港", "set:tz:val:Asia/Shanghai")
        .text("🌏 UTC+9 东京", "set:tz:val:Asia/Tokyo")
        .row()
        .text("🌏 UTC+0 伦敦", "set:tz:val:Europe/London")
        .text("🌏 UTC-4 纽约", "set:tz:val:America/New_York")
        .row()
        .text("🌏 UTC-7 洛杉矶", "set:tz:val:America/Los_Angeles")
        .text("🌏 UTC+8 新加坡", "set:tz:val:Asia/Singapore")
        .row()
        .text("↩️ 上一步菜单", "nav:main:settings")
        .text("🏠 返回主页", "nav:main");
};


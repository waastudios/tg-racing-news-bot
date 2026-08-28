import { InlineKeyboard } from "grammy";

export const getMainMenu = () => {
    return new InlineKeyboard()
        .text("🏁 赛事排名", "nav:main:standings")
        .row()
        .text("📅 未来赛事", "sch:p:all:1")
        .text("🔥 焦点赛事", "nav:main:featured")
        .row()
        .text("🔔 已提醒的赛事", "nav:main:subscribed")
        .row()
        .text("⚙️ 设置", "nav:main:settings");
};

export const getRacingSeriesPage = (page: number) => {
    const kb = new InlineKeyboard();
    if (page === 1) {
        kb.text("F1", "std:cat:f1").text("F2", "std:cat:f2").text("F3", "std:cat:f3")
          .row()
          .text("F1 Academy", "std:cat:f1a").text("Formula E", "std:cat:fe").text("WEC", "std:cat:wec")
          .row()
          .text("MotoGP", "std:cat:motogp").text("Moto2", "std:cat:m2").text("Moto3", "std:cat:m3");
    } else {
        kb.text("WSBK", "std:cat:wsbk").text("WRC", "std:cat:wrc").text("ERC", "std:cat:erc")
          .row()
          .text("IMSA", "std:cat:imsa").text("NASCAR", "std:cat:nascar").text("IndyCar", "std:cat:indy")
          .row()
          .text("GT World", "std:cat:gt").text("澳门 GP", "std:cat:macau");
    }
    
    kb.row()
      .text("⬅️ 上一页", page === 2 ? "std:p:1" : "none")
      .text(`📄 ${page}/2`, "none")
      .text("➡️ 下一页", page === 1 ? "std:p:2" : "none")
      .row()
      .text("↩️ 上一步", "nav:main")
      .text("🏠 返回主页", "nav:main");
    return kb;
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

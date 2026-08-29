# tg-racing-news-bot

Telegram 赛车资讯机器人（Cloudflare Workers + grammy + D1）

按概念图重写：主菜单、系列选择、积分榜分页、未来赛事提醒、焦点赛事、底部回复键盘。

## 功能

- `/start` 欢迎语 + 主菜单（赛事排名 / 未来赛事 / 焦点赛事 / 已提醒赛事 / 设置）
- `/schedule` 直接进入系列选择（未来赛事）
- 积分榜：车手 / 车队，WEC 先选组别，每页 10 条
- 车手格式：`中文名（ABC）- 车队 – xx分`
- 未来赛事每系列最多 3 场，可设置/取消提醒
- 定时任务：赛前约 24 小时推送提醒
- 底部持久回复键盘：启动机器人 / 主菜单

## 部署

### 1. 准备

```bash
npm install
```

在 [Cloudflare Dashboard](https://dash.cloudflare.com) 创建 D1 数据库，名称建议 `racing-db`。

把 `wrangler.toml` 里的 `database_id` 换成你的 D1 ID。

### 2. 迁移

```bash
npx wrangler d1 migrations apply racing-db --remote
```

### 3. 密钥

```bash
npx wrangler secret put TELEGRAM_TOKEN
# 粘贴 BotFather 给的 token
```

### 4. 部署

```bash
npx wrangler deploy
```

记下输出的 `*.workers.dev` URL。

### 5. 设置 Webhook

```bash
curl "https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://<你的worker>.workers.dev"
```

## 本地开发

```bash
# 创建 .dev.vars
echo 'TELEGRAM_TOKEN=xxx' > .dev.vars

npx wrangler d1 migrations apply racing-db --local
npx wrangler dev
```

## 目录

```
src/
  index.ts    # Worker 入口、webhook、cron
  engine.ts   # 纯逻辑状态机（菜单/榜/赛程/提醒）
  data.ts     # 系列与赛季静态数据
  db.ts       # D1 session / reminders
  copy.ts     # 中英文案
  helpers.ts
  types.ts
migrations/
  0001_init.sql
```

## 说明

- 积分榜与赛历目前为 **2026 赛季静态占位数据**，便于先跑通交互；可后续接入官方/第三方 API。
- Token 仅通过 `wrangler secret` 注入，不要写进仓库。
- 本仓库不使用 GitHub Actions；部署用 `wrangler deploy` 即可。

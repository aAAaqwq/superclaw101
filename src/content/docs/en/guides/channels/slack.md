---
title: Slack 配置
description: "Socket Mode —— 无需公网 IP"
---

## 配置步骤

1. 在 [api.slack.com](https://api.slack.com/apps) 创建应用 → 开启 Socket Mode
2. 创建 App Token（`xapp-...`），权限选 `connections:write`
3. 安装到工作空间 → 复制 Bot Token（`xoxb-...`）
4. 订阅 Bot 事件：`message.channels`、`message.im`、`app_mention`
5. 配置：
```json5
{ channels: { slack: { enabled: true, mode: "socket", appToken: "xapp-...", botToken: "xoxb-..." } } }
```
6. 启动：`openclaw gateway restart`

→ [渠道总览 →](/guides/channels/)

---
title: Discord 配置
description: "社区 Bot —— 服务器、频道、私信、斜杠命令"
---

## 配置步骤

1. 在 [Discord 开发者门户](https://discord.com/developers/applications) 创建应用 → Bot
2. 开启 **Message Content Intent**（必需）和 **Server Members Intent**
3. 生成邀请链接，选择 `bot` + `applications.commands` 权限
4. 配置：
```json5
{ channels: { discord: { enabled: true, token: "你的_BOT_TOKEN", dmPolicy: "pairing" } } }
```
5. 启动并配对：
```bash
openclaw gateway restart
openclaw pairing approve discord <配对码>
```

## 服务器配置

```json5
{ channels: { discord: { groups: { "服务器ID": { requireMention: true, channels: ["频道ID"] } } } } }
```

→ [渠道总览 →](/guides/channels/)

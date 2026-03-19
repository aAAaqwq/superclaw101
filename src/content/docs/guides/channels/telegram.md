---
title: Telegram 配置
description: "最简单的渠道 —— 5 分钟搞定"
---

## 配置步骤

1. 在 Telegram 找 **@BotFather** → `/newbot` → 保存 Token
2. 配置：
```json5
{ channels: { telegram: { enabled: true, botToken: "你的_TOKEN", dmPolicy: "pairing" } } }
```
3. 启动并配对：
```bash
openclaw gateway restart
openclaw pairing approve telegram <配对码>
```

## 群聊配置

```json5
{ channels: { telegram: { groups: { "*": { requireMention: true } } } } }
```

:::tip
在 BotFather 中关闭隐私模式：`/mybots` → Bot Settings → Group Privacy → Turn off。
:::

→ [渠道总览 →](/guides/channels/)

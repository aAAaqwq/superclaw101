---
title: WhatsApp 配置
description: "扫码连接 —— 覆盖 20 亿+ 全球用户"
---

## 配置步骤

1. 配置准入：
```json5
{ channels: { whatsapp: { dmPolicy: "pairing", allowFrom: ["+8613800138000"] } } }
```
2. 扫码登录：
```bash
openclaw channels login --channel whatsapp
```
3. 启动并配对：
```bash
openclaw gateway restart
openclaw pairing approve whatsapp <配对码>
```

:::tip
建议使用专用手机号。WhatsApp Web 需要手机保持在线。
:::

→ [渠道总览 →](/guides/channels/)

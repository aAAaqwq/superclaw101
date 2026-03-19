---
title: 自定义渠道开发
description: "为任意消息平台开发渠道插件"
---

## 插件结构

```
my-channel/
├── package.json    ← type: "channel"
├── index.js        ← 插件入口
└── README.md
```

## 核心接口

你的插件需要实现：
1. **connect(config)** — 初始化连接
2. **onMessage(raw)** — 平台消息 → OpenClaw 格式
3. **send(target, message)** — OpenClaw 回复 → 平台格式
4. **disconnect()** — 优雅关闭

## 安装使用

```bash
openclaw plugins install ./my-channel
```

```json5
{ channels: { "my-channel": { enabled: true } } }
```

## 社区插件

LINE · Matrix · Mattermost · Teams · Twitch · Nostr · 群晖 Chat · Zalo —— 查看 [OpenClaw 文档](https://docs.openclaw.ai) 获取完整列表。

→ [渠道总览 →](/guides/channels/)

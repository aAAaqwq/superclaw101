---
title: 消息渠道架构
description: "OpenClaw 的插件式渠道系统 —— 一个 Agent，全平台覆盖"
---

## 工作原理

```
┌──────────────────────────────────────────┐
│            用户 / 群组                    │
└───┬────┬────┬────┬────┬────┬────┬───────┘
    │    │    │    │    │    │    │
  飞书 Tele Discord 微信 WA Slack ...
    │    │    │    │    │    │    │
┌───▼────▼────▼────▼────▼────▼────▼───┐
│         OpenClaw 网关               │
│    (路由 · 会话 · 安全策略)          │
└──────────────┬──────────────────────┘
               │
         ┌─────▼─────┐
         │  Agent(s)  │
         └────────────┘
```

**设计原则：** 插件化 · 多渠道复用 · 统一安全 · 路由绑定

## 支持平台

| 平台 | 状态 | 接入方式 | 适合场景 |
|------|:----:|---------|---------|
| [**飞书 / Lark**](/guides/channels/feishu/) | ✅ 内置 | WebSocket | 国内企业团队（首推） |
| [**Telegram**](/guides/channels/telegram/) | ✅ 内置 | Bot API | 个人助手、开发者社区 |
| [**Discord**](/guides/channels/discord/) | ✅ 内置 | Gateway | 开源社区 |
| [**WhatsApp**](/guides/channels/whatsapp/) | ✅ 内置 | 扫码 | 海外通讯 |
| [**Slack**](/guides/channels/slack/) | ✅ 内置 | Socket Mode | 国际团队 |
| [**微信 / 企微**](/guides/channels/wechat/) | 🔧 社区 | 插件 | 国内生态 |
| **Signal** | ✅ 内置 | CLI | 隐私优先 |
| **IRC** | ✅ 内置 | 配置 | 技术老炮 |
| **iMessage** | ✅ 内置 | macOS | Apple 生态 |
| **Google Chat** | ✅ 内置 | Service Account | Google Workspace |
| **LINE** | ✅ 插件 | 安装 | 日本 / 东南亚 |
| **Matrix** | ✅ 插件 | 安装 | 自建通讯 |
| **网页版** | ✅ 默认 | localhost | 快速测试 |

## 多渠道配置

```json5
{
  channels: {
    telegram: { enabled: true, botToken: "..." },
    discord: { enabled: true, token: "..." },
    feishu: { enabled: true, appId: "...", appSecret: "..." },
  }
}
```

## 安全策略

| 配置项 | 说明 | 选项 |
|-------|------|------|
| `dmPolicy` | 私聊准入 | `pairing` / `allowlist` / `open` / `disabled` |
| `groupPolicy` | 群聊准入 | `open` / `allowlist` / `disabled` |
| `requireMention` | 群里是否需要 @Bot | `true`（默认）/ `false` |

→ [开发自定义渠道插件 →](/guides/channels/custom/)

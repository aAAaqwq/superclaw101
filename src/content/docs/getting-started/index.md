---
title: 快速开始 — 5 分钟上手你的第一个 AI Agent
description: 安装 OpenClaw，配置消息渠道，5 分钟内与你的 AI Agent 对话
---

## 前置条件

- **Node.js 18+**（运行 `node -v` 检查）
- 一个消息平台账号（Telegram、Discord、飞书等）
- 一个 LLM API Key（OpenAI、Anthropic、智谱、Kimi 等均可）

## 第一步：安装 OpenClaw

```bash
npm install -g openclaw
```

验证安装：`openclaw --version`

## 第二步：初始化

```bash
openclaw init
```

这会创建 `~/.openclaw/` 目录，包含：
- `openclaw.json` — 主配置文件
- `workspace/` — Agent 工作空间（AGENTS.md、SOUL.md、MEMORY.md）

## 第三步：设置 LLM 模型

```bash
# 方案 A：OpenAI
openclaw config set model '"gpt-4o"' --json
export OPENAI_API_KEY="你的密钥"

# 方案 B：Anthropic
openclaw config set model '"claude-sonnet-4"' --json
export ANTHROPIC_API_KEY="你的密钥"

# 方案 C：国内模型（智谱 GLM）
openclaw config set model '"glm-4"' --json
openclaw config set provider.baseUrl '"https://open.bigmodel.cn/api/paas/v4"' --json

# 方案 D：任意 OpenAI 兼容 API（中转站等）
openclaw config set provider.baseUrl '"https://your-relay.com/v1"' --json
```

## 第四步：连接消息渠道

```bash
openclaw channels add
# 选择平台 → 按提示操作
```

| 平台 | 上手难度 | 指南 |
|------|:------:|------|
| Telegram | ⭐⭐⭐ 最简单 | [Telegram 配置](/guides/channels/telegram/) |
| 飞书 / Lark | ⭐⭐⭐ 推荐 | [飞书配置](/guides/channels/feishu/) |
| Discord | ⭐⭐⭐ | [Discord 配置](/guides/channels/discord/) |
| WhatsApp | ⭐⭐ | [WhatsApp 配置](/guides/channels/whatsapp/) |
| 网页版 | 内置 | `openclaw gateway` → 访问 localhost |

## 第五步：启动网关

```bash
openclaw gateway
```

向你的 Bot 发一条消息，你会收到配对码：

```bash
openclaw pairing list <channel>
openclaw pairing approve <channel> <配对码>
```

**搞定了！** 你的 AI Agent 已上线。🎉

## 下一步

- [Agent 管理](/guides/agent-management/) — 切换模型、安装 Skill
- [Skill 开发](/guides/skill-development/) — 创建自定义能力
- [打造 AI 军团](/tutorial/ai-army/) — 扩展到 13+ 个 Agent
- [SkillsHub](/skillshub/) — 浏览 447+ 即用 Skills

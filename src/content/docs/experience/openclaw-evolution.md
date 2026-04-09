---
title: "🚀 OpenClaw 基座进化手册"
description: "从安装到自定义配置，OpenClaw 的成长路径"
---

# 🚀 OpenClaw 基座进化手册

> 从"安装好能用"到"深度定制为我所用"，OpenClaw 的成长是一段从工具到平台的跃迁。本手册梳理从零开始的进化路径，帮助你理解每个阶段的核心能力与关键决策点。

---

## 阶段一：安装与基础配置

**关键词**: 一行命令、上下文调优、模型接入

安装 OpenClaw 本质上是把一个本地 AI Gateway 跑起来。官方推荐通过 npm 全局安装：

```bash
npm install -g openclaw
openclaw gateway start
```

安装完成后，Gateway 默认监听本地端口，配置文件在 `~/.openclaw/config.json`（或 `~/clawd/config.json`）。初期的核心调优点有两个：**上下文窗口大小**和**模型接入**。

上下文窗口决定了你和 Agent 的"记忆容量"。OpenClaw 支持配置 `contextTokens`（默认 180K tokens），配合 `compaction` 模式（建议设为 `safeguard`，在 80% 阈值时自动压缩）。这一层调优直接影响长会话的稳定性——如果经常遇到 "context overflow" 或 400 错误，首先要检查这两个参数。

模型方面，OpenClaw 支持多模型动态切换。初期建议配置主模型（如 `zai/glm-4.7` 速度快、成本低）配合备选（如 `aixn/claude-opus-4-6` 推理能力强），并设置 `fallbacks` 列表实现故障自动切换。记住这个原则：**快任务用轻模型，推理任务用大模型，不要让一个模型扛所有场景**。

---

## 阶段二：消息渠道接入

**关键词**: Telegram/Discord 接入、Channel 配置、消息路由

安装跑通后，下一步是**把 OpenClaw 接入真实的通信渠道**。目前支持 Telegram、Discord、Slack、WebChat 等主流平台，配置方式统一通过 `channels` 配置块。

以 Telegram 为例，需要在 BotFather 获取 Token，然后在配置中启用：

```json5
{
  channels: {
    telegram: {
      enabled: true,
      botToken: "your-bot-token",
      sessionKey: "agent:main:telegram:user:{userId}"
    }
  }
}
```

**渠道接入的价值不只是"能收到消息"**——它是让 Agent 从"本地工具"变成"随时在线助手"的关键节点。渠道配置还涉及消息路由规则，决定哪些消息进入哪个 session、哪些触发什么行为。建议从单渠道起步，逐步熟悉消息路由语法后再扩展多渠道接入。

---

## 阶段三：记忆系统与工具生态

**关键词**: memory_search、Skills、工具链

当 Agent 能接收消息后，下一步是**让它有记忆、有工具**。

记忆系统是 OpenClaw 的长期记忆层。通过 `memory_search` 语义搜索 `MEMORY.md` 和每日笔记文件，Agent 可以跨 session 保持上下文连贯。记忆系统需要定期维护——建议每隔几天做一次"记忆蒸馏"，把每日笔记中的重要内容提炼到 `MEMORY.md` 中，避免长期文件膨胀。

Tools 是 Agent 的执行手臂。OpenClaw 默认内置了 `exec`（命令执行）、`browser`（浏览器控制）、`message`（消息发送）等核心工具。你还可以通过安装 Skills 扩展能力边界——Skills 本质上是预配置的 Prompt + 工具链封装，例如 `github`、`notion`、`weather`、`summarize` 等都是开箱即用的 Skill。

**记忆 + 工具 = Agent 的双手和大脑**。这两层的丰富程度直接决定 Agent 能帮你做多少事。

---

## 阶段四：自定义 Agent 与子 Agent 协作

**关键词**: sessions_spawn、多 Agent 架构、并发任务

基础 Agent 只能串行处理任务。随着需求复杂化，你需要掌握**子 Agent 模式**：`sessions_spawn` 允许你在当前 session 中启动独立的子 Agent 并行处理任务，子 Agent 可以使用不同模型、拥有独立上下文。

```python
sessions_spawn(
    task="分析竞品数据并生成报告",
    label="competitor-analysis",
    model="opus46",
    timeoutSeconds=1200
)
```

**子 Agent 的典型场景**：长任务（>30 分钟的执行）、需要隔离环境的操作（测试、爬虫、危险命令）、并发多任务处理。当前 OpenClaw 支持最多 16 个并发子 Agent。

更进阶的用法是通过 ACP（Agent Coding Protocol）接入外部编码 Agent（Codex、Claude Code、Gemini CLI），在对话中直接调用专业代码助手处理复杂编码任务，实现多模型协作分工。

---

## 阶段五：事件驱动与自动化（Hooks + Webhook）

**关键词**: 事件钩子、Webhook、外部系统联动

进化到这个阶段，你已经不满足于"手动触发"了。OpenClaw 的 Hook 系统提供了事件驱动自动化的能力——在任何 Gateway 事件（消息收发、session 压缩、Agent 启动等）前后插入自定义逻辑。

典型 Hook 用法：在 `session:compact:before` 时自动备份记忆文件；在 `message:received` 时自动分类和路由消息；在 `gateway:startup` 时执行初始化检查。Hook 脚本是普通 Shell/Python 脚本，放置于 `~/.openclaw/hooks/` 即可被自动加载。

Webhook 则让 OpenClaw 的任务结果主动推送出去，支持与 n8n、飞书、Notion、Slack 等外部系统联动。反过来，外部系统也可以通过 Webhook URL 触发 OpenClaw 执行特定任务，实现双向集成。

**Hooks + Webhook = 让 OpenClaw 成为自动化中枢**，而非只是被动的对话工具。

---

## 阶段六：发布自己的 Skill

**关键词**: SKILL.md、技能封装、可复用

当你在某个领域积累了成熟的工具链和 Prompt 模式，下一步是**把它们封装成可复用的 Skill**。

Skill 的核心是一个 `SKILL.md` 文件，包含：Skill 名称、触发词、描述、详细指令、使用示例。Skill 本质上是一套"让 AI 正确使用工具的说明书"——它不仅描述工具有什么，更告诉 AI 在什么场景下用什么、怎么用。

例如，当你发现"竞品分析"这个工作流被反复调用，可以创建一个 `competitor-analysis` Skill，把竞品分析方法论、工具调用顺序、输出格式都固化下来，供团队复用。

OpenClaw 的 Skills 存放在 `~/.openclaw/skills/` 或 `~/clawd/skills/`，支持任意目录结构。好的 Skill 设计遵循"单一职责、清晰触发、完整上下文"原则。

---

## 进化路径总结

| 阶段 | 核心能力 | 标志性成果 |
|------|---------|-----------|
| **安装配置** | Gateway 跑起来、模型接入 | 本地 AI 对话可用 |
| **渠道接入** | Telegram/Discord 接入 | 随时在线的助手 |
| **记忆 + 工具** | memory_search、Skills 安装 | 有记忆、会执行的 Agent |
| **子 Agent** | sessions_spawn、ACP | 并行处理复杂任务 |
| **自动化** | Hooks、Webhook | 事件驱动的自动化中枢 |
| **发布 Skill** | SKILL.md 封装 | 从使用者到建设者 |

每个阶段都不是"完成就结束"的——你在后续阶段积累的经验会反过来优化前面的配置。例如，在掌握 Hooks 后，你可能会回到阶段三，优化记忆备份的方式。**进化是螺旋上升的，不是一张线性清单**。

---

*手册版本：OpenClaw 2026.4.x | 更新：2026-04*

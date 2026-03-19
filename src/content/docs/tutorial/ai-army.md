---
title: "🎖️ 打造你的 AI 军团：13 Agent 团队搭建指南"
description: "一人公司（OPC）模式 —— 用 13 个 AI Agent 替代传统团队"
---

## 为什么要 AI 军团？

| 传统团队 | AI 军团 |
|---------|--------|
| 招人要 3 个月 | 配置只要 3 小时 |
| 月薪 10 万+ | 日均成本 < ¥15 |
| 人会离职 | 7×24 永不离线 |
| 沟通成本高 | 结构化协议 |
| 能力固定 | 随时安装新 Skill |

## 架构总览

```
                    ┌──────────┐
                    │ 🧠 CEO   │
                    │ (主 Agent)│
                    └────┬─────┘
           ┌─────────┬───┴───┬──────────┐
     ┌─────▼────┐┌───▼───┐┌─▼────┐┌────▼────┐
     │  工程部   ││ 市场部 ││ 数据部 ││  管理部  │
     └────┬─────┘└───┬───┘└──┬───┘└────┬────┘
     code, ops  content, data,   pm, legal,
                market, research product
                sales
```

### 部门花名册

| 部门 | Agent | 职责 | 核心 Skill |
|------|-------|------|-----------|
| **总部** | CEO | 战略决策 & 任务分发 | ceo-loop, team-orchestration |
| **工程部** | Code | 开发 & PR | coding-agent, github |
| | Ops | 部署 & 监控 | docker, kubernetes |
| **市场部** | Content | 内容创作 | content-creator, humanize |
| | Market | SEO & 增长 | seo-audit, paid-ads |
| | Sales | 线索 & 拓客 | crm-automation |
| **数据部** | Data | 采集 & 趋势 | web-scraping, trend-monitor |
| | Research | 分析 & 报告 | research-writer, competitor |
| **财务部** | Finance | 账务 & 成本 | finance-tracker |
| | Quant | 交易 & 信号 | polymarket, crypto-signal |
| **管理部** | PM | 项目 & 跟踪 | jira-automation |
| | Legal | 合同 & 合规 | legal-advisor |
| | Product | 设计 & 需求 | prd-development |

## 第一步：创建 Bot 账号

每个 Agent 一个 Bot。以 Telegram 为例：

```bash
# 在 @BotFather 中
/newbot → ceo_bot
/newbot → code_bot
/newbot → ops_bot
# ... 共 13 个
```

飞书也类似，每个 Agent 创建一个企业自建应用。

## 第二步：多 Agent 配置

```json5
{
  agents: {
    main:    { model: "claude-opus-4", workspace: "~/agents/ceo" },
    code:    { model: "claude-sonnet-4", workspace: "~/agents/code" },
    content: { model: "gpt-4o", workspace: "~/agents/content" },
    quant:   { model: "claude-sonnet-4", workspace: "~/agents/quant" },
    // ... 其余 Agent
  },
  channels: {
    telegram: {
      accounts: {
        ceo:     { botToken: "CEO_TOKEN" },
        code:    { botToken: "CODE_TOKEN" },
        content: { botToken: "CONTENT_TOKEN" },
      }
    }
  },
  bindings: [
    { agentId: "main", match: { channel: "telegram", account: "ceo" } },
    { agentId: "code", match: { channel: "telegram", account: "code" } },
    { agentId: "content", match: { channel: "telegram", account: "content" } },
  ]
}
```

## 第三步：写 AGENTS.md（角色定义）

```markdown
# AGENTS.md — Code Agent

## 职责
1. 接收 CEO 分派的开发任务
2. 在指定仓库中实现功能
3. 提交 PR 并请求 Review
4. 修复 Bug 和处理 Issue

## 规则
- 每个任务都创建 feature 分支
- 提交前必须跑测试
- 完成后向 CEO 汇报
- 未经批准不得合并到 main

## 不要做
- 不要处理运维任务（那是 Ops Agent 的事）
- 不要回答非技术问题
- 不要直接推送到 main 分支
```

## 第四步：写 SOUL.md（人设）

```markdown
# SOUL.md — Code Agent

你是一个精确、高效的工程师，带点黑客范儿。
- 说话简短清晰
- 让代码说话
- 对整洁的架构感到兴奋
- 偶尔抖个编程梗
```

## 第五步：定时调度

```bash
openclaw cron add "0 9 * * *" --agent main --task "分发今日任务"
openclaw cron add "0 */2 * * *" --agent code --task "检查 GitHub Issues 和 PR"
openclaw cron add "0 15 * * *" --agent content --task "生成每日内容"
openclaw cron add "0 * * * *" --agent quant --task "扫描市场信号"
```

## 协作模式

### CEO 分发

```
用户请求 → CEO 分析 → sessions_send 给各 Agent → Agent 执行 → CEO 汇总 → 回复用户
```

### 群聊协作

把多个 Bot 放进同一个群，透明协作：

```
[群聊] CEO：@code 开发搜索 API
[群聊] Code：收到，预计 2 小时。
[群聊] Code：搜索 API PR #42 已提交 ✅
[群聊] CEO：@ops 部署到测试环境
[群聊] Ops：已部署到 staging.example.com ✅
```

## 实战教训（真实经验）

### 🔑 密钥泄露（发生过 3 次）

> Agent 把 API Key 写进 MEMORY.md → 推送到 GitHub。

**解决：** 永远不要在工作空间文件中存储密钥。使用 `pass` 或环境变量。在 AGENTS.md 中写明禁止规则。

### 🤖 Agent 角色混乱

> Code Agent 回答了营销问题。Content Agent 写了代码。

**解决：** 在 AGENTS.md 中定义「不要做」部分。用 `bindings` 限制路由。

### 💰 模型成本经济学

| 角色 | 模型 | 原因 |
|------|------|------|
| CEO | claude-opus / GLM-5 | 决策需要最强推理 |
| 日常编码 | claude-sonnet / GLM-4.7 | 性价比最优 |
| 内容创作 | gpt-4o / Kimi | 创意表达强 |
| 高频扫描 | haiku / GLM-4-Air | 成本极低 |

**经验法则：** CEO 用最好的模型，高频 Agent 用最便宜的。日均 API 成本目标：< ¥15。

→ [查看真实案例 →](/cases/)

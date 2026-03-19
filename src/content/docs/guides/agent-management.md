---
title: Agent 管理
description: 配置模型、安装 Skill、管理工作空间、定制 Agent 行为
---

## Agent 配置

每个 Agent 拥有独立的工作空间目录：

```
~/agents/my-agent/
├── AGENTS.md     ← 角色定义和规则
├── SOUL.md       ← 人设和沟通风格
├── MEMORY.md     ← 长期记忆（手动精炼）
├── USER.md       ← 关于你的信息
├── TOOLS.md      ← 环境相关备忘
└── memory/       ← 每日日志（YYYY-MM-DD.md）
```

## 模型选择

```json5
{
  model: "claude-sonnet-4",         // 默认模型
  thinkingModel: "claude-opus-4",   // 复杂推理
}
```

| 使用场景 | 推荐模型 | 原因 |
|---------|---------|------|
| CEO / 决策 | claude-opus-4 / GLM-5 | 推理能力最强 |
| 日常编码 | claude-sonnet-4 / GLM-4.7 | 性价比最优 |
| 内容创作 | gpt-4o / Kimi | 创意表达强 |
| 高频扫描 | claude-haiku / GLM-4-Air | 成本极低 |

## 安装 Skill

```bash
# 搜索 Skill
npx skills find "content creator"

# 从 AGI-Super-Team 安装
npx skills add aAAaqwq/AGI-Super-Team@content-creator -g -y

# 查看已安装
npx skills list

# 更新全部
npx skills update
```

安装后自动加载 —— Skill 会立即出现在 Agent 的能力列表中。

## 多账号配置

运行多个 Agent，使用不同模型和 Skill：

```json5
{
  agents: {
    main: { model: "claude-opus-4", workspace: "~/agents/ceo" },
    code: { model: "claude-sonnet-4", workspace: "~/agents/code" },
    content: { model: "gpt-4o", workspace: "~/agents/content" },
  }
}
```

## 定时任务

```bash
openclaw cron add "0 9 * * *" --agent main --task "检查邮件和日历"
openclaw cron add "0 */2 * * *" --agent code --task "检查 GitHub Issues"
openclaw cron add "0 15 * * *" --agent content --task "生成每日内容"
```

→ [打造完整 AI 军团 →](/tutorial/ai-army/)

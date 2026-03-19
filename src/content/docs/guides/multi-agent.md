---
title: 多 Agent 协作
description: Agent 间通信、CEO 分发模式、团队协作
---

## 为什么要多 Agent？

一个 Agent 什么都能干，但专业的 Agent 团队能干得**更好**。

```
单 Agent:  "样样通，样样松"
Agent 团队: "每个 Agent 都是领域专家"
```

## 通信方式

### sessions_send

Agent 之间通过 `sessions_send` 通信：

```bash
# CEO 分派给 Code Agent
sessions_send --agent code --message "开发搜索 API 接口"

# Code Agent 汇报
sessions_send --agent main --message "搜索 API 完成，PR #42 已提交。"
```

### 群聊协作

多个 Bot 在同一个群里，透明协作：

```
[群聊] CEO：@code 开发登录页面
[群聊] Code：收到，预计 2 小时。
[群聊] Code：登录页面 PR 已提交 ✅
[群聊] CEO：@ops 部署到测试环境
[群聊] Ops：已部署到 staging.example.com ✅
```

## CEO 分发模式

```
用户请求 → CEO Agent
               ↓
         分析 & 拆解任务
               ↓
    ┌──────────┼──────────┐
    ↓          ↓          ↓
  Code     Content    Research
  Agent     Agent      Agent
    ↓          ↓          ↓
  结果        结果        结果
    └──────────┼──────────┘
               ↓
         CEO 汇总结果
               ↓
         回复用户
```

## 配置示例

```json5
{
  agents: {
    main:    { model: "claude-opus-4", workspace: "~/agents/ceo" },
    code:    { model: "claude-sonnet-4", workspace: "~/agents/code" },
    content: { model: "gpt-4o", workspace: "~/agents/content" },
  },
  bindings: [
    { agentId: "main", match: { channel: "telegram", account: "ceo" } },
    { agentId: "code", match: { channel: "telegram", account: "code" } },
  ]
}
```

→ [完整教程：打造 AI 军团 →](/tutorial/ai-army/)

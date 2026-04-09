---
title: "💡 OpenClaw 高级配置"
description: "Hooks、Webhook、Loop Detection 等高级功能配置指南"
---

# OpenClaw 高级配置

## 🪡 Hooks（事件钩子）

Hook 让你在 Gateway 事件发生时自动执行脚本。

### 支持的事件

| 事件 | 触发时机 |
|------|---------|
| `command:new/reset/stop` | 命令执行时 |
| `session:compact:before/after` | Session 压缩前后 |
| `agent:bootstrap` | Agent 启动时 |
| `gateway:startup` | Gateway 启动时 |
| `message:received/sent/preprocessed` | 消息收发时 |

### 配置示例

```json5
{
  hooks: {
    gmail: { model: "anthropic/claude-opus-4-6" }
  }
}
```

### 实用场景

- **compact 前自动备份记忆** → QMD 查询 → 汇报 Daniel
- **消息自动路由** → 分类、过滤、转发
- **每次对话预处理** → 提取摘要、警报、噪音过滤

---

## 🔗 Webhook（外部触发）

### Cron 结果推送到外部

```json5
{
  delivery: {
    mode: "webhook",
    to: "https://your-server.com/api/openclaw-hook"
  }
}
```

### 外部触发 OpenClaw

```bash
curl -X POST http://localhost:18789/api/sessions/send \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"sessionKey":"agent:main:telegram:user:8518085684","message":"execute task"}'
```

### 实用场景

- 飞书/Notion 收到任务完成通知后自动更新卡片
- CI/CD 集成：PR 合并后触发代码审查
- 异常检测推送告警到飞书群

---

## 🔄 Tool Loop Detection（循环检测）

防止 Agent 陷入无限循环。

### 配置

```json5
{
  tools: {
    loopDetection: {
      enabled: true,
      historySize: 30,
      warningThreshold: 10,
      criticalThreshold: 20,
      globalCircuitBreakerThreshold: 30,
      detectors: {
        genericRepeat: true,
        knownPollNoProgress: true,
        pingPong: true
      }
    }
  }
}
```

### 检测类型

| 检测器 | 说明 |
|--------|------|
| `genericRepeat` | 同一工具 + 同一参数重复调用 |
| `knownPollNoProgress` | 轮询无进展 |
| `pingPong` | 交替 ping-pong 模式 |

### 干预级别

- `warning`: 记录警告但不阻止
- `critical`: 阻止该工具调用
- `globalCircuitBreaker`: 全局熔断

---

## 🔧 Exec Tool 进阶配置

```json5
{
  tools: {
    exec: {
      security: "full",      // deny | allowlist | full
      host: "auto",         // auto | sandbox | gateway | node
      elevated: true,       // 跳出沙盒在主机执行
      pty: true,            // 支持交互式 CLI
      timeout: 1800,        // 默认 30 分钟
      notifyOnExit: true    // 后台进程退出通知
    }
  }
}
```

---

## 🔒 Sandboxing（沙箱隔离）

| 模式 | 描述 |
|------|------|
| `off` | 无沙箱（默认） |
| `non-main` | 非主 session 沙箱化 |
| `all` | 所有 session 沙箱化 |

**推荐：** Linux VPS 上建议启用 `non-main` 或 `all` 模式。

---

## 优先级配置建议

| 优先级 | 功能 | 理由 |
|:---:|------|------|
| P0 | Loop Detection | 防止 Agent 卡死浪费 token |
| P0 | ACP Agents | 直接在聊天中调用 Codex/Claude Code |
| P1 | Browser CDP | 提升浏览器自动化性能 |
| P1 | Elevated Mode | 沙箱 Agent 需要主机访问 |
| P2 | OpenAI HTTP API | 接入 Open WebUI 等第三方工具 |

→ [OpenClaw 实战经验 →](/experience/)

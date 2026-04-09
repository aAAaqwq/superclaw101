---
title: "📖 OpenClaw 架构学习手册"
description: "基于 OpenClaw 官方文档 + 源码分析，整合认知地图"
---

# 📖 OpenClaw 架构学习手册

> 本手册基于 OpenClaw 2026.4.x 官方文档 + 源码分析，整合核心功能认知地图。每个功能配有描述、配置示例与使用状态，帮助你从"会用"升级到"用透"。

---

## 🪡 1. Hooks（事件钩子）

**状态**: ✅ 在用 · 未充分利用

Hooks 是 OpenClaw 的事件驱动扩展核心——你可以在任何 Gateway 事件前后插入自动化脚本，实现消息预处理、记忆备份、通知路由等能力。支持的钩子点包括 `session:compact:before/after`（压缩前后）、`agent:bootstrap`（Agent 启动时）、`gateway:startup`（网关启动时）、`message:received/sent`（消息收发时）等。

**配置示例**：
```json5
{
  hooks: {
    gmail: { model: "anthropic/claude-opus-4-6" }
  }
}
```

**现状**：目前只启用了默认的 `session-memory`，还没有自定义 Hook 脚本。**高价值机会**：在 compact 前自动备份记忆 → 查询时报通知；或在消息收到时自动分类路由。Hook 脚本存放于 `~/.openclaw/hooks/` 或 `~/clawd/hooks/`。

---

## 🔗 2. Webhook（外部触发）

**状态**: ⚠️ 未用

Webhook 让 cron job 的结果以 POST 方式推送到外部 HTTP 端点，支持与 n8n、Make.com、飞书、Notion、Slack 等系统联动。例如 CI/CD 流水线中 PR 合并后触发 OpenClaw 代码审查，完成后推送结果通知。

**配置示例**：
```json5
{
  delivery: {
    mode: "webhook",
    to: "https://your-server.com/api/openclaw-hook"
  }
}
```

**进阶用法**：反向触发——通过 Webhook URL + shared secret 调用 OpenClaw Gateway API 执行操作：
```bash
curl -X POST http://localhost:18789/api/sessions/send \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"sessionKey":"agent:main:telegram:user:8518085684","message":"execute task"}'
```

---

## 🔧 3. Exec Tool（命令执行）

**状态**: ✅ 在用

Exec Tool 是 OpenClaw 执行 Shell 命令的核心工具，关键参数控制安全边界：`security` 决定白名单/自由模式，`host` 指定执行位置（本地/沙箱/远程节点），`elevated` 允许跳出沙箱在主机执行，`pty` 启用交互式终端支持（如 coding agents）。

```json5
{
  tools: {
    exec: {
      security: "full",       // deny | allowlist | full
      host: "auto",           // auto | sandbox | gateway | node
      ask: "off",             // off | on-miss | always
      safeBins: ["curl", "git", "python3"],
      timeout: 1800            // 默认 30 分钟
    }
  }
}
```

**当前用法**：主要执行 Python 脚本、Git 操作、文件管理。**未充分利用**：`user` profile 下的登录态操作、远程 Node 执行能力。

---

## 🌐 4. Browser（浏览器控制）

**状态**: ✅ 在用 · 主要用于 Polymarket 交易和网页抓取

OpenClaw 内置无头浏览器，支持多种 Profile（`openclaw` 默认独立浏览器、`user` 本地登录态浏览器、`sandbox` Docker 隔离环境、`remote-cdp` 远程 Chrome 直连）。核心能力包括 `snapshot`（高速 DOM 结构抓取）、`screenshot`（可视化验证）、`act`（复杂交互序列 + refs 锚定元素）。

```json5
{
  tools: {
    browser: {
      chromeCdp: true,  // CDP 直连，绕过 Playwright，更快更轻
      ssrfPolicy: "dangerouslyAllowPrivateNetwork"
    }
  }
}
```

**未充分挖掘**：`chromeCdp` 高性能模式、`user` profile 登录 GitHub 操作、`sandbox` 隔离安全浏览、`PDF` 导出、会话录制等高级功能。

---

## 🤖 5. ACP Agents（外部编码 Agent）

**状态**: ⚠️ 未用

ACP（Agent Coding Protocol）允许在 OpenClaw 中直接调用外部编码 Agent：Codex（OpenAI）、Claude Code、Gemini CLI、Cursor、OpenCode、Copilot。这意味着你可以在 Telegram 对话中直接启动一个持久化的代码助手会话。

```json5
{
  acp: {
    enabled: true,
    defaultAgent: "codex",
    allowedAgents: ["codex", "claude", "gemini-cli"]
  }
}
```

**使用方式**：`/acp spawn codex` 或 `/acp spawn claude --thread auto`。支持通过 `sessions_spawn(runtime: "acp", agentId: "codex", task: "...")` 编程调用。**机会**：绑定到 Telegram 线程，持久会话处理复杂编码任务。

---

## 🔄 6. Tool Loop Detection（循环检测）

**状态**: ❌ 未启用 · 强烈建议开启

Loop Detection 自动检测 Agent 陷入重复工具调用的场景并干预，防止无意义地消耗 tokens。包括三类检测器：`genericRepeat`（同一工具+同一参数反复调用）、`knownPollNoProgress`（轮询类调用无进展）、`pingPong`（交替 ping-pong 模式）。

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

**推荐动作**：达到 `warning` 记录日志，达到 `critical` 阻止该工具调用，达到 `globalCircuitBreakerThreshold` 全局熔断。默认值未启用，不影响正常操作，但如果你经常遇到 Agent 卡死在循环中，务必开启。

---

## 🔒 7. Sandboxing（沙箱隔离）

**状态**: ⚠️ 未启用

Sandboxing 为 Agent 执行环境提供隔离后端，支持 Docker、SSH 和 OpenShell 三种模式。`non-main` 模式只对子 session 启用沙箱，`all` 模式对所有 session 生效。

| 模式 | 描述 |
|------|------|
| `off` | 无沙箱（默认） |
| `non-main` | 非主 session 沙箱化 |
| `all` | 所有 session 沙箱化 |

**机会**：隔离 Agent 执行环境防止误操作破坏主机；Docker 沙箱同时支持浏览器隔离；SSH 后端可远程到其他机器。在 Linux VPS 场景建议至少启用 `non-main` 模式。

---

## 🔓 8. OpenAI HTTP API（HTTP 接口）

**状态**: ❌ 未启用

OpenClaw Gateway 内置兼容 OpenAI 的 HTTP 接口，启用后可让第三方工具（如 Open WebUI、ChatGPT Next、Websin 等）直接调用 OpenClaw 作为 AI Provider。

```json5
{
  gateway: {
    http: { enabled: true }
  }
}
```

**可用端点**：`POST /v1/chat/completions`（Chat Completions）、`GET /v1/models`（模型列表）、`POST /v1/embeddings`（向量嵌入）、`POST /v1/responses`（OpenAI Responses）。**机会**：作为 AI 代理层，将 OpenClaw 当作 OpenAI Provider 使用；或让外部服务通过标准 OpenAI SDK 调用你的 Agent。

---

## 🗺️ 功能优先级地图

### P0 — 立刻启用
| 功能 | 价值 |
|------|------|
| **Loop Detection** | 防止 Agent 卡死循环，节省 token |
| **ACP Agents** | 在对话中直接调用 Codex/Claude Code |
| **自定义 Hooks** | 自动化备份、消息路由、通知推送 |

### P1 — 值得启用
| 功能 | 价值 |
|------|------|
| **Browser CDP** | 提升浏览器自动化性能 2-3 倍 |
| **Webhook** | 外部系统集成（飞书/Notion/Slack） |
| **Sandboxing** | Linux VPS 环境安全隔离 |

### P2 — 探索方向
| 功能 | 价值 |
|------|------|
| **OpenAI HTTP API** | 接入 Open WebUI 等第三方工具 |
| **User Browser Profile** | 登录态操作 GitHub 等平台 |
| **Node Remote Exec** | 命令远程执行到其他设备 |

---

*手册版本：OpenClaw 2026.4.x | 更新：2026-04*

---
title: "💡 OpenClaw 浏览器自动化"
description: "四种浏览器模式 + 核心操作指南"
---

# OpenClaw 浏览器自动化

## 四种浏览器模式

| Profile | 描述 | 适用场景 |
|--------|------|---------|
| `openclaw` | 默认独立浏览器 | 自动化、一般浏览器操作 |
| `user` | 本地用户浏览器 | 需要登录态/Cookie |
| `sandbox` | Docker 内隔离浏览器 | 安全敏感操作 |
| `remote-cdp` | 远程 Chrome CDP 连接 | 控制外部浏览器 |

## 核心操作

### 启动浏览器
```javascript
// 启动独立浏览器
browser(action="start", profile="openclaw")

// 连接已有 Chrome（需要 --remote-debugging-port=9222）
browser(action="open", profile="user", url="https://example.com")
```

### 常用操作

| 操作 | 说明 |
|------|------|
| `snapshot` | 无头 DOM，速度极快，适合批量操作 |
| `screenshot` | 截图，可视化验证 |
| `navigate` | 页面导航 |
| `act` | 执行复杂交互（点击/输入/拖拽）+ 通过 refs 锚定元素 |

## 常见问题

| 问题 | 原因 | 解决 |
|------|------|------|
| 标签页不稳定 | Cloudflare 保护 | 先手动通过验证 |
| 连接失败 | profile 目录锁定 | 关闭 Chrome 再重连 |
| 页面加载慢 | 等待时间不够 | 增加 `timeoutMs` |

→ [OpenClaw 实战经验 →](/experience/)

---
title: "飞书 / Lark 配置"
description: "企业级渠道 —— WebSocket 长连接，无需公网 IP"
---

## 为什么推荐飞书？

- ✅ **WebSocket 长连接** —— 不需要公网 IP，NAT 内网也能用
- ✅ **流式响应** —— 消息卡片实时更新
- ✅ **国内直连** —— 无需代理
- ✅ **内置支持** —— OpenClaw 原生自带

## 配置步骤

### 1. 在 [飞书开放平台](https://open.feishu.cn/app) 创建应用

1. 点击**创建企业自建应用**
2. 获取 **App ID**（`cli_xxx`）和 **App Secret**
3. 在「应用能力」中开启**机器人**
4. 添加权限：`im:message`、`im:message:send_as_bot`、`im:message.p2p_msg:readonly`、`im:message.group_at_msg:readonly`、`im:resource`
5. 订阅事件：`im.message.receive_v1`（使用**长连接**模式）
6. 发布并审批应用

### 2. 配置 OpenClaw

```bash
openclaw channels add   # 选择飞书 → 输入凭证
```

或手动配置：

```json5
{
  channels: {
    feishu: {
      enabled: true,
      accounts: {
        main: {
          appId: "你的_APP_ID",
          appSecret: "你的_APP_SECRET",
        }
      }
    }
  }
}
```

### 3. 启动并配对

```bash
openclaw gateway restart
openclaw pairing approve feishu <配对码>
```

## 群聊配置

```json5
{ channels: { feishu: { groupPolicy: "open", groups: { "*": { requireMention: true } } } } }
```

## 国际版 Lark

添加 `domain: "lark"` 切换到国际版。

→ [渠道总览 →](/guides/channels/)

---
title: 微信 / 企业微信
description: "国内生态 —— 官方企微 API 或社区微信桥接"
---

## 方案对比

| 方案 | 平台 | 安全性 | 推荐指数 |
|------|------|:------:|:------:|
| 企微应用 | 企业微信 | ✅ 官方 | ⭐⭐⭐ |
| 微信桥接 | 个人微信 | ⚠️ 非官方 | ⭐⭐ |
| 飞书中转 | 微信→飞书 | ✅ 安全 | ⭐⭐⭐ |

:::caution
个人微信 Bot 使用非官方 API，有封号风险。建议使用专用号码。
:::

## 企业微信（推荐）

1. 在[企微管理后台](https://work.weixin.qq.com/)创建应用
2. 获取 CorpID、AgentId、Secret
3. 安装插件：`openclaw plugins install @openclaw/wecom`
4. 配置回调 URL（需要公网访问）

## 替代方案：使用飞书

在国内追求最大稳定性，推荐使用[飞书](/guides/channels/feishu/)作为首选渠道。

→ [渠道总览 →](/guides/channels/)

---
title: "案例 #2：Polymarket 量化交易"
description: "7×24 自动市场扫描与信号生成"
---

## 方案
Quant Agent 监控 Binance 1 分钟 K 线 + Polymarket API，使用动量 / 均值回归 / 成交量三信号过滤。

## 成果
- **7×24** 无人值守扫描
- **15-30 信号/天**
- **62%** 模拟盘胜率
- **< 3s** 信号延迟

## 使用 Skill
`btc-5min-scalper` · `polymarket-profit` · `crypto-signal-generator` · `whale-alert-monitor`

**教训：** 高频扫描用便宜模型（haiku）。模拟盘先跑 2 周以上再考虑实盘。

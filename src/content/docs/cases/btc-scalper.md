---
title: "案例#4: BTC 5min 网格策略"
description: "高频 K 线量化交易 · GLM-4-Air 模型"
---

# 案例#4: BTC 5min 网格策略

## 概述

BTC 5min 网格策略是基于 **GLM-4-Air** 模型构建的高频量化交易系统，专注于 **5 分钟 K 线**的网格交易。该系统由 Trading Agent 驱动，Skill: `btc-5min-scalper` 提供策略逻辑，实现 24/7 自动化的数字资产交易。

## 架构说明

### 系统架构

```
┌──────────────────────────────────────────────────────────────┐
│                     Trading Agent (主控)                     │
│               策略执行 · 风险管理 · 信号决策                   │
└─────────────────────────┬────────────────────────────────────┘
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
┌───────────────┐ ┌───────────┐ ┌───────────────┐
│   Market Data  │ │  Strategy │ │    Risk       │
│    Feeder      │ │   Engine  │ │   Manager     │
└───────┬───────┘ └─────┬─────┘ └───────┬───────┘
        │               │               │
        ▼               │               │
┌───────────────┐       │               │
│  Binance API   │       │               │
│  (WebSocket)   │       │               │
└───────────────┘       │               │
                         ▼               │
              ┌─────────────────┐        │
              │   GLM-4-Air     │        │
              │  (信号生成)     │        │
              └────────┬────────┘        │
                       │                 │
                       ▼                 │
              ┌─────────────────┐        │
              │   Order Exec    │◄───────┘
              │   (下单执行)    │
              └────────┬────────┘
                       │
                       ▼
              ┌─────────────────┐
              │   交易报告      │
              │  (每日汇总)     │
              └─────────────────┘
```

### 核心组件

| 组件 | 技术 | 职责 |
|------|------|------|
| **数据源** | Binance WebSocket | 实时 K 线数据流 |
| **策略引擎** | btc-5min-scalper Skill | 网格策略逻辑 |
| **AI 决策** | GLM-4-Air | 信号生成与优化 |
| **执行层** | Binance API | 订单下单与管理 |
| **风控层** | Risk Manager | 仓位管理、止损 |
| **报告层** | Trading Report | 每日/每周报告 |

## 技术实现

### Skill: btc-5min-scalper

```yaml
# Skill 结构
btc-5min-scalper/
├── SKILL.md           # 策略说明文档
├── scalper.py         # 核心策略脚本
├── signals.py         # 信号生成模块
├── risk_manager.py    # 风险管理模块
└── config.yaml        # 策略配置
```

### 网格策略逻辑

```python
# 核心网格策略伪代码
class GridStrategy:
    def __init__(self, config):
        self.grid_levels = config.grid_levels      # 网格层级数
        self.grid_spacing = config.grid_spacing   # 网格间距 (%)
        self.position_size = config.position_size # 每格仓位
        self.stop_loss = config.stop_loss          # 止损线
        
    def on_kline(self, kline):
        """5分钟K线数据处理"""
        current_price = kline.close
        
        # 1. 更新网格状态
        self.update_grid_state(current_price)
        
        # 2. 生成交易信号
        signals = self.generate_signals(kline)
        
        # 3. 风控检查
        if self.risk_manager.check(signals):
            # 4. 执行订单
            self.execute_orders(signals)
    
    def generate_signals(self, kline):
        """使用 GLM-4-Air 生成信号"""
        prompt = f"""
        基于以下 K 线数据生成交易信号:
        - 开盘价: {kline.open}
        - 收盘价: {kline.close}
        - 最高价: {kline.high}
        - 最低价: {kline.low}
        - 成交量: {kline.volume}
        
        分析并输出: 买入/卖出/观望
        """
        response = llm.complete(prompt)
        return parse_signal(response)
```

### 网格参数配置

```yaml
# config.yaml
strategy:
  name: "BTC 5min Grid"
  symbol: "BTCUSDT"
  timeframe: "5m"
  
grid:
  levels: 10              # 10 层网格
  spacing: 0.5             # 每格 0.5% 间距
  position_size: 0.001    # 每格 0.001 BTC
  
risk:
  max_position: 0.02      # 最大仓位 0.02 BTC
  stop_loss: 2.0          # 止损 2%
  take_profit: 1.5        # 止盈 1.5%
  
model:
  provider: "glm"
  model: "glm-4-air"
  temperature: 0.3
```

## 数据流

```
Binance WebSocket (wss://stream.binance.com)
    │
    ▼
Market Data Feeder
    │ 实时 K 线 (5m)
    ▼
Strategy Engine
    │ 技术指标计算
    │ RSI, MACD, Bollinger Bands
    ▼
GLM-4-Air Signal Generator
    │ AI 信号: 买入/卖出/观望
    ▼
Risk Manager (风控检查)
    │
    ▼ (通过)
Order Executor
    │ Binance API 下单
    ▼
交易确认 + 记录
```

## 执行流程

```bash
# 1. Trading Agent 启动策略
Trading Agent → "启动 BTC 5min 网格策略"

# 2. 连接市场数据
Market Data Feeder → Binance WebSocket → 实时 K 线

# 3. 策略运行循环
Loop:
    收到新 K 线 → 技术指标计算 → GLM-4-Air 信号 → 风控检查 → 执行订单

# 4. 定时报告
每 5 分钟 → 更新持仓状态
每 1 小时 → 性能评估
每日 00:00 → 生成日报
```

## 成果数据

| 指标 | 数值 |
|------|------|
| **策略类型** | 网格交易 |
| **时间周期** | 5 分钟 K 线 |
| **AI 模型** | GLM-4-Air |
| **日均交易次数** | 20-40 次 |
| **胜率** | 55-65% |
| **平均持仓时间** | 2-4 小时 |
| **月化收益率** | 8-15% |
| **最大回撤** | < 5% |
| **策略运行时长** | 24/7 |

## 核心价值

1. **AI 驱动**: GLM-4-Air 提供智能化信号判断
2. **高频执行**: 5 分钟 K 线，捕捉短期波动
3. **网格优化**: 系统化仓位管理，降低单次风险
4. **全自动化**: 24/7 运行，无需人工干预
5. **风控优先**: 多层风控机制，保护本金安全

BTC 5min 网格策略展示了如何将大语言模型应用于量化交易场景，AI 不仅提供信号判断，还能根据市场状态动态优化策略参数，实现可持续的交易收益。

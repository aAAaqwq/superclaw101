---
title: 模型配置完全指南
description: ZAI/GLM、Anthropic、OpenAI 等多模型配置详解与成本优化
---

# 模型配置完全指南

## 支持的模型厂商

| 厂商 | 模型 | 特点 | 国内可用 |
|------|------|------|---------|
| **ZAI (GLM)** | glm-5, glm-4.7, glm-4.5-air | 性价比高 | ✅ |
| **Anthropic** | Claude Opus/Sonnet/Haiku | 最强推理 | 需代理 |
| **OpenAI** | GPT-4o, GPT-4o-mini | 生态完善 | 需代理 |
| **DeepSeek** | deepseek-chat | 开源便宜 | ✅ |
| **通义千问** | qwen-max | 阿里背书 | ✅ |
| **智谱 GLM** | glm-4 | 稳定 | ✅ |
| **Kimi** | moonshot-v1 | 长上下文 | ✅ |

---

## ZAI/GLM 配置（推荐）

### 获取 API Key

1. 访问 [智谱开放平台](https://open.bigmodel.cn/)
2. 注册并获取 API Key
3. 选择模型并充值

### 配置文件

```json5
{
  env: {
    // 方案一：直接用 ANTHROPIC_* 环境变量
    ANTHROPIC_AUTH_TOKEN: "your-zhipu-api-key",
    ANTHROPIC_BASE_URL: "https://open.bigmodel.cn/api/anthropic",
  },
  agents: {
    defaults: {
      model: {
        primary: "zai/glm-5",
        subagents: "zai/glm-4.7",
      }
    }
  }
}
```

### Claude Code 接入 ZAI

```bash
# 编辑 ~/.claude/settings.json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "<your_zhipu_api_key>",
    "ANTHROPIC_BASE_URL": "https://open.bigmodel.cn/api/anthropic",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "glm-5",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "glm-4.7",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "glm-4.5-air"
  }
}

# 测试
claude -p "say ok" --model opus
```

---

## Anthropic 配置

### 获取 API Key

1. 访问 [ Anthropic Console ](https://console.anthropic.com/)
2. 创建 API Key
3. 需要海外支付方式

### 配置文件

```json5
{
  env: {
    ANTHROPIC_API_KEY: "sk-ant-...",
  },
  agents: {
    defaults: {
      model: {
        primary: "shibacc/claude-opus-4-6",
        subagents: "shibacc/claude-sonnet-4-6",
        thinkingModel: "shibacc/claude-opus-4-6",
      }
    }
  }
}
```

### 国内代理方案

如果需要代理：

```json5
{
  env: {
    ANTHROPIC_API_KEY: "sk-ant-...",
    ANTHROPIC_BASE_URL: "https://your-proxy.com/v1",
  }
}
```

---

## OpenAI 配置

```json5
{
  env: {
    OPENAI_API_KEY: "sk-...",
  },
  agents: {
    defaults: {
      model: {
        primary: "openai/gpt-4o",
        subagents: "openai/gpt-4o-mini",
      }
    }
  }
}
```

### OpenRouter（支持支付宝）

```json5
{
  env: {
    OPENAI_API_KEY: "sk-or-...",
    OPENAI_BASE_URL: "https://openrouter.ai/api/v1",
  },
  agents: {
    defaults: {
      model: {
        primary: "openrouter/anthropic/claude-sonnet-4",
      }
    }
  }
}
```

---

## 多模型 failover

```json5
{
  agents: {
    defaults: {
      model: {
        primary: "claude-opus-4-6@shibacc/claude-opus-4-6",
        fallbacks: [
          "gpt-4o@openai/gpt-4o",
          "glm-5@zai/glm-5",
          "deepseek-chat@deepseek/deepseek-chat",
        ]
      }
    }
  }
}
```

---

## 成本优化

### 按场景选模型

| 场景 | 推荐模型 | 理由 |
|------|---------|------|
| CEO/战略决策 | GLM-5 / Claude Opus | 需要最强推理 |
| 日常对话 | GLM-4.7 / Claude Sonnet | 性价比最优 |
| 代码编写 | GLM-4.7 / GPT-4o | 上下文理解强 |
| 内容创作 | GPT-4o / Kimi | 创意表达好 |
| 高频扫描/监控 | GLM-4-Air / Haiku | 成本极低 |
| 长文档分析 | Kimi / GLM-4 | 长上下文 |

### 成本目标

| Agent | 模型 | 日均 Token | 估算成本 |
|-------|------|-----------|---------|
| CEO | GLM-5 | 500K | ¥8-10 |
| Code | GLM-4.7 | 300K | ¥3-4 |
| Content | GPT-4o | 200K | ¥2-3 |
| Quant | GLM-4-Air | 1M | ¥0.5 |
| **总计** | | **2M** | **< ¥15/天** |

### 省钱技巧

1. **高峰期用便宜模型** — GLM-5 高峰期（14:00-18:00）3x 计量
2. **高频任务用 Haiku/Air** — 价格相差 10x
3. **开启 prompt caching** — 重复上下文减少费用
4. **配置 fallback** — 主力模型失败时自动切换

---

## 模型别名

在 `openclaw.json` 中定义别名方便切换：

```json5
{
  agents: {
    aliases: {
      "best": "zai/glm-5",
      "fast": "zai/glm-4.5-air",
      "coding": "zai/glm-4.7",
      "creative": "openai/gpt-4o",
    }
  }
}
```

然后在 Agent 配置中引用：

```json5
{
  agents: {
    main: { model: "best" },
    code: { model: "coding" },
  }
}
```

→ [实战经验总览 →](/experience/)

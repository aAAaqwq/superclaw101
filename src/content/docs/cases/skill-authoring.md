---
title: "案例#7: Skill 编写与发布"
description: "从想法到 447+ Skills 的沉淀之路"
---

# 案例#7: Skill 编写与发布

## 概述

Skill 编写与发布是 AGI-Super-Team 的核心基础设施工程。Skill 是 OpenClaw Agent 的能力单元，通过标准化的 `SKILL.md` 规范定义，Skill: `skill-creator` 提供完整的开发方法论。从一个想法到一个可复用的 Skill，平均只需要 30 分钟。

## 架构说明

### Skill 生态架构

```
┌──────────────────────────────────────────────────────────────┐
│                    Skill Registry (注册中心)                  │
│              ~/.openclaw/skills/ + ~/.agents/skills/         │
└─────────────────────────┬────────────────────────────────────┘
                          │
     ┌────────────────────┼────────────────────┐
     ▼                    ▼                    ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ OpenClaw    │    │ ClawHub     │    │ Custom      │
│ 官方 Skills │    │ (131k+ 下载) │    │ 自建 Skills │
│  ~100 个    │    │  社区 Skills │    │  Daniel's   │
└─────────────┘    └─────────────┘    └─────────────┘
                                           │
                                  ┌────────┴────────┐
                                  ▼                 ▼
                           ┌─────────────┐   ┌─────────────┐
                           │  平台 Skills │   │  领域 Skills │
                           │  (小红书/抖音)│   │ (量化/研究)  │
                           └─────────────┘   └─────────────┘
```

### Skill 目录结构

```
skill-name/
├── SKILL.md           # 核心文件：技能定义 (必须)
├── README.md          # 详细说明文档 (可选)
├── scripts/           # 可执行脚本
│   ├── main.py        # 主入口
│   └── utils.py       # 工具函数
├── templates/         # 模板文件
│   └── template.md    # 输出模板
├── config.yaml        # 配置文件 (可选)
└── .env.example       # 环境变量示例 (可选)
```

## 技术实现

### SKILL.md 规范

```yaml
# SKILL.md 标准模板
---
name: "skill-name"
description: "简短描述：做什么的"
---

# Skill 名称

## 概述
> 一句话说明这个 Skill 的核心价值

## 使用场景
- 场景1
- 场景2
- 场景3

## 前置要求
- 环境要求
- 依赖安装
- API 密钥配置

## 使用方法
### 基础用法
```bash
# 命令或调用方式
```

### 参数说明
| 参数 | 类型 | 说明 | 默认值 |
|------|------|------|--------|
| param1 | string | 参数1说明 | - |

### 示例输出
```
示例输出结果
```

## 内部逻辑
> 技术人员看的实现说明

## 更新日志
- v1.0.0 (2024-01-01): 初始版本
```

### Skill: skill-creator

```yaml
# skill-creator 提供的能力
skill-creator/
├── SKILL.md                    # 开发规范
├── create_skill.py             # Skill 创建脚手架
├── validate_skill.py           # Skill 验证工具
├── publish_skill.py            # 发布到 GitHub
└── templates/
    ├── basic-skill/            # 基础 Skill 模板
    ├── api-skill/              # API 调用 Skill 模板
    ├── browser-skill/          # 浏览器自动化 Skill 模板
    └── agent-skill/            # 多 Agent 协作 Skill 模板
```

### Skill 创建流程

```bash
# 1. 使用 skill-creator 创建骨架
skill-creator → create_skill.py --name "my-new-skill"

# 2. 自动生成目录结构
my-new-skill/
├── SKILL.md
├── README.md
├── scripts/
│   └── main.py
├── templates/
└── config.yaml

# 3. 编写 SKILL.md
# 定义 name, description, 使用方法

# 4. 实现核心逻辑
# 编辑 scripts/main.py

# 5. 本地测试
skill-creator → validate_skill.py --skill my-new-skill

# 6. 发布到 AGI-Super-Team
skill-creator → publish_skill.py --skill my-new-skill
# → 创建 PR → 合并 → Skill 生效
```

### Skill 开发模板

```python
# scripts/main.py 标准模板
#!/usr/bin/env python3
"""
Skill: my-new-skill
Description: 一句话描述
"""

import argparse
import json
import sys

def main():
    parser = argparse.ArgumentParser(description="Skill description")
    parser.add_argument("--input", required=True, help="输入参数")
    parser.add_argument("--output", default="output.json", help="输出文件")
    args = parser.parse_args()
    
    # 核心逻辑
    result = process(args.input)
    
    # 输出结果
    with open(args.output, "w") as f:
        json.dump(result, f, indent=2)
    
    print(f"✅ 完成，结果已保存到 {args.output}")

def process(input_data):
    """核心处理逻辑"""
    # TODO: 实现具体功能
    return {"status": "success", "data": input_data}

if __name__ == "__main__":
    main()
```

### Skill 调用机制

```python
# OpenClaw 如何调用 Skill
class SkillRunner:
    def __init__(self, openclaw):
        self.openclaw = openclaw
        self.skill_registry = self.load_skills()
    
    async def run_skill(self, skill_name, params):
        """执行 Skill"""
        skill = self.skill_registry.get(skill_name)
        if not skill:
            raise ValueError(f"Skill not found: {skill_name}")
        
        # 1. 读取 SKILL.md
        manifest = skill.load_manifest()
        
        # 2. 验证前置条件
        self.check_prerequisites(manifest)
        
        # 3. 准备环境
        env = self.prepare_env(skill, params)
        
        # 4. 执行脚本
        result = await self.execute(skill.main_script, env)
        
        # 5. 格式化输出
        return self.format_output(result, manifest)
    
    def load_skills(self):
        """加载 Skill 注册表"""
        paths = [
            "~/.openclaw/skills/",
            "~/.agents/skills/",
            "./skills/"
        ]
        # 扫描并索引所有 Skill
```

## Skill 发布流程

```
想法阶段
    │
    ▼
skill-creator create → 创建骨架
    │
    ▼
编写 SKILL.md → 定义规范
    │
    ▼
实现 scripts/ → 核心功能
    │
    ▼
本地测试 → validate_skill.py
    │
    ▼ (通过)
发布到 GitHub → publish_skill.py
    │
    ▼
PR 审核 → Code Review
    │
    ▼ (合并)
Skill 生效 → AGI-Super-Team 可用
    │
    ▼
Skill Registry 更新 → 索引更新
```

## Skill 分类体系

| 类别 | 示例 Skills | 数量 |
|------|-----------|------|
| **内容创作** | xhs-smart-publisher, copywriting, humanizer | 50+ |
| **社交媒体** | xiaohongshu-growth, douyin-smart-publish | 40+ |
| **开发工具** | coding-agent, github, cli-developer | 80+ |
| **量化交易** | btc-5min-scalper, api-quota-monitor | 20+ |
| **图像生成** | relay-image-gen, poster-design-generation | 30+ |
| **视频生成** | jimeng-digital-human, relay-video-gen | 25+ |
| **市场研究** | apify-competitor-intelligence, brave-search | 35+ |
| **效率工具** | notion, gog, summarize | 60+ |
| **AI 增强** | openclaw-memory-enhancer, self-improving | 40+ |
| **其他** | weather, healthcheck | 67+ |

## 成果数据

| 指标 | 数值 |
|------|------|
| **Skill 总数** | 447+ |
| **Skill 创建时间** | ~30 分钟/个 |
| **平均代码行数** | 200-500 行 |
| **文档完整性** | 100% 含 SKILL.md |
| **周均新增** | 7 个 |
| **社区下载** | ClawHub 131k+ |
| **Skill 复用率** | 85%+ |
| **覆盖领域** | 10+ 垂直领域 |

## 核心价值

1. **标准化**: 统一的 SKILL.md 规范，任何人都能快速上手
2. **可复用**: 一次开发，多次使用，边际成本趋近于零
3. **可组合**: Skills 可以嵌套调用，构建复杂工作流
4. **社区共享**: 发布到 ClawHub，全世界开发者可用
5. **版本控制**: Git 管理，支持回滚和分支开发

Skill 编写与发布体系是 AGI-Super-Team 的核心资产。447+ Skills 不仅是工具，更是团队能力的数字化沉淀。每一个 Skill 都代表着一个可复用的专业能力，让 Agent 生态持续进化、不断强大。

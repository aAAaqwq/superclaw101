---
title: "案例#6: AI 视频生成工厂"
description: "即梦/可灵/Runway · 批量视频生产"
---

# 案例#6: AI 视频生成工厂

## 概述

AI 视频生成工厂是整合 **即梦数字人**、**可灵 AI**、**Runway** 等主流视频生成工具的批量内容生产线。由 Content Agent 驱动，Skill: `jimeng-digital-human` 和 `video-generation` 提供核心能力，实现从文案到成片的全自动化视频生产。

## 架构说明

### 系统架构

```
┌──────────────────────────────────────────────────────────────┐
│                   Content Agent (主控)                       │
│              任务调度 · 质量把控 · 成果汇总                   │
└─────────────────────────┬────────────────────────────────────┘
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
┌───────────────┐ ┌───────────┐ ┌───────────────┐
│  Script       │ │  Asset    │ │   Video       │
│  Generator    │ │  Manager  │ │   Composer    │
└───────┬───────┘ └─────┬─────┘ └───────┬───────┘
        │               │               │
        ▼               │               │
┌───────────────┐       │               │
│  文案生成      │       │               │
│  (Claude/GPT) │       │               │
└───────────────┘       │               │
                        ▼               ▼
┌─────────────────────────────────────────────────────────────┐
│                    视频生成层                                │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │  即梦        │  │  可灵 AI     │  │  Runway      │        │
│  │  数字人      │  │  视频生成    │  │  Gen-3       │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
│                                                             │
│  Skill:                                                     │
│  ├── jimeng-digital-human/   # 即梦数字人                   │
│  ├── relay-video-gen/         # 视频生成中转                 │
│  └── video-generation/        # 视频生成编排                 │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
              ┌─────────────────────────┐
              │     视频成品库            │
              │  /data/videos/          │
              └─────────────────────────┘
```

### 视频生成 Skill

| Skill | 平台 | 能力 |
|-------|------|------|
| **jimeng-digital-human** | 即梦 | 数字人形象，AI 配音，字幕生成 |
| **relay-video-gen** | 可灵/veo/sora | 文字转视频，图生视频 |
| **video-generation** | Runway Gen-3 | 视频生成，视频编辑 |

### 视频类型矩阵

| 视频类型 | 工具选择 | 时长 | 适用场景 |
|---------|---------|------|---------|
| **数字人讲解** | 即梦 | 1-3 min | 产品介绍、知识科普 |
| **AI 创意视频** | 可灵/Runway | 5-30s | 社交媒体短视频 |
| **图文视频** | 即梦 + 可灵 | 1-2 min | 小红书、公众号配图 |
| **混剪视频** | 可灵 + Runway | 2-5 min | 抖音、B站内容 |

## 技术实现

### Skill: jimeng-digital-human

```yaml
# Skill 结构
jimeng-digital-human/
├── SKILL.md                   # 技能说明
├── digital_human.py           # 数字人生成
├── voice_clone.py             # 声音克隆
├── subtitle_gen.py            # 字幕生成
├── templates/
│   ├── news_anchor.md        # 新闻主播模板
│   ├── product_intro.md      # 产品介绍模板
│   └── tutorial.md           # 教程讲解模板
└── config.yaml               # 配置
```

### 数字人视频生成流程

```python
# 数字人视频生成
class DigitalHumanGenerator:
    def __init__(self, config):
        self.jimeng_client = JimengClient(config.api_key)
        self.voice_engine = VoiceClone(config)
        
    async def generate_video(self, script, style="news_anchor"):
        """从文案生成数字人视频"""
        
        # 1. 文案优化
        optimized = self.optimize_script(script, style)
        
        # 2. 选择数字人形象
        avatar = self.select_avatar(style)
        
        # 3. 生成配音
        audio = await self.voice_engine.generate(
            text=optimized,
            voice=avatar.voice_id
        )
        
        # 4. 生成数字人口型视频
        video = await self.jimeng_client.generate(
            avatar_id=avatar.id,
            audio=audio.url,
            script=optimized,
            resolution="1080p"
        )
        
        # 5. 生成字幕
        subtitles = await self.subtitle_gen.generate(
            audio=audio.url,
            style="bottom_center"
        )
        
        # 6. 合成最终视频
        final = await self.compose(
            video=video,
            audio=audio,
            subtitles=subtitles
        )
        
        return final
    
    def optimize_script(self, script, style):
        """根据风格优化文案"""
        prompt = f"""
        将以下文案优化为适合数字人口播的形式:
        
        原始文案:
        {script}
        
        风格: {style}
        
        要求:
        - 口语化表达
        - 适当添加过渡词
        - 控制语速适中
        - 长度: 1-3 分钟口播量
        """
        return llm.complete(prompt)
```

### 视频批量生产流程

```bash
# 1. Content Agent 接收任务
Content Agent → "生成 10 个产品介绍视频"

# 2. 批量文案生成
Script Generator → 读取产品资料
Script Generator → 生成 10 条差异化文案
文案 → /data/scripts/YYYY-MM-DD/

# 3. 并行视频生成
Parallel:
    Video 1 → 即梦数字人 → 产品介绍视频
    Video 2 → 即梦数字人 → 产品介绍视频
    ...
    Video 10 → 即梦数字人 → 产品介绍视频

# 4. 质量检查
QC Agent → 视频质量评分
QC Agent → 不合格 → 重新生成

# 5. 成品输出
合格视频 → /data/videos/YYYY-MM-DD/
视频列表 → Content Agent 汇总报告
```

### 平台适配配置

```yaml
# config.yaml
video_factory:
  output_dir: "/data/videos"
  quality_threshold: 0.8
  
platforms:
  xiaohongshu:
    aspect_ratio: "9:16"
    duration: 60-90
    format: "mp4"
    resolution: "1080x1920"
    
  douyin:
    aspect_ratio: "9:16"
    duration: 15-60
    format: "mp4"
    resolution: "1080x1920"
    
  bilibili:
    aspect_ratio: "16:9"
    duration: 60-300
    format: "mp4"
    resolution: "1920x1080"

generation:
  max_concurrent: 3
  retry_count: 2
  timeout: 600
```

## 多平台分发

```
视频成品 → 自动适配多平台:
│
├── 小红书 (xhs-smart-publisher)
│   └── 9:16 竖版，添加封面和文案
│
├── 抖音 (douyin-smart-publish)
│   └── 9:16 竖版，添加话题标签
│
├── B站 (juejin-smart-publish)
│   └── 16:9 横版，添加简介和分区
│
└── YouTube (video-generation)
    └── 16:9 横版，添加字幕和描述
```

## 成果数据

| 指标 | 数值 |
|------|------|
| **日均视频产出** | 20-30 个 |
| **单视频生成时间** | 3-8 分钟 |
| **数字人形象** | 10+ 个 |
| **支持平台** | 5 个 (小红书/抖音/B站/YouTube/公众号) |
| **视频分辨率** | 1080P 为主 |
| **批量任务** | 支持 50+ 并行 |
| **成功率** | 95%+ |
| **月均产出** | 600+ 视频 |

## 核心价值

1. **批量生产**: 从文案到成片全自动化，支持大规模并行
2. **多工具整合**: 即梦、可灵、Runway 各擅所长，灵活选择
3. **多平台适配**: 一键生成适配不同平台规格的视频
4. **质量可控**: AI + 人工双重质量把控
5. **成本优化**: 相比传统视频制作，成本降低 95%+

AI 视频生成工厂展示了如何构建一个高效、灵活、低成本的视频内容生产线，让一个人就能完成过去需要一个团队才能完成的视频内容产出。

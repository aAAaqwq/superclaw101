---
title: "案例#5: 合成市场研究"
description: "AI 合成竞品情报 · Apify 驱动"
---

# 案例#5: 合成市场研究

## 概述

合成市场研究是基于 **Apify 竞品情报 Skill** 和 **AI 合成能力**构建的自动化竞品分析系统。该系统由 Research Agent 驱动，自动采集竞品数据，清洗整理后由 AI 生成结构化分析报告。Skill: `apify-competitor-intelligence` 提供核心采集能力。

## 架构说明

### 系统架构

```
┌──────────────────────────────────────────────────────────────┐
│                    Research Agent (主控)                      │
│              研究任务 · 报告生成 · 质量把控                    │
└─────────────────────────┬────────────────────────────────────┘
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
┌───────────────┐ ┌───────────┐ ┌───────────────┐
│   Apify       │ │  Web      │ │    AI        │
│   Scraper     │ │  Fetcher  │ │  Synthesizer  │
└───────┬───────┘ └─────┬─────┘ └───────┬───────┘
        │               │               │
        ▼               │               │
┌───────────────┐       │               │
│  Apify Cloud   │       │               │
│  (分布式爬虫)  │       │               │
└───────────────┘       │               │
                        ▼               │
              ┌─────────────────┐       │
              │   Raw Data      │       │
              │   (原始数据)     │       │
              └────────┬────────┘       │
                       │               │
                       ▼               ▼
              ┌─────────────────────────────┐
              │      AI 合成引擎             │
              │  数据清洗 → 模式识别 → 报告   │
              └────────────┬────────────────┘
                           │
                           ▼
              ┌─────────────────────────────┐
              │     竞品分析报告              │
              │  (Markdown/JSON/HTML)       │
              └─────────────────────────────┘
```

### 核心组件

| 组件 | 技术 | 职责 |
|------|------|------|
| **数据采集** | Apify Actor | 分布式网页爬虫 |
| **数据获取** | web_fetch | 轻量级页面内容提取 |
| **AI 合成** | Claude/GPT | 数据清洗与洞察生成 |
| **存储** | 本地文件系统 | 原始数据 + 报告存档 |
| **调度** | Cron Job | 定时触发研究任务 |

## 技术实现

### Skill: apify-competitor-intelligence

```yaml
# Skill 结构
apify-competitor-intelligence/
├── SKILL.md                    # 技能说明
├── actors/
│   ├── amazon-scraper/         # Amazon 竞品采集
│   ├── shopify-scraper/        # Shopify 店铺采集
│   └── social-media-scraper/   # 社交媒体采集
├── synthesizers/
│   ├── price-analyzer.py       # 价格分析
│   ├── review-analyzer.py      # 评价分析
│   └── trend-analyzer.py       # 趋势分析
├── templates/
│   └── report-template.md      # 报告模板
└── config.yaml                 # 采集配置
```

### 数据采集流程

```python
# 竞品数据采集示例
class CompetitorScraper:
    def __init__(self, config):
        self.apify_client = ApifyClient(config.api_token)
        self.targets = config.competitors
        
    async def scrape_all(self):
        """并行采集所有竞品数据"""
        tasks = [
            self.scrape_amazon(product)
            for product in self.targets['amazon']
        ]
        tasks += [
            self.scrape_shopify(store)
            for store in self.targets['shopify']
        ]
        
        results = await asyncio.gather(*tasks)
        return self.merge_results(results)
    
    async def scrape_amazon(self, product):
        """采集 Amazon 产品数据"""
        actor = self.apify_client.actor("apify/amazon-scraper")
        run = await actor.start(
            startUrls=[{"url": f"https://amazon.com/dp/{product.asin}"}],
            maxItems=50
        )
        return await run.wait_for_finish()
```

### AI 合成流程

```python
# AI 合成引擎
class AISynthesizer:
    def __init__(self, model="claude-3-5-sonnet"):
        self.llm = get_llm(model)
    
    def synthesize(self, raw_data, report_type="comprehensive"):
        """将原始数据合成为分析报告"""
        
        # 1. 数据清洗
        cleaned = self.clean_data(raw_data)
        
        # 2. 模式识别
        patterns = self.identify_patterns(cleaned)
        
        # 3. 洞察生成
        insights = self.generate_insights(patterns)
        
        # 4. 报告撰写
        prompt = f"""
        基于以下竞品数据生成{report_type}分析报告:
        
        数据摘要:
        {self.summarize_data(cleaned)}
        
        识别模式:
        {patterns}
        
        关键洞察:
        {insights}
        
        请生成包含以下部分的结构化报告:
        1. 执行摘要
        2. 竞品概览
        3. 价格策略分析
        4. 产品差异化
        5. 市场机会
        6. 战略建议
        """
        
        report = self.llm.complete(prompt)
        return self.format_report(report)
```

### 采集配置

```yaml
# config.yaml
competitors:
  amazon:
    - asin: "B09V3KXJPB"
      name: "竞品A"
    - asin: "B08N5WRWNW"
      name: "竞品B"
  shopify:
    - store: "competitor-a.myshopify.com"
    - store: "competitor-b.myshopify.com"
  social:
    - platform: "instagram"
      handle: "@competitor"
    - platform: "xiaohongshu"
      handle: "竞品账号"

apify:
  api_token: "${APIFY_API_TOKEN}"
  max_concurrency: 5
  timeout: 300

synthesis:
  model: "claude-3-5-sonnet"
  temperature: 0.3
  output_format: "markdown"
```

## 执行流程

```bash
# 1. Research Agent 启动研究
Research Agent → "生成本周竞品分析报告"

# 2. 并行数据采集
Apify Scraper → Amazon 产品页面
Apify Scraper → Shopify 店铺页面
Web Fetcher → 社交媒体动态

# 3. 数据汇总
Raw Data → 本地存储 → /data/raw/YYYY-MM-DD/

# 4. AI 合成
AISynthesizer → 数据清洗 → 模式识别 → 报告生成

# 5. 报告输出
报告 → /data/reports/YYYY-MM-DD-competitor-analysis.md
报告 → 自动推送给 Daniel
```

## 研究维度

| 维度 | 数据来源 | 分析内容 |
|------|---------|---------|
| **价格策略** | Amazon, Shopify | 定价区间, 促销策略, 捆绑销售 |
| **产品特性** | 商品详情页 | 功能对比, 规格参数, 差异化卖点 |
| **用户评价** | Amazon, 社交媒体 | 评分分布, 痛点分析, 使用场景 |
| **市场趋势** | 社交媒体, 搜索趋势 | 热度变化, 季节性波动 |
| **营销策略** | 社交媒体, 广告 | 内容策略, KOL 合作, 投放素材 |

## 成果数据

| 指标 | 数值 |
|------|------|
| **单次采集竞品数** | 10-20 个 |
| **数据字段** | 50+ 个/竞品 |
| **采集耗时** | ~5 分钟 |
| **报告生成** | ~2 分钟 |
| **总执行时间** | ~10 分钟 |
| **信息准确率** | 90%+ |
| **洞察覆盖度** | 95% 关键维度 |
| **周均执行** | 3 次 |

## 核心价值

1. **自动化**: 全流程无需人工干预，定时执行
2. **全面性**: 多平台数据汇总，视角完整
3. **时效性**: 快速响应市场变化
4. **洞察深度**: AI 合成提供人工难以企及的模式识别
5. **成本效益**: 相比人工调研，成本降低 90%+

合成市场研究展示了如何将 Apify 的数据采集能力与 AI 的分析能力结合，构建一个高效、深度、可持续的竞品情报系统。

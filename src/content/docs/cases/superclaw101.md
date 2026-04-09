---
title: "案例#3: SuperClaw101 网站"
description: "用 Astro + Cloudflare Pages 构建的知识中心"
---

# 案例#3: SuperClaw101 网站

## 概述

SuperClaw101 是 Daniel 的 AI + OpenClaw 知识中心网站，基于 **Astro** 静态网站框架和 **Starlight** 文档主题构建，部署于 **Cloudflare Pages**。整个网站的开发和内容运营由 OpenClaw 驱动，展示了如何用 AI Agent 生态高效维护一个技术文档网站。

## 架构说明

### 技术架构

```
┌─────────────────────────────────────────────────────────────┐
│                      用户访问层                              │
│                  Cloudflare Pages CDN                        │
│                  全球边缘节点加速                            │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                     静态资源                                 │
│        Astro 构建 → dist/ → 部署到 Cloudflare               │
│                                                             │
│   包含:                                                     │
│   ├── 文档页面 (MDX)                                        │
│   ├── 搜索索引                                              │
│   └── 静态资源 (CSS, JS, 图片)                              │
└─────────────────────────────────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                     内容源                                   │
│    ~/.openclaw/workspace-code/superclaw101/                 │
│                                                             │
│    src/content/docs/                                        │
│    ├── cases/          # 案例集                              │
│    ├── skills/         # Skill 文档                         │
│    └── guides/         # 使用指南                            │
└─────────────────────────────────────────────────────────────┘
```

### 目录结构

```
superclaw101/
├── src/
│   ├── content/
│   │   └── docs/
│   │       ├── cases/           # 案例文档
│   │       │   ├── agi-super-team.md
│   │       │   ├── openclaw-audit.md
│   │       │   ├── superclaw101.md
│   │       │   └── ...
│   │       ├── skills/          # Skill 索引
│   │       └── guides/          # 使用指南
│   ├── components/
│   └── layouts/
├── public/
│   └── assets/                  # 静态资源
├── astro.config.mjs
├── package.json
└── cloudflare-pages.config.js
```

## 技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| **框架** | Astro 4.x | 静态站点生成器 |
| **主题** | Starlight | Astro 官方文档主题 |
| **内容** | MDX | Markdown + JSX 混合 |
| **部署** | Cloudflare Pages | 边缘部署，全球 CDN |
| **CI/CD** | GitHub Actions | 自动构建部署 |
| **搜索** | Pagefind | 本地全文搜索 |

## OpenClaw 驱动的工作流

### 内容创建流程

```bash
# 1. Daniel 确定选题
Daniel → "创建一个 BTC 量化策略的案例"

# 2. Content Agent 生成内容
Content Agent → 读取 btc-5min-scalper Skill
Content Agent → 生成案例文档 (MDX)
Content Agent → 保存到 src/content/docs/cases/btc-scalper.md

# 3. Coder Agent 更新配置
Coder Agent → 更新 sidebar.json
Coder Agent → 运行 astro build
Coder Agent → 创建 GitHub PR

# 4. 自动部署
GitHub PR merge → Cloudflare Pages 自动部署
Cloudflare → 全球 CDN 生效 (~30s)
```

### 文档维护 Skill

| Skill | 用途 |
|-------|------|
| **summarize** | 自动生成文档摘要 |
| **content-ops-toolkit** | 内容批量处理 |
| **coding-agent** | 代码示例验证 |
| **github** | 版本控制与 PR 管理 |

### 多平台发布

```
案例文档创建后 → 自动适配多平台格式:
│
├── 小红书 (xhs-smart-publisher)
│   └── 长图文格式，配封面图
│
├── 公众号 (wechat-mp-publisher)
│   └── 富文本格式，嵌入代码块
│
├── 掘金 (juejin-smart-publish)
│   └── 技术文章格式，SEO 优化
│
└── 知识星球 (zsxq-publisher)
    └── 精华帖格式，附件支持
```

## 部署流程

### Cloudflare Pages 配置

```yaml
# cloudflare-pages.config.js
export default {
  buildCommand: 'npm run build',
  outputDirectory: 'dist',
  environmentVariables: {
    NODE_VERSION: '18'
  }
}
```

### GitHub Actions CI/CD

```yaml
# .github/workflows/deploy.yml
name: Deploy to Cloudflare Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: superclaw101
          directory: dist
```

## 成果数据

| 指标 | 数值 |
|------|------|
| **文档数量** | 30+ 篇 |
| **案例数量** | 7 个 |
| **构建时间** | ~15s |
| **部署时间** | ~30s (Cloudflare) |
| **全球加载** | < 100ms (CDN) |
| ** Lighthouse 评分** | 95+ (性能) |
| **搜索响应** | < 50ms (Pagefind) |
| **内容更新频率** | 每周 3-5 篇 |

## 核心价值

1. **高效维护**: OpenClaw 驱动内容创作，人力投入最小化
2. **极速体验**: 静态生成 + 全球 CDN，首屏加载 < 1s
3. **多平台分发**: 一份内容，多平台适配发布
4. **版本可控**: Git 管理所有变更，支持回滚

SuperClaw101 展示了如何用现代化的静态网站技术 + AI Agent 生态，构建一个可持续运营的知识中心。从内容创作到多平台发布，全流程 AI 驱动。

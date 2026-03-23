# SuperClaw101 🌟

> OpenClaw 正式静态文档站 / 知识站

[OpenClaw](https://github.com/openclaw/openclaw) 的文档与知识内容站点，基于 Astro + Starlight 构建。
当前阶段重点是沉淀结构化文档内容、建立统一的信息架构，并提供稳定的静态站点阅读体验。
项目当前产品定位明确为正式静态文档站 / 知识站，而非交互型 Agent 产品或在线聊天应用。

## 🎯 当前阶段范围

当前阶段聚焦于把项目建设为一个正式、可维护的静态文档站 / 知识站，主要包含：

- 📚 基于 Starlight 的文档内容组织与展示
- 🌐 中英双语内容承载能力
- 🔍 静态站内搜索能力（如 Pagefind）
- 📱 响应式阅读体验
- 🧱 面向文档生产与发布的基础构建流程

## 🚫 非本阶段范围

以下方向属于 future plan / 后续规划，不作为当前阶段的已交付能力，也不应被理解为当前站点定位：

- Agent Demo 的交互体验打磨与产品化
- Chat Widget 集成与在线对话能力
- Demo 产品化、业务闭环与对外展示页面扩展
- 将部署链路、证书、域名访问包装为“默认已就绪”的线上服务承诺

## 🛠️ 技术栈

> 当前仓库以静态内容承载、文档编排与站点发布为主；涉及 Agent Demo、Chat Widget、在线交互能力的内容，仅作为后续演进方向，不构成当前版本定位。

- **框架**: [Astro](https://astro.build) + [Starlight](https://starlight.astro.build)
- **样式**: Tailwind CSS
- **站点形态**: 静态文档站 / 知识站
- **部署形态**: 可对接 CI/CD、静态文件托管与反向代理方案（按环境配置）

## 🚀 快速开始

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

## 📦 部署

部署部分仅描述推荐方向与前提条件，不代表当前仓库已经默认完成服务器、证书、域名或自动化发布配置。
如需落地线上部署，需要先补齐目标环境、访问域名、CI/CD 凭据、反向代理与证书策略等条件。

### 前提条件

在准备部署前，通常需要具备以下条件：

| 项目 | 说明 |
|------|------|
| 目标环境 | 可用的静态文件托管环境、服务器或对象存储/CDN |
| 域名与 DNS | 已规划访问域名，并完成 DNS 指向 |
| CI/CD 凭据 | 如需自动化发布，需配置对应平台所需的密钥或访问凭据 |
| 反向代理 / HTTPS | 如需自建服务器访问，需要自行完成 Nginx、HTTPS 证书或等效方案配置 |

### 可选部署方式

- **CI/CD 发布**：可结合 GitHub Actions 等流程，在满足凭据与目标环境条件后执行自动化构建与发布
- **手动部署**：本地构建后，将静态产物上传到目标环境
- **托管平台 / 自建环境**：可根据实际运维条件选择静态托管、对象存储 + CDN 或 Nginx 等方案

### 手动部署示例

```bash
# 构建
npm run build

# 将 dist/ 目录中的静态产物上传到目标环境
# 具体命令请按实际部署环境调整，例如 rsync、scp、对象存储 CLI 或平台发布命令
```

## 🌐 访问

线上访问地址取决于实际部署环境、域名解析与 HTTPS 配置结果。
只有在相关前提条件完成后，站点才会以正式域名对外提供访问。

可在后续具备部署前提时，为站点配置正式访问域名与 HTTPS 地址。

## 📁 项目结构

```
.
├── docs/                    # 文档源文件
├── src/
│   ├── content/docs/         # Starlight 文档内容
│   │   ├── cases/            # 案例
│   │   ├── guides/           # 指南
│   │   ├── skillshub/       # Skill 库
│   │   └── tutorial/         # 教程
│   ├── components/           # Astro 组件
│   └── styles/               # 自定义样式
├── public/                   # 静态资源
├── astro.config.mjs          # Astro 配置
├── tailwind.config.mjs       # Tailwind 配置
└── .github/workflows/        # CI/CD 配置
```

## 📝 内容指南

### 添加新文档

在 `src/content/docs/` 下创建 Markdown 文件:

```markdown
---
title: 我的新页面
description: 页面描述
---

# 内容标题

这里是正文内容...
```

### 支持的功能

- ✅ Markdown / MDX
- ✅ 代码高亮
- ✅ 搜索
- ✅ 侧边栏导航
- ✅ 目录自动生成
- ✅ 中英双语

## 🔧 CI/CD 说明

仓库中可以维护用于构建与发布的工作流配置，但其是否可用取决于实际部署目标、访问凭据与环境准备情况。
当前应将其理解为可演进的发布基础设施，而不是默认已经打通的线上交付链路。

如需启用自动化发布，请结合实际目标环境补齐对应流程与密钥配置。

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

Built with [Astro](https://astro.build) + [Starlight](https://starlight.astro.build)

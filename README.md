# SuperClaw101 🌟

> OpenClaw Knowledge Hub - AI Agent 知识库静态站点

[OpenClaw](https://github.com/openclaw/openclaw) 的官方文档与知识库，基于 Astro + Starlight 构建。

## ✨ 特性

- 📚 基于 Starlight 的现代化文档站点
- 🌐 中英双语支持
- 🔍 内置全文搜索 (Pagefind)
- 📱 响应式设计
- 🚀 自动 CI/CD 部署

## 🛠️ 技术栈

- **框架**: [Astro](https://astro.build) + [Starlight](https://starlight.astro.build)
- **样式**: Tailwind CSS
- **部署**: GitHub Actions → Nginx
- **SSL**: Let's Encrypt / Cloudflare Origin Certificate

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

### GitHub Secrets

在 GitHub 仓库设置中添加以下 Secrets:

| Secret | 值 | 说明 |
|--------|-----|------|
| SSH_HOST | 8.138.59.152 | 服务器 IP |
| SSH_USER | root | SSH 用户名 |
| SSH_PORT | 22 | SSH 端口 |
| SSH_PRIVATE_KEY | - | SSH 私钥 |
| DEPLOY_PATH | /var/www/superclaw101 | 部署路径 |
| DOMAIN | superclaw.opencaio.cn | 域名 |
| EMAIL | - | SSL 证书邮箱 |

### 部署流程

1. **Push** 到 `main` 分支触发自动部署
2. **构建** Astro 静态站点
3. **SCP** 部署到服务器
4. **SSL** 自动配置 Let's Encrypt 证书
5. **Nginx** 配置 HTTPS 反向代理

### 手动部署

```bash
# 构建
npm run build

# 打包
zip -r dist.zip dist/*

# 上传服务器
scp dist.zip root@8.138.59.152:/tmp/

# 服务器端解压
ssh root@8.138.59.152 "mkdir -p /var/www/superclaw101 && unzip -o /tmp/dist.zip -d /var/www/superclaw101"
```

## 🌐 访问

| 协议 | 地址 |
|------|------|
| HTTP | http://superclaw.opencaio.cn |
| HTTPS | https://superclaw.opencaio.cn |

> ⚠️ 需要正确配置 DNS 解析到服务器 IP

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

## 🔧 CI/CD 配置

部署工作流见 [.github/workflows/deploy.yml](./.github/workflows/deploy.yml)

### 主要步骤

1. **Checkout** - 检出代码
2. **Setup Node.js** - 配置 Node 环境
3. **Install** - 安装依赖
4. **Build** - 构建静态站点
5. **SCP Deploy** - 部署到服务器
6. **SSL Config** - 配置 SSL 证书
7. **Nginx Config** - 配置反向代理

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

Built with [Astro](https://astro.build) + [Starlight](https://starlight.astro.build)

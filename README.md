# SuperClaw101

OpenClaw Knowledge Hub - AI Agent 知识库静态站点

## 技术栈

- **框架**: Astro + Starlight
- **部署**: GitHub Actions → 服务器 (Nginx + Let's Encrypt SSL)

## 快速开始

### 本地开发

```bash
npm install
npm run dev
```

### 构建静态站点

```bash
npm run build
npm run preview
```

## 部署配置

### GitHub Secrets

在 GitHub 仓库设置中添加以下 Secrets:

| Secret | 值 | 说明 |
|--------|-----|------|
| SSH_HOST | 8.138.59.152 | 服务器 IP |
| SSH_USER | root | SSH 用户名 |
| SSH_PORT | 22 | SSH 端口 |
| SSH_PRIVATE_KEY | ${{ secrets.SSH_PRIVATE_KEY }} | SSH 私钥 |
| DEPLOY_PATH | /var/www/superclaw101 | 部署路径 |
| DOMAIN | superclaw.opencaio.cn | 域名 |
| EMAIL | your@email.com | SSL 证书邮箱 |

### 部署流程

1. Push 到 `main` 分支触发自动部署
2. GitHub Actions 构建 Astro 静态站点
3. SCP 部署到服务器 `/var/www/superclaw101`
4. 自动配置 Let's Encrypt SSL 证书
5. Nginx 配置 HTTPS 反向代理

## 访问

- **HTTP**: http://superclaw.opencaio.cn
- **HTTPS**: https://superclaw.opencaio.cn (自动跳转)

## 项目结构

```
.
├── docs/                 # 文档源文件 (Markdown/MDX)
├── src/
│   ├── content/docs/     # Starlight 文档内容
│   ├── components/       # Astro 组件
│   └── styles/           # 自定义样式
├── public/               # 静态资源
├── astro.config.mjs      # Astro 配置
└── .github/workflows/    # CI/CD 配置
```

## License

MIT

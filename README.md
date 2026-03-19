# SuperClaw101 Deploy

GitHub Actions 自动部署配置

## 使用方法

### 1. 在 GitHub 仓库添加 Secrets

| Secret | 值 |
|--------|-----|
| SSH_HOST | 8.138.59.152 |
| SSH_USER | root |
| SSH_PORT | 22 |
| SSH_PRIVATE_KEY | 你的 SSH 私钥内容 |
| DEPLOY_PATH | /var/www/superclaw101 |

### 2. 获取 SSH 私钥

```bash
cat ~/.ssh/id_ed25519
```

### 3. 部署触发

每次 push 到 main 分支自动部署。

## 部署流程

1. GitHub Actions 自动构建 (`npm run build`)
2. SCP 部署到服务器 `/var/www/superclaw101`
3. 验证部署结果

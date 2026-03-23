# SuperClaw101 部署方案（预上线版）

## 1. 目标

将 `superclaw101` 作为**静态知识站**部署到广州 8核16G 服务器，并通过：

- `https://superclaw.opencaio.cn`

对外提供访问。

本方案覆盖：

- 构建与发布边界
- 服务器目录约定
- Nginx / HTTPS 建议
- 安全与缓存策略
- 回滚与验收清单
- 当前 blocker

---

## 2. 当前定位

当前仓库定位是：

- **静态文档站 / 知识站**
- 基于 Astro + Starlight 构建
- 产物为 `dist/` 静态文件

当前**不是**：

- 在线聊天应用
- Agent demo 产品站
- 默认已完成服务器配置的 SaaS 服务

所以部署目标也应保持克制：

> 先把静态站稳定上线，再考虑后续的 agent 体验或交互能力。

---

## 3. 推荐部署拓扑

推荐最小可维护方案：

1. GitHub Actions 负责构建静态产物
2. 通过 SSH/SCP/rsync 发布到广州服务器
3. Nginx 托管静态目录
4. Certbot 或现有证书体系提供 HTTPS
5. 通过 system-level 备份/回滚保留最近几个发布版本

### 3.1 服务器目录建议

```bash
/var/www/superclaw101/releases/<timestamp>
/var/www/superclaw101/current
/var/www/superclaw101/shared
```

推荐发布方式：

- 每次发布上传到新的 `releases/<timestamp>`
- 校验通过后，将 `current` 软链切换到新版本
- Nginx 始终指向 `current`

优点：

- 回滚快
- 发布过程更可审计
- 避免直接覆盖导致半发布状态

---

## 4. 构建与发布边界

### 4.1 仓库内应负责的内容

仓库内当前应该负责：

- 文档内容
- Astro/Starlight 构建配置
- 基础 CI 构建流程
- 部署说明文档
- 可复用的 Nginx 样例配置
- 验收清单

### 4.2 仓库外仍需准备的内容

仍需要外部环境配合：

- 广州服务器可 SSH 登录
- 域名 `superclaw.opencaio.cn` 已正确解析到目标服务器
- 防火墙 / 安全组已开放 80/443
- GitHub Actions 所需 secrets 已配置
- HTTPS 证书申请条件已满足

---

## 5. GitHub Actions 建议

当前 workflow 已具备雏形，但存在一个明显问题：

> 把“日常静态文件部署”和“首次数机器初始化/证书申请/Nginx 写配置”耦合在同一条流水线里。

这会带来几个问题：

- 权限过大
- 每次发布都携带高风险变更能力
- 失败定位困难
- 首次部署逻辑和日常发布逻辑耦合

### 5.1 建议拆成两类流程

#### A. 服务器初始化（一次性 / 低频）

只在首发或机器重建时执行，内容包括：

- 安装 Nginx
- 建站目录初始化
- 写入站点配置
- 申请 HTTPS 证书
- systemd / logrotate / 备份策略（如果需要）

#### B. 日常发布（高频）

每次 push main 时执行，内容仅包括：

- `npm ci`
- `npm run build`
- 上传 `dist/` 到新 release 目录
- 切换 `current` 软链
- `nginx -t && systemctl reload nginx`
- 基础健康检查

---

## 6. Nginx 建议

对于静态站，Nginx 规则应尽量简单。

### 6.1 核心原则

- 优先按静态文件命中
- 404 应返回真实 404 页面，而不是一律回退首页
- 静态资源加长期缓存
- HTML 不做激进缓存
- 添加基础安全头

### 6.2 推荐配置要点

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name superclaw.opencaio.cn;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name superclaw.opencaio.cn;

    root /var/www/superclaw101/current;
    index index.html;

    # TLS 证书路径按实际环境替换
    ssl_certificate     /etc/letsencrypt/live/superclaw.opencaio.cn/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/superclaw.opencaio.cn/privkey.pem;

    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    location / {
        try_files $uri $uri/ =404;
    }

    location = /404.html {
        internal;
    }

    error_page 404 /404.html;

    location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico|webp|woff|woff2)$ {
        expires 30d;
        add_header Cache-Control "public, max-age=2592000, immutable";
        access_log off;
    }

    location ~* \.html$ {
        add_header Cache-Control "no-cache";
    }
}
```

### 6.3 不建议的做法

对于文档型静态站，不建议默认使用：

```nginx
try_files $uri $uri/ /index.html;
```

这是典型 SPA 回退策略，适合前端单页应用。
对于当前文档站，它会：

- 混淆真实 404
- 影响搜索引擎与错误定位
- 让坏链接看起来像“首页还能开”，但实际是错的

---

## 7. HTTPS 与证书

推荐使用：

- Let’s Encrypt + Certbot

前提：

- 域名已解析到服务器公网 IP
- 80/443 端口可达
- Nginx 配置与证书申请流程不要互相打架

建议顺序：

1. 先确认 DNS
2. 先让 80 端口站点可访问
3. 再申请证书
4. 验证自动续期
5. 最后开启严格 HSTS

注意：

- **不要在第一次试部署就把 HSTS 配太激进**
- 确认 HTTPS 稳定后再长期打开

---

## 8. 发布与回滚

### 8.1 推荐发布步骤

```bash
npm ci
npm run build

# 上传 dist 到服务器 release 目录
# 例如：/var/www/superclaw101/releases/20260323-201500

ln -sfn /var/www/superclaw101/releases/20260323-201500 /var/www/superclaw101/current
nginx -t
systemctl reload nginx
```

### 8.2 推荐回滚步骤

```bash
ln -sfn /var/www/superclaw101/releases/<previous-release> /var/www/superclaw101/current
nginx -t
systemctl reload nginx
```

### 8.3 回滚触发条件

出现以下情况可直接回滚：

- 首页 5xx / 白屏
- CSS/JS 资源大量 404
- 关键文档路由无法访问
- HTTPS 证书配置异常
- 搜索功能明显异常

---

## 9. 上线验收清单

上线前至少确认以下项目：

### 9.1 构建侧

- [ ] `npm run build` 稳定通过
- [ ] 无阻断型内容错误
- [ ] `site` 已配置，sitemap 可生成
- [ ] 404 页面存在且行为正确

### 9.2 服务器侧

- [ ] 域名已解析到广州服务器
- [ ] 80/443 放通
- [ ] Nginx 配置通过 `nginx -t`
- [ ] HTTPS 证书有效
- [ ] 站点根目录指向 `current`

### 9.3 访问侧

- [ ] `https://superclaw.opencaio.cn` 可访问
- [ ] 中英文首页可打开
- [ ] 关键路径（getting-started / guides / skillshub）可访问
- [ ] 任意不存在路径返回自定义 404
- [ ] 搜索可正常工作

### 9.4 运维侧

- [ ] 保留最近 3-5 个 releases
- [ ] 有明确回滚命令
- [ ] GitHub Actions secrets 已最小化授权
- [ ] 发布失败时不会覆盖当前线上版本

---

## 10. 当前 blocker

截至当前，仍然存在以下 blocker：

1. 服务器实操尚未完成
   - 未在当前会话中实际 SSH 到广州服务器执行初始化

2. 域名/DNS/证书状态未实测
   - 当前无法把 `https://superclaw.opencaio.cn` 当作已上线事实来承诺

3. workflow 仍待拆分
   - 当前仓库内的 `deploy.yml` 仍是“初始化 + 日常部署”耦合版

4. 需要补 server-side deploy artifacts
   - 例如独立 nginx 配置样例、发布脚本、verify checklist

---

## 11. 当前建议的下一轮任务

建议下一轮继续做这三件事中的一个最小闭环：

1. **拆 workflow**
   - `server-bootstrap.yml`（低频）
   - `deploy-static-site.yml`（高频）

2. **补部署产物**
   - `ops/nginx/superclaw.conf`
   - `scripts/deploy-release.sh`
   - `scripts/verify-deploy.sh`

3. **做上线前验证文档**
   - 把人工验证步骤写成 checklist，方便上线时逐项勾选

---

## 12. 一句话结论

`superclaw101` 当前已经具备“作为静态知识站继续完善并准备上线”的仓库基础，但距离正式上线到 `https://superclaw.opencaio.cn`` 还差外部环境落地与部署流程拆分这两步。
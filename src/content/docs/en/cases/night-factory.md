---
title: "案例 #10：夜间工厂模式"
description: "Cron 驱动的通宵开发 —— 睡一觉醒来收到 15+ 新提交"
---

## 工作原理
```
22:00 - Daniel 准备任务队列 → tasks.json
22:30 - 睡觉 💤
23:00 - [Cron] CEO 检查队列，分派任务 #1
23:15 - [Code] 任务 #1 完成，git commit
23:30 - [Cron] CEO 分派任务 #2
...
07:00 - Daniel 醒来，15 个新提交 🎉
07:30 - Review + 反馈 → 进入白天协作模式
```

## 安全护栏
- **任务白名单** —— 只执行预定义类型
- **分支隔离** —— 每个任务在独立 feature 分支
- **自动测试** —— 提交前必须通过
- **无合并权限** —— Agent 只能提 PR，不能合并到 main
- **成本上限** —— 每个任务最多 ¥15

## 成果
- **一晚 15-20 个任务**（22:00-07:00）
- **每天 30-60 分钟** Review 时间
- 开发周期：**2 周 → 3 天**（如 KGKB 项目）
- 自动测试通过率：**95%+**

## 使用 Skill
`coding-agent` · `github` · `code-review-quality` · `verification-before-completion`

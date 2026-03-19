---
title: Skill 开发
description: 用 SKILL.md 创建自定义技能 —— 扩展 Agent 的能力边界
---

## 什么是 Skill？

Skill 是一个自包含的能力包，由 `SKILL.md` 文件定义。它告诉 Agent **如何**完成某个特定任务。

```
my-skill/
├── SKILL.md          ← Skill 定义（必需）
├── scripts/          ← 辅助脚本（可选）
│   └── run.sh
└── references/       ← 参考文档（可选）
    └── api-docs.md
```

## SKILL.md 格式

```markdown
---
name: weather-checker
description: 查询任意地点的天气预报
triggers:
  - weather
  - 天气
  - 温度
---

# Weather Checker

## 何时使用
当用户询问天气、温度或天气预报时使用此 Skill。

## 工作流程
1. 从用户消息中解析地点
2. 调用 wttr.in API: `curl -s "wttr.in/{location}?format=3"`
3. 格式化输出结果

## 示例
- "北京天气怎么样？" → curl wttr.in/Beijing
- "明天会下雨吗？" → curl wttr.in/{location}?format=v2
```

## 安装 Skill

```bash
# 从 AGI-Super-Team（447+ Skills）
npx skills add aAAaqwq/AGI-Super-Team@weather-checker -g -y

# 从任意 GitHub 仓库
npx skills add owner/repo@skill-name -g -y

# 从本地目录
openclaw plugins install ./my-skill
```

## 发布 Skill

1. Fork [AGI-Super-Team](https://github.com/aAAaqwq/AGI-Super-Team)
2. 创建 `skills/your-skill/SKILL.md`
3. 提交 PR

也可以发布到 [ClawdHub](https://clawhub.com) 获得更广泛的分发。

## 最佳实践

| 实践 | 原因 |
|-----|------|
| 清晰的触发词 | Agent 知道何时激活 |
| 分步骤指令 | Agent 可靠执行 |
| 错误处理 | 优雅的失败信息 |
| 提供示例 | Agent 从模式中学习 |
| 保持聚焦 | 一个 Skill 只做一件事 |

→ [浏览 447+ Skills →](/skillshub/)

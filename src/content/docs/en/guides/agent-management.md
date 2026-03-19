---
title: Agent Management
description: Configure models, install skills, manage workspaces, and customize agent behavior
---

## Agent Workspace

```
~/agents/my-agent/
├── AGENTS.md     ← Role definition & rules
├── SOUL.md       ← Personality & communication style
├── MEMORY.md     ← Long-term curated memory
├── TOOLS.md      ← Environment-specific notes
└── memory/       ← Daily logs (YYYY-MM-DD.md)
```

## Installing Skills

```bash
npx skills find "content creator"
npx skills add aAAaqwq/AGI-Super-Team@content-creator -g -y
```

→ [Build a full AI army →](/en/tutorial/ai-army/)

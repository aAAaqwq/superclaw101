---
title: Quick Start — 5 Minutes to Your First AI Agent
description: Install OpenClaw, configure a channel, and talk to your AI agent in under 5 minutes
---

## Prerequisites

- **Node.js 18+** (`node -v`)
- A messaging account (Telegram, Discord, Feishu, etc.)
- An LLM API key (OpenAI, Anthropic, or any compatible provider)

## Install & Run

```bash
npm install -g openclaw
openclaw init
openclaw channels add
openclaw gateway
```

Send a message to your bot → approve the pairing code:

```bash
openclaw pairing approve <channel> <CODE>
```

**That's it!** Your AI agent is live. 🎉

## What's Next?

- [Agent Management](/en/guides/agent-management/) — Switch models, install skills
- [Skill Development](/en/guides/skill-development/) — Create custom capabilities
- [Build Your AI Army](/en/tutorial/ai-army/) — Scale to 13+ agents
- [SkillsHub](/en/skillshub/) — Browse 447+ ready-to-use skills

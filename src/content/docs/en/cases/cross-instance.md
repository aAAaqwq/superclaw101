---
title: "案例 #7：跨实例 Agent 协作"
description: "3 台设备通过 Tailscale 组网 —— Agent 无缝跨机通信"
---

## 拓扑
```
🏠 家庭 NAS          ☁️ 云服务器          💻 工作站
├── Code Agent       ├── Ops Agent        ├── CEO Agent
├── Research Agent   ├── Quant Agent      ├── Content Agent
└── Gateway          └── Gateway          └── Gateway
        └──────── Tailscale Mesh VPN ──────────┘
```

## 成果
- **< 50ms** 跨机延迟
- NAS 利用率：10% → **70%**
- Quant Agent 跑在云服务器上，交易所延迟最低

## 使用 Skill
`team-orchestration` · `sysadmin-toolbox` · `docker-deployment`

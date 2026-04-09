// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
	site: 'https://superclaw.opencaio.cn',
	integrations: [
		starlight({
			disable404Route: true,
			title: 'SuperClaw101',
			defaultLocale: 'root',
			locales: {
				root: { label: '简体中文', lang: 'zh-CN' },
				en: { label: 'English', lang: 'en' },
			},
			social: [
				{ icon: 'github', label: 'AGI-Super-Team', href: 'https://github.com/aAAaqwq/AGI-Super-Team' },
				{ icon: 'discord', label: 'Discord', href: 'https://discord.com/invite/clawd' },
			],
			components: {
				Footer: './src/components/Footer.astro',
			},
			sidebar: [
				{
					label: '🚀 快速开始',
					items: [
						{ label: '5 分钟上手', slug: 'getting-started' },
					],
				},
				{
					label: '📖 使用指南',
					items: [
						{ label: 'Agent 管理', slug: 'guides/agent-management' },
						{ label: 'Skill 开发', slug: 'guides/skill-development' },
						{ label: '多 Agent 协作', slug: 'guides/multi-agent' },
					],
				},
				{
					label: '🎖️ 实战教程',
					items: [
						{ label: '打造你的 AI 军团', slug: 'tutorial/ai-army' },
					],
				},
				{
					label: '💡 实战经验',
					items: [
						{ label: 'OpenClaw 实战经验', slug: 'experience' },
						{ label: '模型配置完全指南', slug: 'experience/model-guide' },
						{ label: '📖 架构学习手册', slug: 'experience/openclaw-architecture' },
						{ label: '🚀 基座进化手册', slug: 'experience/openclaw-evolution' },
						{ label: '📝 自媒体运营手册', slug: 'experience/self-media-operations' },
					],
				},
				{
					label: '🔌 消息渠道',
					items: [
						{ label: '渠道架构总览', slug: 'guides/channels' },
						{ label: '🥇 飞书 / Lark', slug: 'guides/channels/feishu' },
						{ label: 'Telegram', slug: 'guides/channels/telegram' },
						{ label: 'Discord', slug: 'guides/channels/discord' },
						{ label: '微信 / 企业微信', slug: 'guides/channels/wechat' },
						{ label: 'WhatsApp', slug: 'guides/channels/whatsapp' },
						{ label: 'Slack', slug: 'guides/channels/slack' },
						{ label: '自定义渠道', slug: 'guides/channels/custom' },
					],
				},
				{
					label: '🧩 SkillsHub 技能库',
					items: [
						{ label: '总览（447+ Skills）', slug: 'skillshub' },
						{ label: '🤖 Agent 编排', slug: 'skillshub/agent-orchestration' },
						{ label: '💻 开发工具', slug: 'skillshub/development' },
						{ label: '📊 数据分析', slug: 'skillshub/data-analytics' },
						{ label: '📝 内容创作', slug: 'skillshub/content-creation' },
						{ label: '📈 营销 & SEO', slug: 'skillshub/marketing-seo' },
						{ label: '💰 金融交易', slug: 'skillshub/finance-trading' },
						{ label: '🔧 DevOps', slug: 'skillshub/devops' },
						{ label: '🔒 安全审计', slug: 'skillshub/security' },
						{ label: '📱 平台集成', slug: 'skillshub/platform-integration' },
						{ label: '🧠 AI & ML', slug: 'skillshub/ai-ml' },
						{ label: '📋 项目管理', slug: 'skillshub/project-management' },
						{ label: '⚖️ 法务合规', slug: 'skillshub/legal-compliance' },
					],
				},
				{
					label: '🏆 案例展示',
					items: [
						{ label: '案例#1: AGI-Super-Team 生态', slug: 'cases/agi-super-team' },
						{ label: '案例#2: 13 Agent AI 军团', slug: 'cases/ai-army' },
						{ label: '案例#3: 多平台内容工厂', slug: 'cases/content-factory' },
						{ label: '案例#4: OpenClaw 审计系统', slug: 'cases/openclaw-audit' },
						{ label: '案例#5: SuperClaw101 网站', slug: 'cases/superclaw101' },
						{ label: '案例#6: Polymarket 量化交易', slug: 'cases/quant-trading' },
						{ label: '案例#7: BTC 5min 网格策略', slug: 'cases/btc-scalper' },
						{ label: '案例#8: 合成市场研究', slug: 'cases/synthetic-market-research' },
						{ label: '案例#9: AI 视频生成工厂', slug: 'cases/video-factory' },
						{ label: '案例#10: KGKB 知识图谱', slug: 'cases/kgkb' },
						{ label: '案例#11: 企微智能客服', slug: 'cases/wecom-bot' },
						{ label: '案例#12: 跨实例协作', slug: 'cases/cross-instance' },
						{ label: '案例#13: 内容流水线 SOP', slug: 'cases/media-sop' },
						{ label: '案例#14: QMD 统一知识库', slug: 'cases/qmd-kb' },
						{ label: '案例#15: 夜间工厂模式', slug: 'cases/night-factory' },
						{ label: '案例#16: Skill 编写与发布', slug: 'cases/skill-authoring' },
					],
				},
				{
					label: '💡 技巧页面',
					items: [
						{ label: '去除 AI 写作痕迹', slug: 'tips/ai-writing-quality' },
						{ label: '浏览器自动化', slug: 'tips/browser-automation' },
						{ label: 'OpenClaw 高级配置', slug: 'tips/openclaw-advanced-config' },
					],
				},
				{
					label: '❓ 常见问题',
					autogenerate: { directory: 'faq' },
				},
			],
			head: [
				{
					tag: 'meta',
					attrs: {
						name: 'description',
						content: 'SuperClaw101 — 打造你的 AI 军团。447+ Skills、13 个 Agent、10+ 消息渠道，100% 开源。',
					},
				},
			],
			customCss: ['./src/styles/custom.css'],
			editLink: {
				baseUrl: 'https://github.com/aAAaqwq/openclaw-knowledge-hub/edit/main/',
			},
		}),
	],
});

// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
	integrations: [
		starlight({
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
					autogenerate: { directory: 'cases' },
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

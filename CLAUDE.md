# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

个人博客站点 (nasbuild.dev)，基于 Next.js 16 App Router，部署在 Vercel。内容来源：Supabase 数据库（笔记/产品）+ 本地 MDX 文件（产品/资源/指南/案例）。支持中文（zh）和日文（ja）双语。

## 常用命令

```bash
cd personal-site          # 所有命令在此目录下执行
npm install               # 安装依赖
npm run dev               # 启动开发服务器 (Turbopack)
npm run build             # 生产构建（自动执行 prebuild.mjs）
npm run start             # 启动生产服务器
npm run lint              # ESLint 检查
```

## 架构要点

### 双内容源策略
- **笔记 (Notes)**：存储在 Supabase `posts` 表，通过 Admin Dashboard 管理，Markdown 格式
- **产品 (Products)**：Supabase 优先，本地 MDX 兜底（`src/lib/products.ts` 中实现优先级逻辑）
- **资源/指南/案例 (Library/Playbooks/Cases)**：纯本地 MDX 文件

### i18n 国际化
- 使用 `next-intl`，路由前缀策略：`/zh/...`、`/ja/...`
- 默认语言：中文 (zh)
- 翻译文件：`messages/zh.json`、`messages/ja.json`
- 中间件配置：`src/i18n/request.ts`、`src/i18n/routing.ts`
- Admin 和 API 路由不经过 i18n 中间件

### Admin 认证
- 自定义 HMAC 会话令牌系统（非 Supabase Auth）
- 实现：`src/lib/admin-auth.ts`
- 基于密码登录，签名 Cookie，1 小时过期

### Supabase 客户端
- `src/lib/supabase.ts` 导出两个客户端：
  - `supabasePublic` — 使用 anon key（前端公开查询）
  - `supabaseAdmin` — 使用 service role key（服务端管理操作）
  - `supabase` — `supabaseAdmin` 的别名（向后兼容）

## 内容结构

### 本地 MDX 文件
路径：`content/{type}/{slug}.{locale}.mdx`

示例：`content/products/prompt-pack.zh.mdx`

类型目录：`products/`、`library/`、`playbooks/`、`cases/`

### Frontmatter 字段

**Products**：title, summary, tags, updatedAt, language, price, purchaseUrl, coverImage, seoTitle, seoDescription, paymentMethods, fulfillmentUrl, featured, published

**Library**：title, summary, tags, updatedAt, language, type (template/checklist/sop/prompt), downloadUrl, copyText

**Playbooks/Cases**：title, summary, tags, updatedAt, language

### Supabase 数据库
- Schema：`supabase/schema.sql`
- 迁移文件：`supabase/migrations/`
- 核心表：posts, post_history, analytics_events, products, product_orders
- Storage 桶：`blog-assets`

## 关键配置文件

| 文件 | 作用 |
|---|---|
| `next.config.ts` | Next.js 配置，集成 next-intl 插件，Supabase 图片域名，MDX 页面扩展名 |
| `tailwind.config.ts` | Tailwind v4 自定义色彩体系（Google 风格）、阴影、圆角、字体、最大宽度 |
| `src/app/globals.css` | 全局样式：组件类（.page-shell, .card, .btn, .chip 等）、MDX prose 样式 |
| `src/app/about.css` | About 页面专属样式（bento grid、技能栏、时间线、人格卡片） |
| `tsconfig.json` | TypeScript 配置，`@/*` 路径别名指向 `./src/*` |
| `eslint.config.mjs` | ESLint flat config (next/core-web-vitals + next/typescript) |
| `vercel.json` | Vercel 部署配置 |

## 环境变量

**必需**：
- `NEXT_PUBLIC_SITE_URL` — 站点 URL (https://nasbuild.dev)
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase 项目 URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase 匿名密钥
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase 服务端密钥
- `ADMIN_PASSWORD` — 管理后台密码
- `ADMIN_SESSION_SECRET` — 会话签名密钥

**可选**：`NEXT_PUBLIC_GA_ID`、`NEXT_PUBLIC_FORM_ENDPOINT`、`NEXT_PUBLIC_ADSENSE_CLIENT`、`NEXT_PUBLIC_ENABLE_ADSENSE`

## 设计系统

Google Material 风格调色板：
- 主色：`primary-500` (#4285f4)
- 表面色：`surface-50` ~ `surface-900`
- 强调色：`accent-green` (#34a853)、`accent-yellow` (#fbbc04)、`accent-red` (#ea4335)
- 阴影层级：`elevated-1` ~ `elevated-4`、`card`、`card-hover`
- 圆角：`google` (12px)、`google-lg` (16px)、`google-xl` (20px)、`pill` (999px)
- 内容宽度：`max-page` (1200px)、`max-content` (880px)、`max-reading` (740px)
- 字体：Noto Sans SC（中文）、Noto Sans JP（日文）

About 页面使用独立暖色调（背景 `#faf7f1`，文字 `#23344a`）。

## 页面路由

公开页面在 `src/app/[locale]/` 下：home、notes、products、library、playbooks、cases、about、contact、saas、privacy、terms、work-with-me、topics

Admin 页面在 `src/app/admin/` 下：login、notes（列表/编辑）、products（列表/编辑）、analytics

API 路由在 `src/app/api/` 下：admin auth、notes CRUD、products CRUD、payments、analytics、upload、health、RUM

## 数据库迁移

迁移文件在 `supabase/migrations/`，需手动在 Supabase SQL Editor 中执行（`scripts/apply-migration.ts` 仅提供指引，不能直接执行 SQL）。

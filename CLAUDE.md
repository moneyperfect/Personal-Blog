# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

个人品牌站 (nasbuild.dev)，基于 Next.js 16 App Router + React 19，部署在 Vercel。定位：高端个人品牌 + 数字产品展示站，暖色有机设计风格。

内容来源：Supabase 数据库（博客/产品）+ 本地 MDX 文件（产品/资源/指南/案例）。支持中文（zh）和日文（ja）双语。

**核心工作流**：AI Agent 自动创建和维护博客内容，人工仅做小部分微调（状态切换、内容修正）。Admin 后台针对此场景优化。

## 常用命令

```bash
cd personal-site          # 所有命令在此目录下执行
npm install               # 安装依赖
npm run dev               # 启动开发服务器 (Turbopack)
npm run build             # 生产构建（自动执行 prebuild.mjs）
npm run start             # 启动生产服务器
npm run lint              # ESLint 检查
```

## 技术栈

| 层 | 技术 |
|---|---|
| 框架 | Next.js 16.1.6 (App Router, Turbopack) |
| UI | React 19, Tailwind CSS v4, Framer Motion |
| 图标 | Lucide React（禁止使用 emoji） |
| CMS | Supabase (PostgreSQL + Storage) |
| 国际化 | next-intl (路由前缀: /zh/, /ja/) |
| MDX | next-mdx-remote + gray-matter |
| 认证 | 自定义 HMAC 会话令牌（非 Supabase Auth） |
| 部署 | Vercel (自动部署 main 分支) |

## 架构要点

### 双内容源策略
- **博客 (Blog)**：存储在 Supabase `posts` 表，通过 Admin Dashboard 管理，Markdown 格式。公开页面同时读取本地 MDX + Supabase，Supabase 优先覆盖同 slug 文章
- **产品 (Products)**：Supabase 优先，本地 MDX 兜底（`src/lib/products.ts`）
- **资源/指南/案例 (Library/Playbooks/Cases)**：纯本地 MDX 文件
- **项目 (Projects)**：`config/projects.json` 配置文件

### i18n 国际化
- 使用 `next-intl`，路由前缀：`/zh/...`、`/ja/...`
- 默认语言：中文 (zh)
- 翻译文件：`messages/zh.json`、`messages/ja.json`
- 中间件：`src/i18n/request.ts`、`src/i18n/routing.ts`
- Admin 和 API 路由不经过 i18n 中间件

### Admin 认证
- 自定义 HMAC 会话令牌系统
- 实现：`src/lib/admin-auth.ts`
- 基于密码登录，签名 Cookie，1 小时过期
- `verifyAdminAuth()` — 检查是否已登录
- `protectAdminRoute()` — 未登录则重定向到 /admin

### Supabase 客户端
- `src/lib/supabase.ts` 导出：
  - `supabasePublic` — anon key（前端公开查询）
  - `supabaseAdmin` — service role key（服务端管理操作，绕过 RLS）
  - `supabase` — `supabaseAdmin` 的别名

## 设计系统

暖色有机风格（非 Google Material）。详见 `tailwind.config.ts` 和 `globals.css`。

### 色彩
- 背景：`app: #FAF7F1`（温暖米色）
- 表面色阶：`surface-50` (#FFFFFF) ~ `surface-900` (#1D1D1F)
- 强调色：`accent: #C46849`（赤陶色）
- **禁用纯白 (#ffffff) 和纯黑 (#000000)**

### 字体
- 标题：Playfair Display（衬线），`font-display`
- 正文：Noto Sans SC/JP（无衬线），`font-sans`

### 圆角
- `google`: 12px, `google-lg`: 16px, `google-xl`: 20px, `pill`: 999px

### 组件类（globals.css）
- `.page-shell` — 页面容器
- `.card` / `.list-card` — 卡片
- `.btn` / `.btn-primary` / `.btn-tonal` / `.btn-text` — 按钮
- `.chip` / `.chip-active` / `.chip-muted` — 标签
- `.link` — 链接（accent 色）
- `.hero-gradient` — 首页 hero 渐变背景
- `.bento-glow` — 项目卡片 hover 光晕

### 动画
- `Reveal` / `StaggerGroup` / `StaggerItem` — 滚动渐入动画（Framer Motion）
- `.float-slow/medium/fast` — 浮动动画
- `.bounce-subtle` — 弹跳动画

## 页面路由

### 公开页面 (`src/app/[locale]/`)
| 路由 | 文件 | 说明 |
|---|---|---|
| `/` | `page.tsx` | 首页：hero + 数据条 + 项目 bento grid + 博客列表 |
| `/blog` | `blog/page.tsx` | 博客列表（支持 tag/category 筛选） |
| `/blog/[slug]` | `blog/[slug]/page.tsx` | 博客详情（JSON-LD, 相关文章） |
| `/projects` | `projects/page.tsx` | 项目列表 |
| `/projects/[slug]` | `projects/[slug]/page.tsx` | 项目详情 |
| `/topics` | `topics/page.tsx` | 话题标签云 |
| `/topics/[topic]` | `topics/[topic]/page.tsx` | 话题下文章列表 |
| `/about` | `about/page.tsx` | 关于页（bento 布局） |
| `/privacy` | `privacy/page.tsx` | 隐私政策 |
| `/terms` | `terms/page.tsx` | 服务条款 |

### Admin 页面 (`src/app/admin/`)
| 路由 | 文件 | 说明 |
|---|---|---|
| `/admin` | `page.tsx` | 登录页（已登录自动跳转 dashboard） |
| `/admin/dashboard` | `dashboard/page.tsx` | 概览：健康检查 + 数据统计 + 最近内容快速操作 |
| `/admin/blog` | `blog/page.tsx` | 博客列表：搜索 + 状态筛选 + 一键状态/分类切换 |
| `/admin/blog/[slug]` | `blog/[slug]/page.tsx` | 博客编辑器（复用 Editor 组件，apiMode="blog"） |
| `/admin/projects` | `projects/page.tsx` | 项目管理（卡片网格） |
| `/admin/projects/[slug]` | `projects/[slug]/page.tsx` | 项目编辑器 |
| `/admin/products` | `products/page.tsx` | 产品管理（表格 + 发布/推荐开关） |
| `/admin/products/editor/[slug]` | `products/editor/[slug]/page.tsx` | 产品编辑器 |
| `/admin/editor` | `editor/page.tsx` | 新建笔记（Supabase posts 表） |
| `/admin/editor/[slug]` | `editor/[slug]/page.tsx` | 编辑笔记（富编辑器：分栏预览、拖拽上传、快捷插入） |

### API 路由 (`src/app/api/`)
| 路由 | 方法 | 说明 |
|---|---|---|
| `/api/admin/login` | POST | 管理员登录 |
| `/api/admin/logout` | POST | 管理员登出 |
| `/api/admin/health` | GET | 系统健康检查（配置/数据库/存储/表结构） |
| `/api/admin/notes` | GET/POST | 笔记列表 + 状态/分类更新 + 删除 |
| `/api/admin/notes/save` | POST | 笔记保存（upsert + column fallback） |
| `/api/admin/blog/posts` | GET/POST | 博客列表 + 新建 |
| `/api/admin/blog/posts/[slug]` | GET/PUT/DELETE | 博客单篇 CRUD |
| `/api/admin/products` | GET/POST | 产品列表 + 标记更新 + 删除 |
| `/api/admin/products/save` | POST | 产品保存 |
| `/api/admin/projects` | GET/POST | 项目列表 + 新建 |
| `/api/admin/projects/[slug]` | GET/PUT/DELETE | 项目 CRUD |
| `/api/admin/projects/[slug]/html` | GET/PUT | 项目详情页 HTML 编辑 |
| `/api/admin/upload` | POST | 文件上传（Supabase Storage） |
| `/api/admin/about-media` | GET/PUT | About 页面媒体管理 |
| `/api/admin/analytics` | GET | 分析数据汇总 |
| `/api/analytics` | POST | 前端事件上报 |
| `/api/rum` | POST | Real User Monitoring |
| `/api/payments/checkout` | POST | 创建支付订单 |
| `/api/payments/orders/[orderNo]` | GET | 查询订单状态 |
| `/api/payments/alipay/notify` | POST | 支付宝回调 |
| `/api/payments/wechat/notify` | POST | 微信支付回调 |
| `/api/feed.xml` | GET | RSS 订阅源 |

## 核心库文件 (`src/lib/`)

| 文件 | 说明 |
|---|---|
| `blog.ts` | 博客数据加载（双源：本地 MDX + Supabase，async 函数） |
| `products.ts` | 产品数据加载（Supabase 优先，本地 MDX 兜底） |
| `projects.ts` | 项目数据加载（`config/projects.json`） |
| `notes-utils.ts` | Supabase notes CRUD 工具函数 |
| `admin-auth.ts` | HMAC 认证：密码登录、签名 Cookie、verify/protect |
| `admin-products.ts` | Admin 产品管理类型和工具 |
| `supabase.ts` | Supabase 客户端（public + admin） |
| `seo.ts` | SEO 工具：JSON-LD、metadata、sitemap、RSS |
| `mdx.ts` | MDX 文件读取和编译 |
| `payments.ts` | 支付逻辑 |
| `orders.ts` | 订单管理 |
| `server-observability.ts` | 服务端日志和请求追踪 |
| `rate-limit.ts` | API 限流 |

## 内容结构

### 本地 MDX 文件
路径：`content/{type}/{slug}.{locale}.mdx`

类型：`products/`、`library/`、`playbooks/`、`cases/`

### Supabase 数据库
- Schema：`supabase/schema.sql`
- 迁移：`supabase/migrations/`（需手动在 Supabase SQL Editor 执行）
- 核心表：`posts`, `post_history`, `analytics_events`, `products`, `product_orders`
- Storage 桶：`blog-assets`

### posts 表关键列
`slug`, `title`, `content`, `excerpt`, `category`, `tags (text[])`, `cover_image`, `lifecycle_status (draft/review/published)`, `published (bool)`, `lang`, `date`, `updated_at`, `seo_title`, `seo_description`, `source`

## Admin 后台架构

### 工作流设计
AI Agent 通过 Supabase 直接写入 `posts` 表创建内容。Admin 后台主要用于：
1. 查看最近内容，一键切换发布状态
2. 编辑/微调已有文章（富编辑器：分栏预览、拖拽上传）
3. 管理项目和产品

### 编辑器组件 (`src/components/admin/Editor.tsx`)
统一的富编辑器，支持两种模式：
- `apiMode="note"`（默认）：使用 `/api/admin/notes/save` API
- `apiMode="blog"`：使用 `/api/admin/blog/posts/*` API

功能：分栏预览、专注模式、拖拽/粘贴上传、Markdown 快捷插入、草稿自动保存（localStorage）、发布清单检查、字数/标题统计。

### AdminShell (`src/components/admin/AdminShell.tsx`)
管理后台布局组件，包含：
- 左侧边栏导航（4 个入口：概览、博客管理、项目管理、产品管理）
- 顶部操作栏
- 移动端响应式侧边栏

## 环境变量

**必需**：
- `NEXT_PUBLIC_SITE_URL` — https://nasbuild.dev
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase 项目 URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase 匿名密钥
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase 服务端密钥
- `ADMIN_PASSWORD` — 管理后台密码
- `ADMIN_SESSION_SECRET` — 会话签名密钥

**可选**：`NEXT_PUBLIC_GA_ID`、`NEXT_PUBLIC_FORM_ENDPOINT`、`NEXT_PUBLIC_ADSENSE_CLIENT`、`NEXT_PUBLIC_ENABLE_ADSENSE`

## 注意事项

1. **所有 blog 函数都是 async**：`getAllPosts()`, `getPostBySlug()`, `getAllPostSlugs()`, `getAllPostTags()`, `getAllCategories()`, `getRelatedPosts()` 都返回 Promise，调用时必须 await
2. **Vercel 文件系统只读**：不能用 `fs.writeFile` 写入 `content/` 目录，所有写操作必须走 Supabase
3. **Admin 路由不走 i18n 中间件**：admin 页面在 `src/app/admin/` 下，不在 `[locale]` 下
4. **Tailwind v4**：使用 `@import "tailwindcss"` 语法，配置在 `tailwind.config.ts`
5. **图标只用 Lucide React**：禁止 emoji，禁止其他图标库
6. **设计禁止纯白纯黑**：背景用 `surface-100/200`，文字用 `surface-800/900`

# 个人变现网站

基于 Next.js 15+ 的个人网站，用于销售数字产品和收集 SaaS 候补名单。

## 功能特性

- 🌐 **国际化支持** - 中文 (zh) 和日语 (ja)，基于 URL 前缀路由
- 📦 **数字产品** - 产品列表和详情页，带购买链接
- 📚 **资源库** - Prompt、模板、检查清单、SOP，支持复制/下载
- 🎯 **SaaS 候补名单** - 收集感兴趣用户的表单
- 📖 **Playbooks** - 针对特定目标的分步指南
- 📝 **案例 & 笔记** - 基于 MDX 的博客内容
- 📊 **数据分析** - GA4 集成，支持自定义事件追踪
- 🎨 **现代 UI** - Google Material Design 风格，移动优先

## 技术栈

- **框架**: Next.js 15 (App Router)
- **语言**: TypeScript
- **样式**: TailwindCSS
- **内容**: MDX + gray-matter
- **国际化**: next-intl
- **部署**: Vercel

## 快速开始

### 环境要求

- Node.js 18+
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 环境变量

基于 `.env.example` 创建 `.env.local` 文件：

```bash
cp .env.example .env.local
```

配置以下变量：
- `NEXT_PUBLIC_GA_ID` - Google Analytics 4 测量 ID
- `NEXT_PUBLIC_FORM_ENDPOINT` - 表单提交端点（如 Formspree）
- `NEXT_PUBLIC_SITE_URL` - 生产环境 URL

### 开发环境

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)。

### 构建

```bash
npm run build
```

## 项目结构

```
personal-site/
├── content/                 # MDX 内容文件
│   ├── products/           # 数字产品 (*.zh.mdx, *.ja.mdx)
│   ├── library/            # 资源 (prompts, templates 等)
│   ├── playbooks/          # 分步指南
│   ├── cases/              # 成功案例
│   └── notes/              # 博客文章
├── messages/               # 国际化翻译文件
│   ├── zh.json
│   └── ja.json
├── src/
│   ├── app/                # Next.js App Router 页面
│   │   └── [locale]/       # 带语言前缀的路由
│   ├── components/         # React 组件
│   │   ├── layout/         # Header, Footer, LanguageSwitcher
│   │   ├── cards/          # ProductCard, ResourceCard
│   │   ├── forms/          # WaitlistForm, NewsletterSignup
│   │   └── ui/             # TagFilter, CopyButton, DownloadButton
│   ├── i18n/               # 国际化配置
│   └── lib/                # 工具函数 (mdx.ts, analytics.tsx)
└── public/                 # 静态资源
```

## 内容管理

### 添加产品

在 `content/products/` 创建 MDX 文件：

```mdx
---
title: "产品名称"
summary: "简短描述"
tags: ["标签1", "标签2"]
updatedAt: "2024-01-01"
language: "zh"
price: "¥99"
purchaseUrl: "https://gumroad.com/..."
---

产品内容...
```

### 添加资源

在 `content/library/` 创建 MDX 文件：

```mdx
---
title: "资源名称"
summary: "描述"
tags: ["标签1"]
updatedAt: "2024-01-01"
language: "zh"
type: "prompt"  # prompt | template | checklist | sop
copyText: "要复制的文本"  # 用于 prompt 类型
downloadUrl: "..."  # 用于可下载资源
---
```

## 部署

### Vercel（推荐）

1. 推送到 GitHub
2. 在 Vercel 导入项目
3. 配置环境变量
4. 部署

### 其他平台

构建并导出：

```bash
npm run build
```

将 `.next` 文件夹部署到你的托管平台。

## 许可证

MIT

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

### Notion CMS 

网站使用 Notion 作为 CMS，支持资源库和笔记模块。

#### 1. 创建 Integration
- 访问 [Notion My Integrations](https://www.notion.so/my-integrations)
- 创建新 Integration，获取 `Internal Integration Secret` (作为 `NOTION_TOKEN`)

#### 2. 准备数据库
- 在数据库页面点击右上角 `...` > `Connect to` > 选择你的 Integration
- 获取 Database ID (URL 中 `https://www.notion.so/myworkspace/{database_id}?v=...`)

#### 3. 数据库字段要求

| 字段名 | 类型 | 说明 |
|--------|------|------|
| `Title` | title | 标题 |
| `Slug` | text | URL 路径 (例如: `my-first-note`) |
| `Language` | select | `zh` 或 `ja` |
| `Type` | select | `note` / `library` 等 |
| `Category` | select | **资源库分类**（见下表） |
| `Summary` | text | 摘要 |
| `Date` | date | 发布日期 |
| `Tags` | multi_select | 标签 |
| `Published` | checkbox | 勾选后才会显示 |

#### 4. Category 字段选项

| Value | 中文显示 | 日文显示 | 说明 |
|-------|----------|----------|------|
| `template` | 模板 | テンプレート | 模板资源 |
| `checklist` | 清单 | チェックリスト | 检查清单 |
| `sop` | SOP | SOP | 标准操作流程 |
| `prompt` | Prompt | Prompt | AI 提示词 |
| `note` | 笔记 | ノート | 笔记文章 |

**规则说明：**
- **资源库页面** (`/library`): 按 Category 分类展示，点击"笔记"Tab 会显示 Category=note 的内容
- **笔记页面** (`/notes`): 按 Type=note 展示所有笔记
- 若 Category 未设置，内容会显示在"全部"Tab，并提示"未分类"

#### 5. 环境变量

在 `.env.local` 或 Vercel 中配置：
```
NOTION_TOKEN=secret_...
NOTION_DATABASE_ID=...
```

### 其他内容 (MDX)

目前 Products, Playbooks 等仍使用本地 MDX 文件管理。
在 `content/` 目录下创建对应文件夹的 MDX 文件即可。

### Google AdSense 广告集成

#### 1. 获取 Publisher ID
1. 访问 [Google AdSense](https://www.google.com/adsense/)
2. 注册或登录账户
3. 在"账号" > "账号信息"中找到 Publisher ID（格式：`ca-pub-XXXXXXXXXXXXXXXX`）

#### 2. 配置环境变量
```bash
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX
NEXT_PUBLIC_ENABLE_ADSENSE=true  # 生产环境设为 true
```

#### 3. 验证 ads.txt
部署后访问 `https://yourdomain.com/ads.txt`，确认内容：
```
google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0
```

#### 4. AdSense 审核注意事项
- ✅ 网站需有足够内容（建议 10+ 页面）
- ✅ 必须有隐私政策页面 (`/privacy`)
- ✅ 必须有服务条款页面 (`/terms`)
- ✅ 内容需原创且有价值
- ✅ 网站需正常运行一段时间

#### 5. 使用 AdUnit 组件（手动广告位）
```tsx
import { AdUnit, ArticleBottomAd } from '@/components/AdUnit';

// Auto Ads（自动广告）已在 layout.tsx 配置，无需手动添加

// 手动广告位（需在 AdSense 创建广告单元获取 slot ID）
<AdUnit slot="1234567890" format="auto" responsive />
<ArticleBottomAd slot="1234567890" />
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

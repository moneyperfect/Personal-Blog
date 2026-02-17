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

### 内容来源选择

网站支持两种内容来源：**Notion API** 和 **Obsidian 本地文件**。推荐使用 Obsidian 方案以获得最佳性能和完全控制。

#### 方案一：Obsidian 本地文件（推荐）

如果你已经在使用 Obsidian + GitHub 同步工作流，这是最佳选择：

**优势**：
- ⚡ **瞬间加载**：纯静态文件，与模板笔记相同速度
- 🔄 **完全控制**：直接在 Obsidian 中编辑，自动同步到网站
- 🌐 **离线可用**：不依赖任何第三方 API
- 📦 **数据安全**：所有内容在 Git 版本控制中

**设置步骤**：

1. **添加 Obsidian 子模块**：
   ```bash
   git submodule add <你的Obsidian仓库URL> obsidian-notes
   git submodule update --init --recursive
   ```

2. **配置环境变量**（`.env.local`）：
   ```bash
   OBSIDIAN_NOTES_PATH=./obsidian-notes
   ```

3. **首次转换**：
   ```bash
   npm run convert-obsidian
   ```

4. **Obsidian 笔记规范**：
   - 文件名：`笔记标题.zh.md` 或 `笔记标题.ja.md`
   - Frontmatter 必须包含：`title`, `summary`, `tags`, `date`, `language`
   - 可选字段：`category`, `type`, `slug`

5. **自动同步**：
   - GitHub Actions 每6小时自动同步（`.github/workflows/sync-obsidian.yml`）
   - 或手动运行：`npm run convert-obsidian`

**转换功能**：
- `[[内部链接]]` → `[内部链接](/zh/notes/slug)`
- `![[图片.png]]` → `![](/images/图片.png)`
- `%%注释%%` → 自动移除

#### 方案二：Notion API（备选）

如果你仍想使用 Notion 作为 CMS：

**性能优化**：
- **内存缓存**：笔记内容缓存60秒
- **本地同步**：可同步到 MDX 文件（`npm run sync-notes`）
- **静态生成**：构建时预渲染页面

**同步方式**：
1. **API端点**：`GET /api/sync-notes`（开发环境）
2. **命令行**：`npm run sync-notes`
3. **GitHub Actions**：`.github/workflows/sync-notion-notes.yml`

**注意**：Notion API 有速率限制，首次加载可能需要 3-6 秒。

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
### 自动同步与维护

#### 分类问题排查
如果 Notion 中已分类的笔记在博客分类选项中未显示，请按以下步骤排查：

1. **检查 Category 字段值**：确保 Notion 数据库中的 Category 字段值为以下之一（区分大小写）：
   - `template`（模板）
   - `checklist`（清单）
   - `sop`（SOP）
   - `prompt`（Prompt）
   - `note`（笔记）
   
   代码会自动将值转换为小写，但建议统一使用小写。

2. **检查 Published 字段**：确保笔记已勾选 Published 复选框。

3. **检查 Language 字段**：确保 Language 字段值为 `zh`（中文）或 `ja`（日语）。

4. **浏览器控制台调试**：访问 `/library` 页面，打开浏览器开发者工具（F12），查看 Console 标签页中的日志。日志会显示每个 Notion 项目的分类、类型等信息。

5. **未分类警告**：如果页面显示未分类警告，说明有项目的 Category 字段为空或值不匹配，请在 Notion 中修正。

#### 自动同步设置
为确保 Notion 笔记变更及时同步到网站，建议设置自动同步：

**方案一：GitHub Actions（推荐）**
1. 在 GitHub 仓库中配置 Secrets：
   - `NOTION_TOKEN`：Notion Integration Token
   - `NOTION_DATABASE_ID`：Notion 数据库 ID
2. 工作流文件已创建：`.github/workflows/sync-notion-notes.yml`
3. 默认每 6 小时自动同步一次，也可手动触发
4. 同步后自动提交更改并推送到仓库，触发 Vercel 重新部署

**方案二：Vercel Cron Jobs（需要 Pro 计划）**
1. 在 Vercel 项目中配置环境变量
2. 创建 Cron Job 调用 API 端点：
   ```
   https://yourdomain.com/api/sync-notes
   ```
   需要设置 `Authorization: Bearer <SYNC_SECRET>` 头，或在 `.env.local` 中不设置 `SYNC_SECRET`（仅开发环境）

**方案三：手动同步**
- 本地开发：运行 `npm run sync-notes`
- 生产环境：调用 `POST /api/sync-notes` API 端点

#### 构建集成
可在 `package.json` 中添加 prebuild 脚本，确保每次构建都使用最新的笔记内容：
```json
"scripts": {
  "prebuild": "npm run sync-notes",
  "build": "next build"
}
```

## 部署

### Vercel（推荐）

网站已配置为使用 Vercel 自动部署。只需将代码推送到 GitHub，Vercel 将自动构建和部署。

#### 1. 连接 GitHub 仓库到 Vercel

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 "Add New..." → "Project"
3. 导入你的 GitHub 仓库 (`moneyperfect/Personal-Blog`)
4. 保持默认设置，点击 "Deploy"

#### 2. 配置环境变量

在 Vercel 项目设置中配置以下环境变量：

**必需变量：**
- `OBSIDIAN_NOTES_PATH`: `./obsidian-notes`（Obsidian 子模块路径）
- `NEXT_PUBLIC_SITE_URL`: 你的网站域名（如 `https://yourdomain.com`）

**可选变量（如果使用 Notion 作为备选源）：**
- `NOTION_TOKEN`: Notion Integration Token
- `NOTION_DATABASE_ID`: Notion 数据库 ID

**广告相关（可选）：**
- `NEXT_PUBLIC_GA_ID`: Google Analytics 4 测量 ID
- `NEXT_PUBLIC_ADSENSE_CLIENT`: AdSense Publisher ID
- `NEXT_PUBLIC_ENABLE_ADSENSE`: `true`（生产环境启用）

#### 3. 自动部署流程

- **推送到 main 分支** → 自动触发 Vercel 部署
- **Obsidian 笔记同步** → 每6小时自动同步（通过 GitHub Actions）
- **构建前预处理** → 自动转换 Obsidian 笔记为 MDX 格式

#### 4. 验证部署

部署完成后，访问 Vercel 提供的域名（如 `https://personal-blog.vercel.app`）检查：
- 笔记页面 (`/zh/notes`) 是否正常显示
- 资源库 (`/zh/library`) 分类是否正常
- 各语言版本是否正常切换

### GitHub Pages（静态导出）

如需部署到 GitHub Pages，需要进行额外配置：

#### 1. 启用静态导出
修改 `next.config.ts`，添加 `output: 'export'`：
```typescript
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true }
};
```

#### 2. 处理动态路由
- 移除 `robots.ts` 和 `sitemap.ts`（或替换为静态版本）
- 确保所有页面都支持静态生成（使用 `generateStaticParams`）

#### 3. GitHub Actions 部署
使用已配置的 `.github/workflows/deploy.yml`（需先完成上述修改）。

### 手动构建与测试

```bash
# 本地构建测试
npm run build

# 本地预览
npm start
```

构建产物位于 `.next` 文件夹，可部署到任何支持静态文件的托管平台。

## 管理控制台

网站包含一个安全的管理控制台，用于管理笔记内容和查看分析数据。

### 主要功能
- **密码保护登录**：通过 `/admin` 路径访问
- **笔记管理**：启用/禁用笔记、修改分类
- **数据可视化**：统计图表和流量分析
- **Obsidian集成**：管理从Obsidian同步的笔记

### 快速开始
1. 设置环境变量 `ADMIN_PASSWORD`（必须）
2. 访问 `https://yourdomain.com/admin`
3. 输入密码登录管理控制台

### 详细指南
完整的使用说明和部署指南请查看 [docs/admin-guide.md](docs/admin-guide.md)

## 许可证

MIT

# Admin Dashboard 优化需求文档

**版本：** v1.0
**日期：** 2026-05-23
**目标：** 将 admin 后台从「仅管理 Supabase 笔记」升级为「全站内容管理中心」

---

## 一、背景与问题

### 现状

当前 admin 后台（`/admin/dashboard`）只能管理存储在 Supabase 数据库中的笔记，无法管理：

| 内容类型 | 存储位置 | 当前管理方式 |
|---------|---------|-------------|
| 博客文章 | `content/posts/*.md` | 需要 Akari 或手动编辑文件 |
| 项目展示页 | `public/projects/*.html` | 需要 Akari 或手动编辑文件 |
| 项目配置 | `config/projects.json` | 需要 Akari 或手动编辑 JSON |
| 设计规范 | `references/design-tokens.md` | 需要 Akari 或手动编辑文件 |

### 用户痛点

用户遇到小错误（如 vibeimg.html 中的「2025 年 4 月」应为「2026 年 4 月」）时，只能通过 Akari 或手动编辑代码文件来修复，效率低下且浪费 AI 资源。

### 目标

让用户可以通过 admin 后台直接管理所有内容类型，无需技术背景即可完成日常内容维护。

---

## 二、功能需求

### 2.1 博客文章管理

**优先级：** P0（核心功能）

**功能列表：**

| 功能 | 描述 | 优先级 |
|------|------|--------|
| 文章列表 | 显示所有博客文章，按日期排序，支持搜索和筛选 | P0 |
| 文章编辑 | 可视化编辑器，支持 Markdown 预览 | P0 |
| Frontmatter 编辑 | 编辑 title、date、tags、category、description | P0 |
| 新建文章 | 创建新的 .md 文件并添加到 content/posts/ | P1 |
| 删除文章 | 删除 .md 文件（需二次确认） | P1 |
| 草稿功能 | 标记文章为草稿，不显示在博客列表 | P2 |

**技术实现：**

```typescript
// API 端点设计
GET    /api/admin/blog/posts          // 获取所有文章列表
GET    /api/admin/blog/posts/:slug    // 获取单篇文章内容
POST   /api/admin/blog/posts          // 创建新文章
PUT    /api/admin/blog/posts/:slug    // 更新文章内容
DELETE /api/admin/blog/posts/:slug    // 删除文章

// 数据结构
interface BlogPost {
  slug: string;
  frontmatter: {
    title: string;
    date: string;
    tags: string[];
    category?: string;
    description: string;
    lang?: string;
  };
  content: string;  // Markdown 正文
}
```

**文件操作：**
- 读取：`fs.readFileSync(`content/posts/${slug}.md`)`
- 写入：`fs.writeFileSync(`content/posts/${slug}.md`, newContent)`
- 删除：`fs.unlinkSync(`content/posts/${slug}.md`)`
- 列表：`fs.readdirSync('content/posts/').filter(f => f.endsWith('.md'))`

**部署联动：**
- 文章更新后，自动触发 Vercel 重新部署（通过 GitHub API 或 Vercel Deploy Hook）
- 或者提示用户「内容已保存，需手动部署」

---

### 2.2 项目展示管理

**优先级：** P0（核心功能）

**功能列表：**

| 功能 | 描述 | 优先级 |
|------|------|--------|
| 项目列表 | 显示所有项目，来自 config/projects.json | P0 |
| 项目编辑 | 编辑项目基本信息（名称、描述、技术栈、链接） | P0 |
| 详情页编辑 | 编辑 HTML 详情页内容（如 vibeimg.html） | P0 |
| 新建项目 | 添加新项目到 projects.json | P1 |
| 删除项目 | 从 projects.json 移除项目 | P1 |
| 截图管理 | 上传/替换项目截图 | P2 |

**技术实现：**

```typescript
// API 端点设计
GET    /api/admin/projects              // 获取所有项目列表
GET    /api/admin/projects/:slug        // 获取单个项目详情
PUT    /api/admin/projects/:slug        // 更新项目信息
POST   /api/admin/projects              // 创建新项目
DELETE /api/admin/projects/:slug        // 删除项目

GET    /api/admin/projects/:slug/html   // 获取 HTML 详情页内容
PUT    /api/admin/projects/:slug/html   // 更新 HTML 详情页内容

// 数据结构
interface Project {
  slug: string;
  name: { zh: string; ja: string };
  description: { zh: string; ja: string };
  techStack: string[];
  link: string;
  image: string;
  content: { zh: string; ja: string };
  detailPage?: string;
}
```

**文件操作：**
- 项目配置：`config/projects.json`
- HTML 详情页：`public/projects/${slug}.html`
- 截图：`public/images/projects/`

**编辑器设计：**
- 项目信息：表单编辑，字段对应 projects.json 结构
- HTML 详情页：代码编辑器（Monaco Editor 或 CodeMirror），支持 HTML 预览
- 截图：拖拽上传，自动压缩为 webp

---

### 2.3 全局设置管理

**优先级：** P1（重要功能）

**功能列表：**

| 功能 | 描述 | 优先级 |
|------|------|--------|
| 站点信息 | 编辑站点标题、描述、关键词 | P1 |
| 导航菜单 | 管理顶部导航链接 | P2 |
| Footer 信息 | 编辑页脚版权、链接 | P2 |
| SEO 设置 | 管理 OG 图片、canonical URL | P2 |

**技术实现：**

```typescript
// 配置文件
const CONFIG_FILES = {
  site: 'config/site.json',
  navigation: 'config/navigation.json',
  seo: 'config/seo.json',
};

// API 端点
GET    /api/admin/settings/:type       // 获取配置
PUT    /api/admin/settings/:type       // 更新配置
```

---

### 2.4 部署管理

**优先级：** P1（重要功能）

**功能列表：**

| 功能 | 描述 | 优先级 |
|------|------|--------|
| 部署状态 | 显示最近部署状态和时间 | P1 |
| 手动部署 | 触发 Vercel 重新部署 | P1 |
| 构建日志 | 查看最近构建日志 | P2 |

**技术实现：**

```typescript
// Vercel API 集成
const VERCEL_API = 'https://api.vercel.com';
const VERCEL_TOKEN = process.env.VERCEL_TOKEN;

// API 端点
GET    /api/admin/deploy/status        // 获取部署状态
POST   /api/admin/deploy/trigger       // 触发部署
GET    /api/admin/deploy/logs          // 获取构建日志
```

---

## 三、UI/UX 设计要求

### 3.1 设计风格

遵循 Claude/Anthropic 设计风格（参考 `references/design-tokens.md`）：

- **色彩：** 米色背景（#FAF7F1）、深炭灰文字（#23344a）、赤陶强调色（#C46849）
- **字体：** 标题用衬线字体（Playfair Display），正文用无衬线字体（Noto Sans SC）
- **组件：** 大圆角（12px+）、宽 padding、呼吸感、无生硬边框
- **图标：** Lucide Icons，禁止 Emoji

### 3.2 页面布局

```
┌─────────────────────────────────────────────────────┐
│  NAS ADMIN v0.2.0                    [退出登录]     │
├──────────────┬──────────────────────────────────────┤
│              │                                      │
│  📊 数据概览  │  [当前页面内容区域]                    │
│              │                                      │
│  📝 博客管理  │                                      │
│              │                                      │
│  🚀 项目管理  │                                      │
│              │                                      │
│  ⚙️ 全局设置  │                                      │
│              │                                      │
│  🚀 部署管理  │                                      │
│              │                                      │
└──────────────┴──────────────────────────────────────┘
```

### 3.3 交互设计

- **保存反馈：** 保存成功后显示 Toast 提示，自动消失
- **错误处理：** 网络错误、权限错误等友好提示
- **确认对话框：** 删除操作需二次确认
- **加载状态：** 数据加载时显示骨架屏或 Spinner
- **响应式：** 支持移动端访问

---

## 四、技术架构

### 4.1 前端

- **框架：** Next.js App Router（已有）
- **状态管理：** React Context + useReducer（轻量级）
- **编辑器：** 
  - Markdown：`@uiw/react-md-editor` 或 `react-markdown-editor-lite`
  - HTML：`@monaco-editor/react` 或 `@uiw/react-codemirror`
- **UI 组件：** Tailwind CSS + 自定义组件（遵循 Claude 风格）

### 4.2 后端

- **API 路由：** Next.js API Routes（`src/app/api/admin/`）
- **文件操作：** Node.js `fs` 模块
- **认证：** 已有 HMAC 会话系统（`src/lib/admin-auth.ts`）
- **部署触发：** Vercel API 或 GitHub API

### 4.3 文件结构

```
src/app/admin/
├── layout.tsx              # Admin 布局（侧边栏 + 内容区）
├── page.tsx                # 登录页
└── dashboard/
    ├── page.tsx            # 数据概览（已有）
    ├── blog/
    │   ├── page.tsx        # 博客文章列表
    │   └── [slug]/
    │       └── page.tsx    # 文章编辑页
    ├── projects/
    │   ├── page.tsx        # 项目列表
    │   └── [slug]/
    │       └── page.tsx    # 项目编辑页
    ├── settings/
    │   └── page.tsx        # 全局设置
    └── deploy/
        └── page.tsx        # 部署管理

src/app/api/admin/
├── blog/
│   ├── posts/
│   │   ├── route.ts        # GET (列表), POST (创建)
│   │   └── [slug]/
│   │       └── route.ts    # GET (详情), PUT (更新), DELETE (删除)
├── projects/
│   ├── route.ts            # GET (列表), POST (创建)
│   └── [slug]/
│       ├── route.ts        # GET (详情), PUT (更新), DELETE (删除)
│       └── html/
│           └── route.ts    # GET (HTML内容), PUT (更新HTML)
├── settings/
│   └── [type]/
│       └── route.ts        # GET (配置), PUT (更新配置)
└── deploy/
    ├── status/
    │   └── route.ts        # GET (部署状态)
    ├── trigger/
    │   └── route.ts        # POST (触发部署)
    └── logs/
        └── route.ts        # GET (构建日志)
```

---

## 五、实现优先级

### Phase 1：核心功能（MVP）

**目标：** 让用户可以编辑博客文章和项目信息

**任务清单：**

1. **博客文章列表页** (`/admin/dashboard/blog`)
   - 读取 `content/posts/` 目录
   - 解析 frontmatter 和内容
   - 按日期排序显示
   - 支持搜索

2. **博客文章编辑页** (`/admin/dashboard/blog/[slug]`)
   - 加载文章内容
   - Markdown 编辑器 + 预览
   - Frontmatter 表单编辑
   - 保存功能

3. **项目列表页** (`/admin/dashboard/projects`)
   - 读取 `config/projects.json`
   - 显示项目卡片列表

4. **项目编辑页** (`/admin/dashboard/projects/[slug]`)
   - 编辑项目基本信息
   - 编辑 HTML 详情页（代码编辑器）
   - 保存功能

5. **部署触发功能**
   - 集成 Vercel API
   - 显示部署状态
   - 手动触发部署按钮

**预计工时：** 3-5 天

---

### Phase 2：增强功能

**目标：** 完善管理体验

**任务清单：**

1. **新建/删除功能**
   - 新建博客文章
   - 删除博客文章（二次确认）
   - 新建项目
   - 删除项目（二次确认）

2. **全局设置管理**
   - 站点信息编辑
   - 导航菜单管理
   - SEO 设置

3. **截图管理**
   - 上传截图
   - 自动压缩为 webp
   - 预览功能

**预计工时：** 2-3 天

---

### Phase 3：高级功能

**目标：** 提升效率

**任务清单：**

1. **草稿系统**
   - 文章草稿保存
   - 草稿预览
   - 发布功能

2. **构建日志查看**
   - 集成 Vercel 日志 API
   - 实时日志流

3. **批量操作**
   - 批量修改分类
   - 批量删除

**预计工时：** 2-3 天

---

## 六、验收标准

### 6.1 功能验收

- [ ] 用户可以查看所有博客文章列表
- [ ] 用户可以编辑博客文章的 frontmatter 和内容
- [ ] 用户可以保存修改并看到成功提示
- [ ] 用户可以查看所有项目列表
- [ ] 用户可以编辑项目基本信息
- [ ] 用户可以编辑项目 HTML 详情页
- [ ] 用户可以触发 Vercel 重新部署
- [ ] 所有修改在部署后生效

### 6.2 体验验收

- [ ] 页面加载时间 < 2 秒
- [ ] 保存操作响应时间 < 1 秒
- [ ] 移动端可正常访问和操作
- [ ] 错误提示友好、清晰
- [ ] 删除操作有二次确认

### 6.3 安全验收

- [ ] 所有 API 需要认证
- [ ] 文件路径遍历攻击防护
- [ ] XSS 攻击防护
- [ ] CSRF 攻击防护

---

## 七、附录

### 7.1 相关文件

| 文件 | 用途 |
|------|------|
| `content/posts/*.md` | 博客文章 |
| `config/projects.json` | 项目配置 |
| `public/projects/*.html` | 项目详情页 |
| `public/images/projects/*` | 项目截图 |
| `src/lib/admin-auth.ts` | 管理员认证 |
| `references/design-tokens.md` | 设计规范 |

### 7.2 现有 Admin 功能

当前 admin 后台已有功能：
- Supabase 笔记管理（增删改查）
- 产品管理（增删改查）
- 数据概览（统计图表）
- About 页头像管理

### 7.3 技术参考

- Next.js App Router 文档：https://nextjs.org/docs/app
- Vercel API 文档：https://vercel.com/docs/api
- Monaco Editor：https://microsoft.github.io/monaco-editor/
- React Markdown Editor：https://github.com/uiwjs/react-md-editor

---

**文档维护者：** Akari
**最后更新：** 2026-05-23

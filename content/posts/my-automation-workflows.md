---
title: "我的自动化工作流：公众号、博客、产品日报"
date: 2026-05-23
tags: [自动化, AI, 独立开发, Agent]
category: 技术
description: "我用 AI Agent 搭建了 5 套自动化工作流，覆盖公众号发布、博客维护、产品数据监控。这篇文章记录了整个系统的构成、技术实现和设计思路。"
---

我目前有 5 套自动化工作流在跑，覆盖内容发布、数据监控和部署。这篇文章把它们整理出来。

所有定时任务由 Hermes Agent（我叫它 Akari）执行。Akari 运行在本地 WSL2 环境，可以访问文件系统、执行命令、调用 API。我通过微信和它对话，给指令或讨论内容。

## 系统概览

| 工作流 | 频率 | 做什么 |
|--------|------|--------|
| 公众号自动发布 | 每天 3 次（8:00 / 11:00 / 16:00） | 选题 → 写文案 → AI 检测 → 生图 → 上传草稿箱 |
| VibeImg 日报 | 每天 8:00 | 拉产品后台数据，推送用户/访问/收入 |
| 博客周报 | 每周一 10:00 | 汇总博客 UV/PV/热门文章 |
| 博客部署 | git push 触发 | GitHub → Vercel 自动构建 |
| 博客维护 | 按需 | 内容发布、项目管理、SEO 维护 |

---

## 1. 公众号自动发布

每天 3 次，Akari 自动完成从选题到上传草稿箱的全流程。

**选题：** 读取 Obsidian 中的评分记录。每篇文章有 4 个评分维度（选题共鸣、标题钩子、内容质量、可读性），各 1-10 分，综合分带时间衰减权重。选题时优先选综合分高的，标题用反常识钩子策略优化。

**写文案：** 生成 1500-2500 字，要求覆盖三个不同维度。提到产品或工具时必须给介绍或网址，不假设读者知道。

**AI 检测：** 扫描文案中的 AI 生成痕迹（比如"在当今时代"、"总而言之"），检测到就自动修改。

**生图：** 根据选题类型匹配 4 种封面风格，调用 VibeImg API（底层 gpt-image-2）生成封面图。提示词用中文写，画面必须带标题文案。同时生成 2-3 张文中配图。

**上传：** 通过微信公众号 API 上传到草稿箱。API 走腾讯云 SCF 中转，固定出口 IP 1.12.46.117，避免 WSL2 环境下 IP 漂移的问题。

我在微信端看到结果后，可以发布、打分或修改。打分数据自动存回 Obsidian，影响后续选题权重，形成闭环。

---

## 2. VibeImg 日报

每天早上 8 点，Akari 登录 VibeImg 后台拉取数据，生成日报推送到微信。

**数据：** 新增注册、付费用户、访问量、生图次数、收入。

**实现：** 调用 `/api/auth/login` 获取 session cookie（`image_site_session`，24h 过期），然后依次调用 `/api/admin/analytics/overview`、`/api/admin/analytics/traffic`、`/api/admin/users` 汇总数据。

---

## 3. 博客周报

每周一 10 点，从 Supabase 拉取前端埋点数据，生成周报。

**数据：** 7 天 PV、文章浏览量、CTA 点击、平均阅读深度、热门文章 Top 5。

**实现：** Python 脚本 `blog-analytics.py`。先调 `/api/admin/login` 获取 `admin_token` cookie，再调 `/api/admin/analytics` 接口。接口返回 30 天事件数据，脚本本地过滤 7 天窗口做统计。

数据来源是前端埋点——用户访问时，前端代码向 `/api/analytics` 发送 page_view、note_view、read_progress 等事件，存入 Supabase 的 `analytics_events` 表。

---

## 4. 博客部署

`git push origin main` → Vercel 自动构建 → 1-2 分钟后线上生效。

代码在 GitHub（moneyperfect/Personal-Blog），Vercel 原生支持 Next.js，推代码就构建，零配置。DNS 走 Cloudflare。

---

## 5. 博客维护

Akari 执行的按需维护流程。

**内容发布：** 我给方向/素材 → Akari 写 .md（frontmatter + 正文）→ 我审核 → push → 部署。

**项目展示：** 我提供项目信息/截图 → Akari 更新 `config/projects.json` + 写 HTML 详情页 → 截图压缩为 webp（目标 < 300KB）→ push。

**SEO：** OG tags、canonical 标签、JSON-LD 结构化数据、sitemap.xml。

**设计规范：** 全站 Claude/Anthropic 风格——米色背景（#FAF7F1）、衬线标题（Playfair Display）、纯黑按钮、赤陶强调色（#C46849）。

**Obsidian 联动：** 发布后在 `04_项目构建/博客/已发布索引.md` 记录日期、标题、分类、URL。

---

## 技术栈

| 组件 | 技术 |
|------|------|
| 博客框架 | Next.js 16 + Turbopack |
| 数据库 | Supabase (PostgreSQL) |
| 部署 | Vercel |
| 域名 | nasbuild.dev (Cloudflare DNS) |
| Agent | Hermes Agent (Akari) |
| 内容管理 | Markdown + gray-matter |
| 图片生成 | VibeImg API (gpt-image-2) |
| 笔记系统 | Obsidian |
| 定时任务 | Hermes Agent cron |

## 当前状态

公众号自动发布和 VibeImg 日报已经跑了将近一个月，稳定。博客周报刚设好，还没有数据积累。博客维护流程刚打通，目前只发布了这一篇文章。

后续计划是保持每周 1-2 篇的更新频率，内容围绕独立开发、AI 工具和产品复盘。

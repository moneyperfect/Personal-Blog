# Obsidian 集成方案

## 背景
用户已经在使用 Obsidian + GitHub + 本机同步的工作流。网站可以直接从 Obsidian 仓库获取内容，避免 Notion API 的延迟和依赖。

## 方案选择

### 方案A：Git 子模块（推荐）
1. 将 Obsidian 仓库添加为 Git 子模块
2. 构建时自动同步最新内容
3. 转换 Obsidian 笔记为网站格式

**优点**：
- 与现有 GitHub 工作流完全集成
- 自动同步，无需手动复制
- 保持 Obsidian 仓库独立

### 方案B：直接文件复制
1. 配置 Obsidian 仓库路径
2. 定期复制文件到 `content/notes/`
3. 转换格式

**优点**：
- 简单直接
- 不依赖 Git 子模块

## 实施步骤

### 1. Obsidian 笔记规范
Obsidian 笔记需要包含以下 frontmatter：

```yaml
---
title: "笔记标题"
summary: "笔记摘要"
tags: [标签1, 标签2]
date: "YYYY-MM-DD"
language: "zh"  # 或 "ja"
category: "note"  # 可选：template, checklist, sop, prompt, note
slug: "url-slug"  # 可选，默认从文件名生成
---
```

### 2. 文件名规范
- 中文笔记：`笔记标题.zh.md`
- 日文笔记：`笔记标题.ja.md`
- 自动生成 slug：`笔记标题` → `note-title`

### 3. 语法转换
需要处理的 Obsidian 语法：
- `[[内部链接]]` → `[内部链接](/zh/notes/internal-link)`
- `![[图片.png]]` → `![](/images/图片.png)`
- `%%注释%%` → 移除或保留

## 技术实现

### 转换脚本
创建 `scripts/convert-obsidian.ts`：
1. 扫描 Obsidian 目录
2. 读取 Markdown 文件
3. 转换 frontmatter 和内容
4. 输出到 `content/notes/`

### 构建集成
在 `package.json` 中添加：
```json
"scripts": {
  "convert-obsidian": "ts-node scripts/convert-obsidian.ts",
  "prebuild": "npm run convert-obsidian"
}
```

### 目录结构
```
personal-site/
├── content/notes/          # 转换后的笔记
├── scripts/
│   └── convert-obsidian.ts # 转换脚本
└── .gitmodules             # Obsidian 子模块
```

## 配置步骤

### 1. 添加 Obsidian 子模块
```bash
git submodule add <obsidian-repo-url> obsidian-notes
git submodule update --init --recursive
```

### 2. 环境变量
```bash
OBSIDIAN_NOTES_PATH=./obsidian-notes
```

### 3. 首次转换
```bash
npm run convert-obsidian
```

## 维护与更新

### 更新 Obsidian 内容
```bash
# 拉取最新 Obsidian 笔记
git submodule update --remote

# 转换并构建网站
npm run convert-obsidian
npm run build
```

### 自动同步（GitHub Actions）
`.github/workflows/sync-obsidian.yml`：
```yaml
steps:
  - uses: actions/checkout@v3
    with:
      submodules: recursive
  - run: git submodule update --remote
  - run: npm run convert-obsidian
  - run: git commit -am "chore: update obsidian notes" || echo "No changes"
  - run: git push
```

## 优势

1. **完全控制**：直接在 Obsidian 中编辑，立即生效
2. **无需网络**：不依赖 Notion API，离线可用
3. **性能极佳**：静态文件，瞬间加载
4. **工作流统一**：与现有 GitHub 同步无缝集成
5. **数据安全**：所有内容在 Git 版本控制中

## 迁移步骤

1. 将现有 Notion 笔记导出到 Obsidian
2. 添加必要的 frontmatter
3. 配置子模块和转换脚本
4. 测试转换和显示
5. 逐步淘汰 Notion 依赖
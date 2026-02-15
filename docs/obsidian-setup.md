# Obsidian 集成设置指南

## 概述
将你的 Obsidian 笔记仓库集成到博客网站，实现直接在 Obsidian 中编辑、自动同步到网站。

## 前置条件
1. 已有一个 Obsidian 笔记仓库（GitHub 托管）
2. 博客网站项目已在 GitHub

## 设置步骤

### 方案一：Git 子模块（推荐）

#### 1. 添加 Obsidian 子模块
```bash
# 在博客项目根目录执行
git submodule add <你的Obsidian仓库URL> obsidian-notes
git submodule update --init --recursive
```

#### 2. 配置环境变量
创建 `.env.local` 或设置 GitHub Secrets：
```bash
OBSIDIAN_NOTES_PATH=./obsidian-notes
```

#### 3. 首次转换
```bash
npm run convert-obsidian
```

#### 4. 提交更改
```bash
git add .
git commit -m "feat: add obsidian integration"
git push
```

### 方案二：本地目录（开发环境）

#### 1. 配置本地路径
```bash
# .env.local
OBSIDIAN_NOTES_PATH=../my-obsidian-vault
```

#### 2. 手动复制（如果不想使用子模块）
将 Obsidian 笔记复制到指定目录。

## Obsidian 笔记规范

### 文件名格式
- 中文笔记：`笔记标题.zh.md`
- 日文笔记：`笔记标题.ja.md`
- 双语笔记：创建两个文件 `标题.zh.md` 和 `标题.ja.md`

### Frontmatter 要求
每个笔记必须包含 YAML frontmatter：

```yaml
---
title: "笔记标题"
summary: "简短摘要"
tags: [标签1, 标签2]
date: "2024-01-01"
language: "zh"  # 或 "ja"
category: "note"  # 可选：template, checklist, sop, prompt, note
type: "note"     # 可选：与 category 相同
slug: "custom-slug"  # 可选，自定义URL
---
```

### 可选字段
- `description`: 同 summary
- `updated`: 更新日期
- `lang`: 同 language

## 自动转换

### 转换规则
1. **语言检测**：优先使用文件名后缀（`.zh.md`, `.ja.md`）
2. **Slug生成**：从标题或文件名自动生成
3. **标签处理**：支持数组或逗号分隔字符串
4. **链接转换**：
   - `[[内部链接]]` → `[内部链接](/zh/notes/internal-link)`
   - `![[图片.png]]` → `![](/images/图片.png)`
   - `%%注释%%` → 移除

### 构建流程
每次 `npm run build` 会自动：
1. 转换 Obsidian 笔记到 `content/notes/`
2. 构建静态网站
3. 清理已删除的笔记

## GitHub Actions 自动化

### 自动同步工作流
已创建 `.github/workflows/sync-obsidian.yml`：

```yaml
name: Sync Obsidian Notes

on:
  schedule:
    - cron: '0 */6 * * *'  # 每6小时
  workflow_dispatch:  # 手动触发

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          submodules: recursive
      - run: git submodule update --remote
      - run: npm ci
      - run: npm run convert-obsidian
      - run: |
          git config --local user.email "actions@github.com"
          git config --local user.name "GitHub Actions"
          git add content/notes/
          git commit -m "chore: update obsidian notes" || echo "No changes"
          git push
```

## 维护与更新

### 更新 Obsidian 内容
```bash
# 拉取最新笔记
git submodule update --remote

# 转换并查看变化
npm run convert-obsidian
git diff content/notes/

# 提交并推送
git add content/notes/
git commit -m "chore: update notes"
git push
```

### 故障排除

#### 1. 子模块更新失败
```bash
# 重新初始化
git submodule deinit -f obsidian-notes
git submodule update --init --recursive
```

#### 2. 转换失败
检查：
- Obsidian 目录是否存在
- Markdown 文件是否有正确 frontmatter
- 环境变量 `OBSIDIAN_NOTES_PATH` 是否设置

#### 3. 网站不显示笔记
检查：
- 构建日志是否有错误
- `content/notes/` 目录是否有 `.mdx` 文件
- 笔记 frontmatter 是否符合要求

## 从 Notion 迁移

### 迁移步骤
1. 导出 Notion 笔记为 Markdown
2. 添加到 Obsidian 仓库
3. 添加必要的 frontmatter
4. 运行转换脚本
5. 测试显示效果

### 清理 Notion 依赖
迁移完成后，可以：
1. 移除 `NOTION_TOKEN` 和 `NOTION_DATABASE_ID` 环境变量
2. 删除 Notion 同步相关代码（可选保留回退逻辑）

## 优势

1. **即时编辑**：在 Obsidian 中编辑，网站自动更新
2. **完全控制**：不依赖第三方 API
3. **离线可用**：本地文件，无需网络
4. **版本控制**：Git 管理所有变更
5. **性能卓越**：静态文件，加载瞬间

## 下一步
1. 设置 Git 子模块
2. 配置环境变量
3. 运行首次转换
4. 部署测试
5. 设置自动化工作流
---
title: "你好世界"
date: "2026-05-23"
tags: ["独立开发", "博客"]
coverImage: ""
description: "这是第一篇通过 Markdown 文件发布的文章，演示了基本的 Markdown 语法、图片嵌入和视频嵌入功能。"
lang: zh
---

## 开始写作

这是一篇示例文章，展示了 Markdown 驱动的内容发布系统的基本功能。

只需将 `.md` 文件放入 `content/posts/` 目录，配置好 Frontmatter，文章就会自动上线。

## Markdown 基础语法

### 文本格式

- **粗体文本** 使用双星号
- *斜体文本* 使用单星号
- ~~删除线~~ 使用双波浪号
- `行内代码` 使用反引号

### 列表

1. 第一项
2. 第二项
3. 第三项

### 引用

> 代码是写给人看的，附带能在机器上运行。
> — Harold Abelson

### 代码块

```javascript
function greet(name) {
    return `你好，${name}！`;
}
```

## 插入图片

在 Markdown 中使用标准图片语法即可插入图片：

![示例图片描述](/images/posts/example.jpg)

## 嵌入视频

### B站视频

直接使用 HTML 的 `<iframe>` 标签嵌入 B站视频：

<iframe src="//player.bilibili.com/player.html?bvid=BV1xx411c7mD&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"></iframe>

### YouTube 视频

同样支持 YouTube 视频嵌入：

<iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## 总结

这个系统的优势在于：

1. **零配置发布** — 推入 `.md` 文件即上线
2. **内容与代码分离** — 文章独立于代码库
3. **富媒体支持** — 图片、视频、代码块一应俱全
4. **标签筛选** — 通过 Frontmatter 中的 `tags` 字段实现前端筛选

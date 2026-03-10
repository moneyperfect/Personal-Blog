# 当前架构总览

## 内容来源

- 笔记：`Supabase posts`
- 产品：`Supabase products` 优先，`content/products` 兜底
- 资源：`content/library`
- Playbooks：`content/playbooks`
- Cases：`content/cases`

## 后台

- 认证：密码登录 + 签名 session cookie
- 内容管理：Supabase
- 资源上传：Supabase Storage

## 对外购买流程

### 当前线上版本

- 产品详情页点击按钮
- 跳转到联系站长的引导页
- 用户通过微信 / QQ / 邮箱说明需求
- 站长再继续确认后续安排

### 二期预留

- 官方微信支付
- 官方支付宝支付
- 订单状态同步
- 自动交付

默认情况下，官方支付代码保留但关闭，只有设置 `ENABLE_OFFICIAL_PAYMENTS=true` 才应启用。

## 已退场的旧方案

- Obsidian 子模块同步
- Notion 定时同步
- GitHub API 内容发布

这些方案不再属于当前主链路。

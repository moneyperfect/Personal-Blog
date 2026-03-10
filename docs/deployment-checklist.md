# 部署检查清单

## 1. 环境变量

必填：

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`

可选：

- `NEXT_PUBLIC_GA_ID`
- `NEXT_PUBLIC_FORM_ENDPOINT`
- `NEXT_PUBLIC_ADSENSE_CLIENT`
- `NEXT_PUBLIC_ENABLE_ADSENSE`

二期官方支付预留：

- `ENABLE_OFFICIAL_PAYMENTS=true`
- 微信支付配置
- 支付宝配置

## 2. 数据库

- 确认 `posts` 表可读写
- 确认 `products` 表可读写
- 确认 `analytics_events` 表存在
- 如果启用官方支付，再确认 `product_orders` 表可用

## 3. 存储

- 确认 Supabase Storage 可访问
- 确认 `blog-assets` bucket 可上传

## 4. 页面检查

- `/admin` 可登录
- `/admin/dashboard` 正常打开
- `/admin/products` 可查看列表
- `/{locale}/products/{slug}` 可正常展示
- 点击购买会跳转到联系引导页
- `/contact` 页面可展示联系信息

## 5. 当前版本重点

- 当前对外流程是不公开站内支付，先引导用户联系站长
- 官方支付代码仍保留，但默认不启用
- 当前笔记主链路来自 Supabase，不依赖 Obsidian / Notion 同步
- 当前文档以本清单和 `current-architecture.md` 为准

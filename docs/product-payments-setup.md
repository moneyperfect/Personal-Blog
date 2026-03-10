# 产品后台与购买流程说明

本文档对应当前线上可用方案：

- 后台产品管理：`/admin/products`
- 当前对外流程：产品详情页点击后，进入联系站长引导页
- 当前沟通方式：微信、QQ、邮箱
- 二期支付预留：官方微信 / 支付宝直连逻辑已保留，但默认关闭

## 当前阶段

由于网站当前未备案，且暂时没有真实客户与支付需求，当前版本不公开站内支付入口。

现在的购买链路是：

1. 用户在产品详情页点击购买
2. 页面跳转到联系站长的引导页
3. 用户通过微信、QQ 或邮箱说明需求
4. 你再继续确认后续安排

这套方案的目标是先规避支付风险，并让购买咨询回到社交沟通。

## 功能路径

- 后台产品列表：`/admin/products`
- 新建产品：`/admin/products/editor`
- 编辑产品：`/admin/products/editor/[slug]?lang=zh`
- 前台产品详情：`/[locale]/products/[slug]`
- 联系引导页：`/[locale]/products/[slug]/checkout`
- 通用联系页：`/[locale]/contact`

说明：

- 主购买入口现在是产品详情页的跳转按钮
- `checkout` 页面保留为产品相关的联系引导页
- 联系页用于统一展示站长联系方式与沟通方式

## 数据库迁移

当前版本的产品后台仍依赖这些 Supabase 表：

- `products`
- `product_orders`

迁移文件：

- `supabase/migrations/20260309_add_products_and_orders.sql`

如果你还没有把这份迁移应用到 Supabase，后台产品管理和健康检查会提示 schema 异常，这是预期表现。

## 必填环境变量

最少需要以下变量：

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_PASSWORD=
ADMIN_SESSION_SECRET=
```

## 当前预留字段

后台产品编辑器里仍保留这些字段：

- `paymentMethods`
- `fulfillmentUrl`

当前阶段它们不会在前台触发真实支付，而是继续作为二期正式交易链路的预留配置。

## 下一阶段

后续如果备案完成、真实支付需求稳定，再推进：

1. 微信商户 / 支付宝商户配置
2. 官方支付回调
3. 自动订单状态更新
4. 自动交付或签名下载链接
5. 更完整的支付状态页

## 上线前检查

- 确认后台可以登录
- 确认 `/admin/products` 可以创建并发布产品
- 确认产品详情页点击后会进入联系引导页
- 确认 `/contact` 页面联系方式可用
- 确认你自己的微信、QQ、邮箱信息无误

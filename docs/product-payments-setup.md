# 产品后台与支付配置说明

本文档对应本项目新增的两项能力：

- 后台产品管理：`/admin/products`
- 站内支付：微信支付、支付宝扫码结账

## 1. 先应用数据库迁移

本次功能依赖新的 Supabase 表结构：

- `products`
- `product_orders`

迁移文件：

- `supabase/migrations/20260309_add_products_and_orders.sql`

如果你的本地环境已经链接了 Supabase 项目，可以执行：

```bash
npx supabase db push
```

如果还没有执行 `supabase link`，也可以直接把迁移 SQL 复制到 Supabase SQL Editor 中执行。

## 2. 必填环境变量

最少需要以下变量：

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_PASSWORD=
ADMIN_SESSION_SECRET=
```

支付功能需要额外配置：

### 微信支付

```env
WECHAT_PAY_APP_ID=
WECHAT_PAY_MCH_ID=
WECHAT_PAY_CERT_SERIAL_NO=
WECHAT_PAY_PRIVATE_KEY=
WECHAT_PAY_API_V3_KEY=
WECHAT_PAY_PLATFORM_CERT=
WECHAT_PAY_NOTIFY_URL=
```

### 支付宝

```env
ALIPAY_APP_ID=
ALIPAY_PRIVATE_KEY=
ALIPAY_PUBLIC_KEY=
ALIPAY_GATEWAY_URL=https://openapi.alipay.com/gateway.do
ALIPAY_NOTIFY_URL=
```

## 3. 功能路径

- 后台产品列表：`/admin/products`
- 新建产品：`/admin/products/editor`
- 编辑产品：`/admin/products/editor/[slug]?lang=zh`
- 用户购买页：`/[locale]/products/[slug]/checkout`

## 4. 当前交付方式

后台产品编辑器目前使用 `fulfillmentUrl` 作为支付成功后的交付链接。

适合填写：

- 网盘下载链接
- 第三方数字交付链接
- 私有文件签名链接中转页
- 课程或社群邀请页

如果后续你希望改成“后台直接上传交付文件并自动生成签名下载链接”，可以在现有架构上继续扩展。

## 5. 上线前检查

- 确认 `products` 和 `product_orders` 已创建
- 确认 `ADMIN_SESSION_SECRET` 已设置
- 确认微信和支付宝回调地址已指向线上域名
- 确认后台可以新建并发布产品
- 确认前台产品详情页点击后进入站内结账页
- 确认扫码支付成功后，订单能变为 `paid`

## 6. 健康检查说明

后台 `Dashboard` 的健康检查现在会额外检查：

- `products` 表
- `product_orders` 表

如果这两个表还没迁移，后台会提示 schema 异常，这是预期表现。

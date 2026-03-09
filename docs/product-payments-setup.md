# 产品后台与支付配置说明

本文档对应当前线上可用方案：

- 后台产品管理：`/admin/products`
- 临时支付方案：产品详情页弹出微信 / 支付宝收款码
- 当前交付方式：人工确认付款后手动处理

## 当前阶段

由于暂时不具备微信商户申请资格，本阶段不依赖官方商户直连。

现在的支付链路是：

1. 用户在产品详情页点击付款
2. 页面弹出收款码窗口
3. 用户使用微信或支付宝扫码
4. 用户保留付款截图
5. 通过联系页与你确认
6. 你手动交付产品

这套方案的目标是先跑通业务，而不是先把自动化支付做满。

## 收款码资源

当前项目已接入以下图片，并复制到前端静态资源目录：

- 微信：`public/payments/wechat-qr.jpg`
- 支付宝：`public/payments/alipay-qr.jpg`

原始来源：

- `E:\个人博客\微信二维码收款码.jpg`
- `E:\个人博客\支付宝二维码收款码.jpg`

## 功能路径

- 后台产品列表：`/admin/products`
- 新建产品：`/admin/products/editor`
- 编辑产品：`/admin/products/editor/[slug]?lang=zh`
- 前台产品详情：`/[locale]/products/[slug]`
- 兜底支付页：`/[locale]/products/[slug]/checkout`

说明：

- 主要支付入口现在是产品详情页里的弹窗
- `checkout` 页面保留为兜底路径，直接访问时也会显示同一套手动收款内容

## 数据库迁移

当前版本的产品后台仍然依赖新的 Supabase 表：

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

## 当前交付字段

后台产品编辑器里保留了 `fulfillmentUrl` 字段。

当前阶段它更适合填写：

- 手动交付说明页
- 网盘链接
- 第三方交付入口
- 付款后发送给用户的目标地址

它暂时不会自动发放，只是为下一阶段自动交付预留。

## 下一阶段

后续如果客户量增长，再推进：

1. 微信商户 / 支付宝商户配置
2. 官方支付回调
3. 自动订单状态更新
4. 自动交付或签名下载链接
5. 更完整的支付状态页

## 上线前检查

- 确认后台可以登录
- 确认 `/admin/products` 可以创建并发布产品
- 确认产品详情页点击后会弹出收款码窗口
- 确认联系页或其他人工沟通渠道可用
- 确认你自己的收款码图片与账号一致

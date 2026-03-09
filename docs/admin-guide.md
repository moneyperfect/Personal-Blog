# 后台管理说明

## 登录要求

必须配置：

```env
ADMIN_PASSWORD=
ADMIN_SESSION_SECRET=
```

建议不要让 `ADMIN_SESSION_SECRET` 与 `ADMIN_PASSWORD` 相同。

## 后台入口

- 登录页：`/admin`
- 内容控制台：`/admin/dashboard`
- 笔记编辑器：`/admin/editor`
- 产品管理：`/admin/products`
- 产品编辑器：`/admin/products/editor`

## 当前后台职责

- 管理 Supabase 中的笔记
- 管理 Supabase 中的产品
- 上传站点资源到 Supabase Storage
- 查看基础健康检查和分析数据

## 当前支付状态

- 线上版本默认是手动收款码
- 产品详情页点击付款后弹出微信 / 支付宝收款码
- 后台里的支付方式与交付链接字段继续保留，作为二期官方支付与自动交付的预留配置

## 日常操作建议

1. 新建或编辑产品后，先确认产品已发布。
2. 检查产品详情页是否能正常弹出收款码。
3. 如果用户已付款，按付款截图手动确认并完成交付。
4. 定期查看 `/admin/dashboard` 的健康状态。

## 当前不再使用的旧链路

以下方案已从主链路退场：

- Obsidian 子模块同步
- Notion 定时同步
- GitHub API 内容发布

如果后续文档或历史提交还提到这些路径，以当前说明为准。

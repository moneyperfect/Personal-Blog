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

## 当前购买状态

- 线上版本默认不公开支付入口
- 产品详情页点击按钮后，会跳转到联系站长的引导页
- 后台里的支付方式与交付链接字段继续保留，作为二期官方支付与自动交付的预留配置

## 日常操作建议

1. 新建或编辑产品后，先确认产品已发布。
2. 检查产品详情页按钮是否正常跳转到联系引导页。
3. 如果用户来咨询购买，再通过微信、QQ 或邮箱继续沟通。
4. 定期查看 `/admin/dashboard` 的健康状态。

## 当前不再使用的旧链路

- Obsidian 子模块同步
- Notion 定时同步
- GitHub API 内容发布

如果后续文档或历史提交还提到这些路径，以当前说明为准。

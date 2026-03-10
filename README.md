# Personal Site

当前版本是一个基于 `Next.js + Supabase + MDX` 的个人博客与数字产品站点。

## 当前架构

- 笔记内容：`Supabase posts`
- 产品内容：`Supabase products` 优先，`content/products` 作为兜底
- 资源 / Playbooks / Cases：本地 `content/*` 下的 MDX
- 后台管理：`/admin`
- 当前对外流程：产品页点击购买后，跳转到联系站长的引导页
- 二期支付预留：官方微信 / 支付宝直连逻辑仍保留，但默认关闭

详细说明见 [docs/current-architecture.md](./docs/current-architecture.md)。

## 开发命令

```bash
npm install
npm run dev
npm run lint
npm run build
```

## 必填环境变量

```env
NEXT_PUBLIC_SITE_URL=https://yourdomain.com

NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

ADMIN_PASSWORD=your-admin-password
ADMIN_SESSION_SECRET=your-strong-session-secret
```

## 可选环境变量

```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_FORM_ENDPOINT=https://formspree.io/f/xxxxx
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX
NEXT_PUBLIC_ENABLE_ADSENSE=false
```

## 二期官方支付预留

当前线上版本默认不公开支付入口。如果未来恢复官方直连支付，再补齐以下变量并开启：

```env
ENABLE_OFFICIAL_PAYMENTS=true

WECHAT_PAY_APP_ID=
WECHAT_PAY_MCH_ID=
WECHAT_PAY_CERT_SERIAL_NO=
WECHAT_PAY_PRIVATE_KEY=
WECHAT_PAY_API_V3_KEY=
WECHAT_PAY_PLATFORM_CERT=
WECHAT_PAY_NOTIFY_URL=

ALIPAY_APP_ID=
ALIPAY_PRIVATE_KEY=
ALIPAY_PUBLIC_KEY=
ALIPAY_GATEWAY_URL=https://openapi.alipay.com/gateway.do
ALIPAY_NOTIFY_URL=
```

## 部署说明

- 先应用 Supabase migration
- 再配置环境变量
- 确认 `/admin/products`、`/admin/dashboard`、`/[locale]/products/[slug]` 可正常访问
- 当前前台购买路径以“联系站长引导页”为准

## 项目文档

- [docs/current-architecture.md](./docs/current-architecture.md)
- [docs/admin-guide.md](./docs/admin-guide.md)
- [docs/deployment-checklist.md](./docs/deployment-checklist.md)
- [docs/product-payments-setup.md](./docs/product-payments-setup.md)

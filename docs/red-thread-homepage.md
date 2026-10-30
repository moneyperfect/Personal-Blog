# 红绳挂件首页

`/zh` 和 `/ja` 的首页由 `src/middleware.ts` 同源重写至 `public/experience/{locale}.html`。页面独立加载原生 WebGL 场景，不使用 iframe；其他 Next.js 页面和 API 保持原有路由。

首页设计源位于 `E:\博客重做\sites\red-thread`，本次对应源提交 `735bd9699b136dd94e96cbe7a8289dcaac892e2c`。修改首页后：

1. 在设计源目录运行 `npm run build`，保持 Vite `base: '/'`。
2. 在本项目运行 `node scripts/sync-red-thread-home.mjs`。
3. 运行 `npm run build`，检查首页三维加载、真实导航及文章页返回。

同步脚本复制模型、织带纹理和构建资源，生成中日文首页、真实导航及 canonical/hreflang。`public/experience/asset-manifest.json` 记录同步资源。不要在生成 HTML 中单独修改设计；应修改设计源再同步。

2026-10-31：加入完整启动预览、并行下载、无损 Brotli 传输和内容哈希缓存。部署必须保留 `next.config.ts` 对 `/assets/runtime/models/` 的编码响应头。测试数据和维护说明见 `homepage-startup-performance.md`。

本次仅替换首屏主副文案为同色浅浮雕曲线。九个 GLB、绳索、材质、灯光及重力碰撞保持不变。桌面和手机均无控制按钮；WebGL 不可用时保留静态预览及导航。

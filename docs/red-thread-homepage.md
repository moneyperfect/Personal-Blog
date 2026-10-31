# 红绳挂件首页

`/zh` 和 `/ja` 的首页由 `src/middleware.ts` 同源重写至 `public/experience/{locale}.html`。页面独立加载原生 WebGL 场景，不使用 iframe；其他 Next.js 页面和 API 保持原有路由。

首页设计源位于 `E:\博客重做\sites\red-thread`，本次对应源提交 `ebabc6b971bfb19802d2e1640884ef3ae0c32476`。修改首页后：

1. 在设计源目录运行 `npm run build`，保持 Vite `base: '/'`。
2. 在本项目运行 `node scripts/sync-red-thread-home.mjs`。
3. 运行 `npm run build`，检查首页三维加载、真实导航及文章页返回。

同步脚本复制模型、织带纹理和构建资源，生成中日文首页、真实导航及 canonical/hreflang。`public/experience/asset-manifest.json` 记录同步资源。不要在生成 HTML 中单独修改设计；应修改设计源再同步。

2026-10-31：加入完整启动预览、并行下载、无损 Brotli 传输和内容哈希缓存。部署必须保留 `next.config.ts` 对 `/assets/runtime/models/` 的编码响应头。测试数据和维护说明见 `homepage-startup-performance.md`。

2026-11-01：手机改为 S 形织带、三排九款挂件和 40px 触摸导航；桌面保留斜向构图。红绳缓存不变计算，挂环仅上传活跃顶点，命中检测复用物理轮廓，普通屏幕使用真实像素密度。九个 GLB、材质、灯光与重力碰撞精度保留。预览图同步手机新构图。验证与限制见 `homepage-mobile-motion-performance.md`。

首屏不显示主副文案；浅浮雕曲线作纸面装饰。桌面和手机均无控制按钮；WebGL 不可用时保留静态预览及导航。

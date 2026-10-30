# 红绳挂件首页

`/zh` 和 `/ja` 的首页由 `src/middleware.ts` 同源重写至 `public/experience/{locale}.html`。页面独立加载原生 WebGL 场景，不使用 iframe；其他 Next.js 页面和 API 保持原有路由。

首页设计源位于 `E:\博客重做\sites\red-thread`，本次对应源提交 `a44782c0e1e190c4e284b6624842c89f4c0a1ee4`。修改首页后：

1. 在设计源目录运行 `npm run build`，保持 Vite `base: '/'`。
2. 在本项目运行 `node scripts/sync-red-thread-home.mjs`。
3. 运行 `npm run build`，检查首页三维加载、真实导航及文章页返回。

同步脚本复制模型、织带纹理和构建资源，生成中日文首页、真实导航及 canonical/hreflang。`public/experience/asset-manifest.json` 记录同步资源。不要在生成 HTML 中单独修改设计；应修改设计源再同步。

本次仅替换首屏主副文案为同色浅浮雕曲线。九个 GLB、绳索、材质、灯光及重力碰撞保持不变。桌面和手机均无控制按钮；WebGL 不可用时保留静态预览及导航。

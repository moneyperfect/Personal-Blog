module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[project]/src/lib/admin-auth.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getAdminAuthStatus",
    ()=>getAdminAuthStatus,
    "protectAdminRoute",
    ()=>protectAdminRoute,
    "verifyAdminAuth",
    ()=>verifyAdminAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/api/navigation.react-server.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-route] (ecmascript)");
;
;
async function verifyAdminAuth() {
    try {
        const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
        const token = cookieStore.get('admin_token')?.value;
        if (!token) {
            return false;
        }
        // 简单的令牌验证（在生产环境中应使用更安全的方法）
        const decoded = Buffer.from(token, 'base64').toString('utf-8');
        const [username, timestamp] = decoded.split(':');
        if (username !== 'admin') {
            return false;
        }
        // 检查令牌是否过期（24小时）
        const tokenTime = parseInt(timestamp, 10);
        const now = Date.now();
        const maxAge = 24 * 60 * 60 * 1000; // 24小时
        if (now - tokenTime > maxAge) {
            return false;
        }
        return true;
    } catch  {
        return false;
    }
}
async function protectAdminRoute() {
    const isAuthenticated = await verifyAdminAuth();
    if (!isAuthenticated) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["redirect"])('/admin');
    }
}
function getAdminAuthStatus() {
    // 注意：这是一个客户端函数，不能使用 cookies()
    // 实际实现应该在客户端检查 localStorage 或 cookie
    // 这里返回 false，实际状态由组件自己管理
    return false;
}
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[project]/src/lib/notes-utils.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "batchUpdateNotesMetadata",
    ()=>batchUpdateNotesMetadata,
    "getAllNotesMetadata",
    ()=>getAllNotesMetadata,
    "getNotesStats",
    ()=>getNotesStats,
    "updateNoteMetadata",
    ()=>updateNoteMetadata
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gray$2d$matter$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/gray-matter/index.js [app-route] (ecmascript)");
;
;
;
// 笔记元数据存储文件路径
const NOTES_METADATA_PATH = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'content', 'notes-metadata.json');
async function getAllNotesMetadata() {
    try {
        // 读取笔记元数据文件（如果存在）
        let metadataMap = {};
        if (__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(NOTES_METADATA_PATH)) {
            const metadataContent = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readFileSync(NOTES_METADATA_PATH, 'utf8');
            metadataMap = JSON.parse(metadataContent);
        }
        const notesDir = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'content', 'notes');
        const files = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readdirSync(notesDir).filter((file)=>file.endsWith('.mdx'));
        const notes = [];
        for (const file of files){
            try {
                const filePath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(notesDir, file);
                const fileContent = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readFileSync(filePath, 'utf8');
                const { data: frontmatter } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gray$2d$matter$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(fileContent);
                // 从文件名提取slug和语言
                const match = file.match(/^(.+)\.(zh|ja)\.mdx$/);
                const slug = match ? match[1] : file.replace('.mdx', '');
                const language = match ? match[2] : 'zh';
                // 获取该笔记的元数据（如果存在）
                const noteMetadata = metadataMap[slug] || {};
                notes.push({
                    id: slug,
                    title: frontmatter.title || slug,
                    slug,
                    category: frontmatter.category || '',
                    type: frontmatter.type || 'note',
                    language,
                    date: frontmatter.updatedAt || new Date().toISOString().split('T')[0],
                    enabled: noteMetadata.enabled !== undefined ? noteMetadata.enabled : true,
                    source: 'obsidian',
                    tags: frontmatter.tags || [],
                    summary: frontmatter.summary || '',
                    updatedAt: frontmatter.updatedAt
                });
            } catch (error) {
                console.error(`解析笔记文件 ${file} 失败:`, error);
            }
        }
        // 按日期倒序排序
        return notes.sort((a, b)=>new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch (error) {
        console.error('获取笔记元数据失败:', error);
        return [];
    }
}
async function updateNoteMetadata(slug, updates) {
    try {
        // 读取现有的元数据
        let metadataMap = {};
        if (__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(NOTES_METADATA_PATH)) {
            const metadataContent = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readFileSync(NOTES_METADATA_PATH, 'utf8');
            metadataMap = JSON.parse(metadataContent);
        }
        // 更新指定笔记的元数据
        metadataMap[slug] = {
            ...metadataMap[slug],
            ...updates
        };
        // 写回文件
        __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].writeFileSync(NOTES_METADATA_PATH, JSON.stringify(metadataMap, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error('更新笔记元数据失败:', error);
        return false;
    }
}
async function batchUpdateNotesMetadata(updates) {
    try {
        // 读取现有的元数据
        let metadataMap = {};
        if (__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(NOTES_METADATA_PATH)) {
            const metadataContent = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readFileSync(NOTES_METADATA_PATH, 'utf8');
            metadataMap = JSON.parse(metadataContent);
        }
        // 批量更新
        for (const [slug, update] of Object.entries(updates)){
            metadataMap[slug] = {
                ...metadataMap[slug],
                ...update
            };
        }
        // 写回文件
        __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].writeFileSync(NOTES_METADATA_PATH, JSON.stringify(metadataMap, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error('批量更新笔记元数据失败:', error);
        return false;
    }
}
async function getNotesStats() {
    const notes = await getAllNotesMetadata();
    // 计算类别分布
    const categoryCount = {};
    notes.forEach((note)=>{
        const category = note.category || '未分类';
        categoryCount[category] = (categoryCount[category] || 0) + 1;
    });
    // 找出最常见的类别
    let topCategory = '未分类';
    let maxCount = 0;
    for (const [category, count] of Object.entries(categoryCount)){
        if (count > maxCount) {
            maxCount = count;
            topCategory = category;
        }
    }
    const publishedNotes = notes.filter((note)=>note.enabled).length;
    const draftNotes = notes.filter((note)=>!note.enabled).length;
    // 模拟视图数据（实际应该从Google Analytics获取）
    const totalViews = notes.length * 100; // 简单模拟
    const viewsGrowth = 12.5; // 模拟增长率
    return {
        totalNotes: notes.length,
        publishedNotes,
        draftNotes,
        totalViews,
        viewsGrowth,
        topCategory: topCategory === '' ? '未分类' : topCategory
    };
}
}),
"[project]/src/app/api/admin/notes/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$admin$2d$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/admin-auth.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$notes$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/notes-utils.ts [app-route] (ecmascript)");
;
;
;
async function GET(request) {
    try {
        // 验证管理员权限
        const isAuthenticated = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$admin$2d$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verifyAdminAuth"])();
        if (!isAuthenticated) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: '未授权访问'
            }, {
                status: 401
            });
        }
        const notes = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$notes$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAllNotesMetadata"])();
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            notes
        });
    } catch (error) {
        console.error('获取笔记列表失败:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: '服务器错误'
        }, {
            status: 500
        });
    }
}
async function POST(request) {
    try {
        // 验证管理员权限
        const isAuthenticated = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$admin$2d$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verifyAdminAuth"])();
        if (!isAuthenticated) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: '未授权访问'
            }, {
                status: 401
            });
        }
        const body = await request.json();
        const { action, slug, updates, batchUpdates } = body;
        if (batchUpdates) {
            // 批量更新
            const success = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$notes$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["batchUpdateNotesMetadata"])(batchUpdates);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success
            });
        }
        if (!slug) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: '缺少笔记slug参数'
            }, {
                status: 400
            });
        }
        let success = false;
        switch(action){
            case 'toggle-enabled':
                // 获取当前笔记状态
                const notes = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$notes$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAllNotesMetadata"])();
                const note = notes.find((n)=>n.slug === slug);
                if (note) {
                    success = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$notes$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["updateNoteMetadata"])(slug, {
                        enabled: !note.enabled
                    });
                }
                break;
            case 'update-category':
                if (!updates?.category) {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                        error: '缺少分类参数'
                    }, {
                        status: 400
                    });
                }
                success = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$notes$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["updateNoteMetadata"])(slug, {
                    category: updates.category
                });
                break;
            case 'update':
                if (!updates) {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                        error: '缺少更新参数'
                    }, {
                        status: 400
                    });
                }
                success = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$notes$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["updateNoteMetadata"])(slug, updates);
                break;
            default:
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: '不支持的操作'
                }, {
                    status: 400
                });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success
        });
    } catch (error) {
        console.error('更新笔记失败:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: '服务器错误'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__8ea8cd68._.js.map
import { copyFile, mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = resolve(projectRoot, process.argv[2] || '../red-thread/dist');
const publicRoot = join(projectRoot, 'public');
const experienceRoot = join(publicRoot, 'experience');
let html = await readFile(join(source, 'index.html'), 'utf8');

if (!html.includes('id="scene-host"') || !html.includes('type="module"')) {
    throw new Error('Expected a built red-thread homepage with its live WebGL module.');
}

const editorialStart = html.indexOf('<div class="editorial-content">');
if (editorialStart !== -1) {
    const mainEnd = html.indexOf('</main>', editorialStart);
    if (mainEnd === -1) throw new Error('Unable to locate the end of the standalone demo content.');
    html = html.slice(0, editorialStart) + html.slice(mainEnd);
}

const copiedFiles = [];
async function copyDirectory(from, to, relative) {
    await mkdir(to, { recursive: true });
    for (const entry of await readdir(from, { withFileTypes: true })) {
        const nextRelative = `${relative}/${entry.name}`;
        if (entry.isDirectory()) {
            await copyDirectory(join(from, entry.name), join(to, entry.name), nextRelative);
        } else if (entry.isFile()) {
            await copyFile(join(from, entry.name), join(to, entry.name));
            copiedFiles.push(nextRelative);
        }
    }
}

// The production baseline has no public/assets directory. The complete Vite
// assets tree keeps the scene's original absolute URLs and GLB loading intact.
await copyDirectory(join(source, 'assets'), join(publicRoot, 'assets'), 'assets');
await mkdir(experienceRoot, { recursive: true });

for (const locale of ['zh', 'ja']) {
    const labels = locale === 'zh'
        ? { blog: '文章', projects: '项目', about: '关于', title: 'Nas — 个人网站', skip: '阅读文章' }
        : { blog: '記事', projects: 'プロジェクト', about: 'プロフィール', title: 'Nas — パーソナルサイト', skip: '記事を読む' };
    let localized = html
        .replace(/<html lang="[^"]*">/, `<html lang="${locale === 'zh' ? 'zh-CN' : 'ja'}">`)
        .replace(/<title>[^<]*<\/title>/, `<title>${labels.title}</title>`)
        .replace('<a href="#notes">文章</a>', `<a href="/${locale}/blog">${labels.blog}</a>`)
        .replace('<a href="#work">项目</a>', `<a href="/${locale}/projects">${labels.projects}</a>`)
        .replace('<a href="#about">关于</a>', `<a href="/${locale}/about">${labels.about}</a>`)
        .replace(/<a class="skip-link" href="#notes">[^<]*<\/a>/, `<a class="skip-link" href="/${locale}/blog">${labels.skip}</a>`)
        .replaceAll('href="#home"', `href="/${locale}"`)
        .replaceAll("'./assets/", "'/assets/");
    if (locale === 'ja') {
        localized = localized
            .replaceAll('nasbuild.dev 首页', 'nasbuild.dev ホーム')
            .replace('aria-label="主导航"', 'aria-label="メインナビゲーション"')
            .replace('Nas 的个人网站', 'Nas のパーソナルサイト')
            .replace('红色织带上的九款三维挂件，可用鼠标或手指轻拨、拖动。', '赤いストラップに吊るされた九つの立体チャーム。マウスや指で動かせます。')
            .replace('红色织带与九款金色挂件组成的个人收藏', '赤いストラップと九つの金色チャームのパーソナルコレクション')
            .replace('正在加载三维挂件。', '立体チャームを読み込んでいます。');
    }
    localized = localized.replace('</head>', [
        `    <link rel="canonical" href="https://nasbuild.dev/${locale}" />`,
        '    <link rel="alternate" hreflang="zh" href="https://nasbuild.dev/zh" />',
        '    <link rel="alternate" hreflang="ja" href="https://nasbuild.dev/ja" />',
        '    <script defer src="/api/home-analytics"></script>',
        '  </head>',
    ].join('\n'));
    await writeFile(join(experienceRoot, `${locale}.html`), localized);
}

await writeFile(join(experienceRoot, 'asset-manifest.json'), `${JSON.stringify({
    source: 'sites/red-thread',
    files: copiedFiles.sort(),
}, null, 2)}\n`);
console.log(`Synced the live homepage and ${copiedFiles.length} assets for /zh and /ja.`);

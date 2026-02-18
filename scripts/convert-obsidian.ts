import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 配置
const OBSIDIAN_PATH = process.env.OBSIDIAN_NOTES_PATH || '../obsidian-notes'; // 相对路径或绝对路径
const OUTPUT_PATH = path.join(__dirname, '..', 'content', 'notes');

// 支持的分类（与网站 CategoryType 保持一致）
const VALID_CATEGORIES = ['template', 'checklist', 'sop', 'prompt', 'note', ''];

interface ObsidianFrontmatter {
  title?: string;
  summary?: string;
  description?: string;
  tags?: string[] | string;
  date?: string;
  updated?: string;
  updatedAt?: string;
  language?: string;
  lang?: string;
  category?: string;
  type?: string;
  slug?: string;
}

function normalizeLanguage(lang: string | undefined): 'zh' | 'ja' {
  if (!lang) return 'zh';
  const normalized = lang.toLowerCase().trim();
  if (normalized === 'ja' || normalized === 'jp' || normalized === 'japanese') {
    return 'ja';
  }
  return 'zh'; // 默认为中文
}

function normalizeTags(tags: string[] | string | undefined): string[] {
  if (!tags) return [];
  if (typeof tags === 'string') {
    // 处理逗号分隔或空格分隔的标签
    return tags.split(/[,，\s]+/).filter(tag => tag.trim()).map(tag => tag.trim());
  }
  return tags;
}

function generateSlug(filename: string, title?: string): string {
  // 从文件名提取基础名称（去掉扩展名和语言后缀）
  const baseName = filename.replace(/\.(zh|ja)\.md$/, '').replace(/\.md$/, '');

  // 生成slug的辅助函数
  const generateSlugFromText = (text: string): string => {
    // 使用Unicode友好的正则表达式，保留中文等非ASCII字符
    let slug = text
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s-]/gu, '') // 保留Unicode字母、数字、空格、连字符
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // 如果slug为空，使用文件名的哈希值作为后备
    if (!slug) {
      // 简单的哈希函数
      let hash = 0;
      for (let i = 0; i < filename.length; i++) {
        hash = ((hash << 5) - hash) + filename.charCodeAt(i);
        hash = hash & hash;
      }
      slug = 'note-' + Math.abs(hash).toString(36).slice(0, 8);
    }

    return slug;
  };

  // 如果提供了标题，使用标题生成slug
  if (title) {
    return generateSlugFromText(title);
  }

  // 否则使用文件名（已处理扩展名）
  return generateSlugFromText(baseName);
}

function extractLanguageFromFilename(filename: string): 'zh' | 'ja' | null {
  if (filename.endsWith('.zh.md')) return 'zh';
  if (filename.endsWith('.ja.md')) return 'ja';
  if (filename.endsWith('.jp.md')) return 'ja';
  return null;
}

function convertObsidianLinks(content: string, locale: 'zh' | 'ja'): string {
  // 转换 [[内部链接]] 为 [内部链接](/locale/notes/slug)
  let converted = content.replace(/\[\[([^\]]+)\]\]/g, (match, linkText) => {
    // 检查是否包含别名 [[显示文本|实际链接]]
    const parts = linkText.split('|');
    const displayText = parts[0].trim();
    const actualLink = parts[1] ? parts[1].trim() : parts[0].trim();

    // 生成slug（简化处理，实际可能需要更复杂的映射）
    const slug = actualLink
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    return `[${displayText}](/${locale}/notes/${slug})`;
  });

  // 转换 ![[图片.png]] 为 ![](/images/图片.png)
  converted = converted.replace(/!\[\[([^\]]+)\]\]/g, (match, imagePath) => {
    // 提取文件名
    const fileName = path.basename(imagePath);
    return `![](/images/${fileName})`;
  });

  // 移除注释 %%注释%%
  converted = converted.replace(/%%([^%]+)%%/g, '');

  return converted;
}

async function convertObsidianNotes() {
  console.log('开始转换 Obsidian 笔记...');
  console.log(`Obsidian 路径: ${OBSIDIAN_PATH}`);
  console.log(`输出路径: ${OUTPUT_PATH}`);

  // 确保输出目录存在
  if (!fs.existsSync(OUTPUT_PATH)) {
    fs.mkdirSync(OUTPUT_PATH, { recursive: true });
  }

  // 检查 Obsidian 目录是否存在
  let obsidianAbsPath = '';

  // 1. Try environment variable if set
  if (process.env.OBSIDIAN_NOTES_PATH) {
    const envPath = path.isAbsolute(process.env.OBSIDIAN_NOTES_PATH)
      ? process.env.OBSIDIAN_NOTES_PATH
      : path.join(process.cwd(), process.env.OBSIDIAN_NOTES_PATH);

    if (fs.existsSync(envPath)) {
      obsidianAbsPath = envPath;
    } else {
      console.warn(`⚠️  Environment variable OBSIDIAN_NOTES_PATH is set to '${process.env.OBSIDIAN_NOTES_PATH}' but path does not exist: ${envPath}`);
    }
  }

  // 2. Try default submodule location (relative to project root)
  if (!obsidianAbsPath) {
    const localSubmodulePath = path.join(process.cwd(), 'obsidian-notes');
    if (fs.existsSync(localSubmodulePath)) {
      obsidianAbsPath = localSubmodulePath;
      console.log(`ℹ️  Found obsidian-notes at default location: ${localSubmodulePath}`);
    }
  }

  // 3. Try sibling directory (local dev fallback)
  if (!obsidianAbsPath) {
    const siblingPath = path.join(process.cwd(), '../obsidian-notes');
    if (fs.existsSync(siblingPath)) {
      obsidianAbsPath = siblingPath;
      console.log(`ℹ️  Found obsidian-notes at sibling location: ${siblingPath}`);
    }
  }

  if (!obsidianAbsPath || !fs.existsSync(obsidianAbsPath)) {
    console.error(`❌ Obsidian 目录不存在. Tried env var, 'obsidian-notes', and '../obsidian-notes'.`);
    console.log('Current Configured Path:', OBSIDIAN_PATH);
    console.log('Current CWD:', process.cwd());
    process.exit(1);
  } else {
    console.log(`✅ Using Obsidian path: ${obsidianAbsPath}`);
  }

  // 查找所有 Markdown 文件
  const markdownFiles: string[] = [];
  function findMarkdownFiles(dir: string) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        findMarkdownFiles(filePath);
      } else if (file.endsWith('.md')) {
        markdownFiles.push(filePath);
      }
    }
  }

  findMarkdownFiles(obsidianAbsPath);
  console.log(`找到 ${markdownFiles.length} 个 Markdown 文件`);

  // Load ignored notes
  let ignoredNotes: string[] = [];
  const ignoreFilePath = path.join(__dirname, '..', 'config', 'ignored-notes.json');
  if (fs.existsSync(ignoreFilePath)) {
    try {
      ignoredNotes = JSON.parse(fs.readFileSync(ignoreFilePath, 'utf-8'));
      console.log(`ℹ️  Loaded ${ignoredNotes.length} ignored notes.`);
    } catch (e) {
      console.error('Failed to load ignored-notes.json', e);
    }
  }

  let convertedCount = 0;
  let errorCount = 0;

  // Create mapping of slug to source file for duplicate checking
  const slugMap = new Map<string, string>();

  for (const filePath of markdownFiles) {
    try {
      const relativePath = path.relative(obsidianAbsPath, filePath);
      const filename = path.basename(filePath);

      // 从文件名检测语言
      const filenameLanguage = extractLanguageFromFilename(filename);

      // 读取文件内容
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data: frontmatter, content: markdownBody } = matter(fileContent);

      // 解析 frontmatter
      const obsidianMeta = frontmatter as ObsidianFrontmatter;

      // Determine slug preference: frontmatter > filename
      const slugRaw = obsidianMeta.slug ? String(obsidianMeta.slug) : generateSlug(filename, obsidianMeta.title);
      const slug = slugRaw.toLowerCase();

      // Check if ignored
      if (ignoredNotes.includes(slug)) {
        console.log(`⏭️  Skipping ignored note: ${slug}`);
        continue;
      }

      // 确定语言（优先级：文件名 > frontmatter.language > frontmatter.lang > 默认zh）
      const language = filenameLanguage || normalizeLanguage(obsidianMeta.language || obsidianMeta.lang);

      // 生成必要字段
      const title = obsidianMeta.title || filename.replace(/\.(zh|ja|jp)?\.md$/, '');
      const summary = obsidianMeta.summary || obsidianMeta.description || '';
      const tags = normalizeTags(obsidianMeta.tags);
      const date = obsidianMeta.date || obsidianMeta.updated || obsidianMeta.updatedAt || new Date().toISOString().split('T')[0];
      const category = obsidianMeta.category || 'note';
      const type = obsidianMeta.type || 'note';
      // slug already calculated above

      // 验证分类
      let finalCategory = category.toLowerCase();
      if (!VALID_CATEGORIES.includes(finalCategory)) {
        console.warn(`⚠️  ${filename}: 无效分类 "${category}"，使用空值 ""`);
        finalCategory = ''; // 使用空字符串表示未分类
      }

      // 转换 Obsidian 语法
      const convertedContent = convertObsidianLinks(markdownBody, language);

      // 构建新的 frontmatter
      const newFrontmatter: Record<string, unknown> = {
        title,
        summary,
        tags,
        updatedAt: date,
        language,
        category: finalCategory,
        type,
      };

      // 生成输出文件名
      const outputFilename = `${slug}.${language}.mdx`;
      const outputPath = path.join(OUTPUT_PATH, outputFilename);

      // 构建 MDX 内容
      const mdxContent = `---\n${Object.entries(newFrontmatter)
        .map(([key, value]) => {
          if (Array.isArray(value)) {
            return `${key}: ${JSON.stringify(value)}`;
          }
          return `${key}: "${String(value).replace(/"/g, '\\"')}"`;
        })
        .join('\n')}\n---\n\n${convertedContent}`;

      // 写入文件
      fs.writeFileSync(outputPath, mdxContent, 'utf8');
      console.log(`✅ 转换: ${relativePath} → ${outputFilename}`);
      convertedCount++;

    } catch (error) {
      console.error(`❌ 转换失败 ${filePath}:`, error);
      errorCount++;
    }
  }

  // Explicitly remove ignored notes from output
  if (ignoredNotes.length > 0) {
    console.log('\n🧹 Cleaning up ignored notes...');
    const existingFiles = fs.readdirSync(OUTPUT_PATH);
    for (const file of existingFiles) {
      // Check if file starts with an ignored slug followed by dot (to match slug.lang.mdx)
      // We iterate ignoredNotes to be safe
      for (const ignoredSlug of ignoredNotes) {
        if (file.startsWith(`${ignoredSlug}.`) && file.endsWith('.mdx')) {
          const filePath = path.join(OUTPUT_PATH, file);
          console.log(`🗑️  Removing ignored note: ${file}`);
          try {
            fs.unlinkSync(filePath);
          } catch (e) {
            console.error(`Failed to delete ${file}:`, e);
          }
        }
      }
    }
  }

  // 清理不再存在的文件（可选）- 已禁用以防止误删
  // const existingFiles = fs.readdirSync(OUTPUT_PATH).filter(f => f.endsWith('.mdx'));
  // const convertedSlugs = markdownFiles.map(filePath => {
  //   const filename = path.basename(filePath);
  //   const language = extractLanguageFromFilename(filename) || 'zh';
  //   const slug = generateSlug(filename);
  //   return `${slug}.${language}.mdx`;
  // });

  // for (const file of existingFiles) {
  //   if (!convertedSlugs.includes(file)) {
  //     const filePath = path.join(OUTPUT_PATH, file);
  //     console.log(`🗑️  删除旧文件 (跳过): ${file}`);
  //     // fs.unlinkSync(filePath);
  //   }
  // }

  console.log('\n转换完成！');
  console.log(`✅ 成功转换: ${convertedCount}`);
  console.log(`❌ 错误: ${errorCount}`);
  console.log(`📁 输出目录: ${OUTPUT_PATH}`);
}

// 运行转换
convertObsidianNotes().catch(error => {
  console.error('转换失败:', error);
  process.exit(1);
});
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface NoteMetadata {
  id: string;
  title: string;
  slug: string;
  category: string;
  type: string;
  language: string;
  date: string;
  enabled: boolean;
  source: 'obsidian' | 'notion' | 'local';
  tags?: string[];
  summary?: string;
  updatedAt?: string;
}

// 笔记元数据存储文件路径
const NOTES_METADATA_PATH = path.join(process.cwd(), 'content', 'notes-metadata.json');

/**
 * 获取所有笔记的元数据
 */
export async function getAllNotesMetadata(): Promise<NoteMetadata[]> {
  try {
    // 读取笔记元数据文件（如果存在）
    let metadataMap: Record<string, Partial<NoteMetadata>> = {};
    if (fs.existsSync(NOTES_METADATA_PATH)) {
      const metadataContent = fs.readFileSync(NOTES_METADATA_PATH, 'utf8');
      metadataMap = JSON.parse(metadataContent);
    }

    const notesDir = path.join(process.cwd(), 'content', 'notes');
    const files = fs.readdirSync(notesDir).filter(file => file.endsWith('.mdx'));

    const notes: NoteMetadata[] = [];

    for (const file of files) {
      try {
        const filePath = path.join(notesDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const { data: frontmatter } = matter(fileContent);

        // 从文件名提取slug和语言
        const match = file.match(/^(.+)\.(zh|ja)\.mdx$/);
        const slug = match ? match[1] : file.replace('.mdx', '');
        const language = (match ? match[2] : 'zh') as 'zh' | 'ja';

        // 获取该笔记的元数据（如果存在）
        const noteMetadata = metadataMap[slug] || {};
        
        notes.push({
          id: slug,
          title: (frontmatter.title as string) || slug,
          slug,
          category: (frontmatter.category as string) || '',
          type: (frontmatter.type as string) || 'note',
          language,
          date: (frontmatter.updatedAt as string) || new Date().toISOString().split('T')[0],
          enabled: noteMetadata.enabled !== undefined ? noteMetadata.enabled : true, // 默认启用
          source: 'obsidian',
          tags: frontmatter.tags as string[] || [],
          summary: frontmatter.summary as string || '',
          updatedAt: frontmatter.updatedAt as string,
        });
      } catch (error) {
        console.error(`解析笔记文件 ${file} 失败:`, error);
      }
    }

    // 按日期倒序排序
    return notes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('获取笔记元数据失败:', error);
    return [];
  }
}

/**
 * 更新笔记元数据
 */
export async function updateNoteMetadata(
  slug: string,
  updates: Partial<NoteMetadata>
): Promise<boolean> {
  try {
    // 读取现有的元数据
    let metadataMap: Record<string, Partial<NoteMetadata>> = {};
    if (fs.existsSync(NOTES_METADATA_PATH)) {
      const metadataContent = fs.readFileSync(NOTES_METADATA_PATH, 'utf8');
      metadataMap = JSON.parse(metadataContent);
    }

    // 更新指定笔记的元数据
    metadataMap[slug] = {
      ...metadataMap[slug],
      ...updates,
    };

    // 写回文件
    fs.writeFileSync(NOTES_METADATA_PATH, JSON.stringify(metadataMap, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('更新笔记元数据失败:', error);
    return false;
  }
}

/**
 * 批量更新笔记元数据
 */
export async function batchUpdateNotesMetadata(
  updates: Record<string, Partial<NoteMetadata>>
): Promise<boolean> {
  try {
    // 读取现有的元数据
    let metadataMap: Record<string, Partial<NoteMetadata>> = {};
    if (fs.existsSync(NOTES_METADATA_PATH)) {
      const metadataContent = fs.readFileSync(NOTES_METADATA_PATH, 'utf8');
      metadataMap = JSON.parse(metadataContent);
    }

    // 批量更新
    for (const [slug, update] of Object.entries(updates)) {
      metadataMap[slug] = {
        ...metadataMap[slug],
        ...update,
      };
    }

    // 写回文件
    fs.writeFileSync(NOTES_METADATA_PATH, JSON.stringify(metadataMap, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('批量更新笔记元数据失败:', error);
    return false;
  }
}

/**
 * 获取统计数据
 */
export async function getNotesStats(): Promise<{
  totalNotes: number;
  publishedNotes: number;
  draftNotes: number;
  totalViews: number;
  viewsGrowth: number;
  topCategory: string;
}> {
  const notes = await getAllNotesMetadata();
  
  // 计算类别分布
  const categoryCount: Record<string, number> = {};
  notes.forEach(note => {
    const category = note.category || '未分类';
    categoryCount[category] = (categoryCount[category] || 0) + 1;
  });

  // 找出最常见的类别
  let topCategory = '未分类';
  let maxCount = 0;
  for (const [category, count] of Object.entries(categoryCount)) {
    if (count > maxCount) {
      maxCount = count;
      topCategory = category;
    }
  }

  const publishedNotes = notes.filter(note => note.enabled).length;
  const draftNotes = notes.filter(note => !note.enabled).length;

  // 模拟视图数据（实际应该从Google Analytics获取）
  const totalViews = notes.length * 100; // 简单模拟
  const viewsGrowth = 12.5; // 模拟增长率

  return {
    totalNotes: notes.length,
    publishedNotes,
    draftNotes,
    totalViews,
    viewsGrowth,
    topCategory: topCategory === '' ? '未分类' : topCategory,
  };
}
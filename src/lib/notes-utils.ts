import { supabase } from '@/lib/supabase';

export interface NoteMetadata {
  id: string;
  title: string;
  slug: string;
  category: string;
  type: string;
  language: string;
  date: string;
  enabled: boolean;
  lifecycleStatus?: 'draft' | 'review' | 'published';
  source: 'obsidian' | 'supabase'; // Changed from 'notion' | 'local' to reflect new reality
  tags?: string[];
  summary?: string;
  updatedAt?: string;
}

/**
 * 获取所有笔记的元数据
 */
export async function getAllNotesMetadata(): Promise<NoteMetadata[]> {
  try {
    const { data: posts, error } = await supabase
      .from('posts')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('从 Supabase 获取笔记失败:', error);
      return [];
    }

    return posts.map(post => ({
      id: post.slug, // Use slug as ID for compatibility
      title: post.title,
      slug: post.slug,
      category: post.category || '',
      type: 'note',
      language: post.lang || 'zh',
      date: post.date,
      enabled: post.published,
      lifecycleStatus: post.lifecycle_status || (post.published ? 'published' : 'draft'),
      source: 'supabase',
      tags: post.tags || [],
      summary: post.excerpt || '',
      updatedAt: post.updated_at,
    }));
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
    const dbUpdates: any = {};
    // Map frontend 'enabled' to DB 'published'
    if (updates.enabled !== undefined) dbUpdates.published = updates.enabled;
    if (updates.lifecycleStatus !== undefined) {
      dbUpdates.lifecycle_status = updates.lifecycleStatus;
      dbUpdates.published = updates.lifecycleStatus === 'published';
    }
    if (updates.category !== undefined) dbUpdates.category = updates.category;
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.summary !== undefined) dbUpdates.excerpt = updates.summary;
    if (updates.tags !== undefined) dbUpdates.tags = updates.tags;

    dbUpdates.updated_at = new Date().toISOString();

    let { error } = await supabase
      .from('posts')
      .update(dbUpdates)
      .eq('slug', slug);

    if (error) {
      const text = JSON.stringify(error).toLowerCase();
      if (text.includes('lifecycle_status') && Object.prototype.hasOwnProperty.call(dbUpdates, 'lifecycle_status')) {
        // Compatibility fallback: if old schema lacks lifecycle_status, still allow publish/unpublish via published field.
        const retryUpdates = { ...dbUpdates };
        delete retryUpdates.lifecycle_status;

        ({ error } = await supabase
          .from('posts')
          .update(retryUpdates)
          .eq('slug', slug));
      }
    }

    if (error) {
      console.error('更新 Supabase 笔记失败:', error);
      return false;
    }
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
    // Supabase doesn't have a direct "update multiple rows with different values" easily without RPC or loop.
    // For now, loop is acceptable for small batches.
    for (const [slug, update] of Object.entries(updates)) {
      await updateNoteMetadata(slug, update);
    }
    return true;
  } catch (error) {
    console.error('批量更新笔记元数据失败:', error);
    return false;
  }
}

/**
 * 删除笔记
 */
export async function deleteNoteBySlug(slug: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('slug', slug);

    if (error) {
      console.error('删除 Supabase 笔记失败:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('删除笔记失败:', error);
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

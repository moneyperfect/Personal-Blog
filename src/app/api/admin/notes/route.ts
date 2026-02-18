import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/admin-auth';
import {
  getAllNotesMetadata,
  updateNoteMetadata,
  batchUpdateNotesMetadata,
  deleteNoteBySlug,
} from '@/lib/notes-utils';

/**
 * GET: 获取所有笔记
 */
export async function GET() {
  try {
    const isAuthenticated = await verifyAdminAuth();
    if (!isAuthenticated) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 });
    }

    const notes = await getAllNotesMetadata();
    return NextResponse.json({ notes });
  } catch (error) {
    console.error('获取笔记列表失败:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

/**
 * POST: 更新笔记状态/分类/删除
 */
export async function POST(request: NextRequest) {
  try {
    const isAuthenticated = await verifyAdminAuth();
    if (!isAuthenticated) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 });
    }

    const body = await request.json();
    const { action, slug, updates, batchUpdates } = body;

    if (batchUpdates) {
      const success = await batchUpdateNotesMetadata(batchUpdates);
      return NextResponse.json({ success });
    }

    if (!slug) {
      return NextResponse.json({ error: '缺少笔记 slug 参数' }, { status: 400 });
    }

    let success = false;

    switch (action) {
      case 'toggle-enabled': {
        const notes = await getAllNotesMetadata();
        const note = notes.find((n) => n.slug === slug);
        if (note) {
          const nextEnabled = !note.enabled;
          success = await updateNoteMetadata(slug, {
            enabled: nextEnabled,
            lifecycleStatus: nextEnabled ? 'published' : 'draft',
          });
        }
        break;
      }

      case 'update-category': {
        if (!updates?.category) {
          return NextResponse.json({ error: '缺少分类参数' }, { status: 400 });
        }
        success = await updateNoteMetadata(slug, { category: updates.category });
        break;
      }

      case 'update-status': {
        if (!updates?.lifecycleStatus) {
          return NextResponse.json({ error: '缺少状态参数' }, { status: 400 });
        }
        success = await updateNoteMetadata(slug, {
          lifecycleStatus: updates.lifecycleStatus,
          enabled: updates.lifecycleStatus === 'published',
        });
        break;
      }

      case 'update': {
        if (!updates) {
          return NextResponse.json({ error: '缺少更新参数' }, { status: 400 });
        }
        success = await updateNoteMetadata(slug, updates);
        break;
      }

      case 'delete': {
        success = await deleteNoteBySlug(slug);
        break;
      }

      default:
        return NextResponse.json({ error: '不支持的操作' }, { status: 400 });
    }

    return NextResponse.json({ success });
  } catch (error) {
    console.error('更新笔记失败:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/admin-auth';
import { getAllNotesMetadata, updateNoteMetadata, batchUpdateNotesMetadata } from '@/lib/notes-utils';

/**
 * GET: 获取所有笔记
 */
export async function GET(request: NextRequest) {
  try {
    // 验证管理员权限
    const isAuthenticated = await verifyAdminAuth();
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      );
    }

    const notes = await getAllNotesMetadata();
    return NextResponse.json({ notes });
  } catch (error) {
    console.error('获取笔记列表失败:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}

/**
 * POST: 更新笔记状态
 */
export async function POST(request: NextRequest) {
  try {
    // 验证管理员权限
    const isAuthenticated = await verifyAdminAuth();
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action, slug, updates, batchUpdates } = body;

    if (batchUpdates) {
      // 批量更新
      const success = await batchUpdateNotesMetadata(batchUpdates);
      return NextResponse.json({ success });
    }

    if (!slug) {
      return NextResponse.json(
        { error: '缺少笔记slug参数' },
        { status: 400 }
      );
    }

    let success = false;

    switch (action) {
      case 'toggle-enabled':
        // 获取当前笔记状态
        const notes = await getAllNotesMetadata();
        const note = notes.find(n => n.slug === slug);
        if (note) {
          success = await updateNoteMetadata(slug, { enabled: !note.enabled });
        }
        break;

      case 'update-category':
        if (!updates?.category) {
          return NextResponse.json(
            { error: '缺少分类参数' },
            { status: 400 }
          );
        }
        success = await updateNoteMetadata(slug, { category: updates.category });
        break;

      case 'update':
        if (!updates) {
          return NextResponse.json(
            { error: '缺少更新参数' },
            { status: 400 }
          );
        }
        success = await updateNoteMetadata(slug, updates);
        break;

      default:
        return NextResponse.json(
          { error: '不支持的操作' },
          { status: 400 }
        );
    }

    return NextResponse.json({ success });
  } catch (error) {
    console.error('更新笔记失败:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}
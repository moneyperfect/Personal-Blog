import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { verifyAdminAuth } from '@/lib/admin-auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const isAuthenticated = await verifyAdminAuth();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { slug } = await params;
    const htmlPath = path.join(process.cwd(), 'public', 'projects', `${slug}.html`);
    
    if (!fs.existsSync(htmlPath)) {
      return NextResponse.json({ error: 'HTML 详情页不存在' }, { status: 404 });
    }

    const content = fs.readFileSync(htmlPath, 'utf8');
    return NextResponse.json({ content });
  } catch (error) {
    console.error('获取 HTML 内容失败:', error);
    return NextResponse.json({ error: '获取 HTML 内容失败' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const isAuthenticated = await verifyAdminAuth();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { slug } = await params;
    const body = await request.json();
    const { content } = body;

    if (content === undefined) {
      return NextResponse.json({ error: '缺少 content 参数' }, { status: 400 });
    }

    const htmlPath = path.join(process.cwd(), 'public', 'projects', `${slug}.html`);
    
    if (!fs.existsSync(htmlPath)) {
      return NextResponse.json({ error: 'HTML 详情页不存在' }, { status: 404 });
    }

    fs.writeFileSync(htmlPath, content, 'utf8');

    return NextResponse.json({ success: true, slug });
  } catch (error) {
    console.error('更新 HTML 内容失败:', error);
    return NextResponse.json({ error: '更新 HTML 内容失败' }, { status: 500 });
  }
}

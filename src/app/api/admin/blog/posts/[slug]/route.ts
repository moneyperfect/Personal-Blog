import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { verifyAdminAuth } from '@/lib/admin-auth';

const postsDirectory = path.join(process.cwd(), 'content', 'posts');

function getPost(slug: string) {
  const filePath = path.join(postsDirectory, `${slug}.md`);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug,
    frontmatter: {
      title: data.title || '',
      date: data.date || '',
      tags: data.tags || [],
      category: data.category || undefined,
      description: data.description || '',
      lang: data.lang || 'zh',
    },
    content,
  };
}

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
    const post = getPost(slug);

    if (!post) {
      return NextResponse.json({ error: '文章不存在' }, { status: 404 });
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error('获取博客文章失败:', error);
    return NextResponse.json({ error: '获取博客文章失败' }, { status: 500 });
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
    const { frontmatter, content } = body;

    if (!frontmatter || content === undefined) {
      return NextResponse.json({ error: '缺少必要参数' }, { status: 400 });
    }

    const filePath = path.join(postsDirectory, `${slug}.md`);
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: '文章不存在' }, { status: 404 });
    }

    // Build markdown content with frontmatter
    const frontmatterStr = Object.entries(frontmatter)
      .filter(([_, value]) => value !== undefined && value !== '')
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return `${key}: [${value.join(', ')}]`;
        }
        return `${key}: "${value}"`;
      })
      .join('\n');

    const fileContent = `---\n${frontmatterStr}\n---\n\n${content}`;
    fs.writeFileSync(filePath, fileContent, 'utf8');

    return NextResponse.json({ success: true, slug });
  } catch (error) {
    console.error('更新博客文章失败:', error);
    return NextResponse.json({ error: '更新博客文章失败' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const isAuthenticated = await verifyAdminAuth();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { slug } = await params;
    const filePath = path.join(postsDirectory, `${slug}.md`);
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: '文章不存在' }, { status: 404 });
    }

    fs.unlinkSync(filePath);

    return NextResponse.json({ success: true, slug });
  } catch (error) {
    console.error('删除博客文章失败:', error);
    return NextResponse.json({ error: '删除博客文章失败' }, { status: 500 });
  }
}

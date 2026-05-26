import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/admin-auth';
import { supabaseAdmin } from '@/lib/supabase';

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

    const { data, error } = await supabaseAdmin
      .from('posts')
      .select('slug, title, content, excerpt, category, tags, lang, date')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: '文章不存在' }, { status: 404 });
    }

    return NextResponse.json({
      post: {
        slug: data.slug,
        frontmatter: {
          title: data.title || '',
          date: data.date ? new Date(data.date).toISOString().split('T')[0] : '',
          tags: data.tags || [],
          category: data.category || undefined,
          description: data.excerpt || '',
          lang: data.lang || 'zh',
        },
        content: data.content || '',
      },
    });
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

    const { data: existing } = await supabaseAdmin
      .from('posts')
      .select('slug')
      .eq('slug', slug)
      .single();

    if (!existing) {
      return NextResponse.json({ error: '文章不存在' }, { status: 404 });
    }

    const { error } = await supabaseAdmin
      .from('posts')
      .update({
        title: frontmatter.title || '',
        content,
        excerpt: frontmatter.description || '',
        category: frontmatter.category || null,
        tags: frontmatter.tags || [],
        lang: frontmatter.lang || 'zh',
        date: frontmatter.date ? new Date(frontmatter.date).toISOString() : undefined,
        updated_at: new Date().toISOString(),
      })
      .eq('slug', slug);

    if (error) {
      console.error('Supabase update error:', error);
      return NextResponse.json({ error: '更新博客文章失败' }, { status: 500 });
    }

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

    const { data: existing } = await supabaseAdmin
      .from('posts')
      .select('slug')
      .eq('slug', slug)
      .single();

    if (!existing) {
      return NextResponse.json({ error: '文章不存在' }, { status: 404 });
    }

    const { error } = await supabaseAdmin
      .from('posts')
      .delete()
      .eq('slug', slug);

    if (error) {
      console.error('Supabase delete error:', error);
      return NextResponse.json({ error: '删除博客文章失败' }, { status: 500 });
    }

    return NextResponse.json({ success: true, slug });
  } catch (error) {
    console.error('删除博客文章失败:', error);
    return NextResponse.json({ error: '删除博客文章失败' }, { status: 500 });
  }
}

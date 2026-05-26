import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/admin-auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    const isAuthenticated = await verifyAdminAuth();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin
      .from('posts')
      .select('slug, title, content, excerpt, category, tags, lang, date, updated_at, published')
      .order('date', { ascending: false });

    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json({ error: '获取博客列表失败' }, { status: 500 });
    }

    const posts = (data || []).map((row) => ({
      slug: row.slug,
      frontmatter: {
        title: row.title || '',
        date: row.date ? new Date(row.date).toISOString().split('T')[0] : '',
        tags: row.tags || [],
        category: row.category || undefined,
        description: row.excerpt || '',
        lang: row.lang || 'zh',
      },
      content: row.content || '',
      wordCount: (row.content || '').length,
    }));

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('获取博客列表失败:', error);
    return NextResponse.json({ error: '获取博客列表失败' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const isAuthenticated = await verifyAdminAuth();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { slug, frontmatter, content } = body;

    if (!slug || !frontmatter || content === undefined) {
      return NextResponse.json({ error: '缺少必要参数' }, { status: 400 });
    }

    if (!/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json({ error: 'slug 只能包含小写字母、数字和连字符' }, { status: 400 });
    }

    // Check if already exists
    const { data: existing } = await supabaseAdmin
      .from('posts')
      .select('slug')
      .eq('slug', slug)
      .single();

    if (existing) {
      return NextResponse.json({ error: '文章已存在，请使用 PUT 更新' }, { status: 409 });
    }

    const { error } = await supabaseAdmin.from('posts').insert({
      slug,
      title: frontmatter.title || '',
      content,
      excerpt: frontmatter.description || '',
      category: frontmatter.category || null,
      tags: frontmatter.tags || [],
      lang: frontmatter.lang || 'zh',
      date: frontmatter.date ? new Date(frontmatter.date).toISOString() : new Date().toISOString(),
      published: true,
      lifecycle_status: 'published',
    });

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: '创建博客文章失败' }, { status: 500 });
    }

    return NextResponse.json({ success: true, slug });
  } catch (error) {
    console.error('创建博客文章失败:', error);
    return NextResponse.json({ error: '创建博客文章失败' }, { status: 500 });
  }
}

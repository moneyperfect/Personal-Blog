import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/admin-auth';
import { getAdminProducts } from '@/lib/admin-products';
import { hasSupabaseAdminConfig, supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  const isAuthenticated = await verifyAdminAuth();
  if (!isAuthenticated) {
    return NextResponse.json({ error: '未授权访问。' }, { status: 401 });
  }

  const products = await getAdminProducts();
  return NextResponse.json({ products });
}

export async function POST(request: NextRequest) {
  const isAuthenticated = await verifyAdminAuth();
  if (!isAuthenticated) {
    return NextResponse.json({ error: '未授权访问。' }, { status: 401 });
  }

  if (!hasSupabaseAdminConfig) {
    return NextResponse.json({ error: 'Supabase 环境变量未配置完整。' }, { status: 500 });
  }

  const body = await request.json();
  const { action, slug, lang, updates } = body as {
    action?: string;
    slug?: string;
    lang?: string;
    updates?: {
      published?: boolean;
      featured?: boolean;
    };
  };

  if (!slug || !lang) {
    return NextResponse.json({ error: '缺少 slug 或语言参数。' }, { status: 400 });
  }

  if (action === 'delete') {
    const { error, count } = await supabaseAdmin
      .from('products')
      .delete({ count: 'exact' })
      .eq('slug', slug)
      .eq('lang', lang);

    if (error) {
      return NextResponse.json({ error: '删除产品失败。' }, { status: 500 });
    }

    if (!count) {
      return NextResponse.json({ error: '该产品来自静态 MDX，暂不支持在后台直接删除。' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  }

  if (action === 'update-flags') {
    const nextPayload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (typeof updates?.published === 'boolean') {
      nextPayload.published = updates.published;
    }

    if (typeof updates?.featured === 'boolean') {
      nextPayload.featured = updates.featured;
    }

    const { error } = await supabaseAdmin
      .from('products')
      .update(nextPayload)
      .eq('slug', slug)
      .eq('lang', lang);

    if (error) {
      return NextResponse.json({ error: '更新产品状态失败。' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: '不支持的操作。' }, { status: 400 });
}

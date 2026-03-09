import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/admin-auth';
import { hasSupabaseAdminConfig, supabaseAdmin } from '@/lib/supabase';

interface ProductPayload {
  slug: string;
  lang: 'zh' | 'ja';
  title: string;
  summary: string;
  content: string;
  tags: string[];
  priceDisplay: string;
  priceAmount: number;
  currency: string;
  coverImage: string;
  seoTitle: string;
  seoDescription: string;
  paymentMethods: string[];
  fulfillmentUrl: string;
  featured: boolean;
  published: boolean;
}

function normalizePaymentMethods(input: unknown) {
  if (!Array.isArray(input)) {
    return ['wechat', 'alipay'];
  }

  const methods = input
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter((item) => item === 'wechat' || item === 'alipay');

  return methods.length > 0 ? methods : ['wechat', 'alipay'];
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
  const product = body.product as Partial<ProductPayload> | undefined;
  const isNew = Boolean(body.isNew);

  if (!product?.slug || !product.title || !product.lang) {
    return NextResponse.json({ error: '标题、Slug 和语言为必填项。' }, { status: 400 });
  }

  const normalizedSlug = product.slug.trim();
  const normalizedLang = product.lang === 'ja' ? 'ja' : 'zh';

  if (isNew) {
    const { data: existing } = await supabaseAdmin
      .from('products')
      .select('slug')
      .eq('slug', normalizedSlug)
      .eq('lang', normalizedLang)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ error: '该语言版本的产品 Slug 已存在。' }, { status: 409 });
    }
  }

  const payload = {
    slug: normalizedSlug,
    lang: normalizedLang,
    title: product.title.trim(),
    summary: product.summary?.trim() || '',
    content: product.content || '',
    tags: Array.isArray(product.tags)
      ? product.tags.map((tag) => tag.trim()).filter(Boolean)
      : [],
    price_display: product.priceDisplay?.trim() || '',
    price_amount: Math.max(Math.round(product.priceAmount || 0), 0),
    currency: product.currency?.trim() || 'CNY',
    cover_image: product.coverImage?.trim() || null,
    seo_title: product.seoTitle?.trim() || null,
    seo_description: product.seoDescription?.trim() || null,
    payment_methods: normalizePaymentMethods(product.paymentMethods),
    fulfillment_url: product.fulfillmentUrl?.trim() || null,
    featured: Boolean(product.featured),
    published: Boolean(product.published),
    updated_at: new Date().toISOString(),
  };

  const { error, data } = await supabaseAdmin
    .from('products')
    .upsert(payload, { onConflict: 'slug,lang' })
    .select('slug,lang')
    .single();

  if (error) {
    console.error('保存产品失败:', error);
    return NextResponse.json({ error: '保存产品失败。' }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    slug: data.slug,
    lang: data.lang,
  });
}

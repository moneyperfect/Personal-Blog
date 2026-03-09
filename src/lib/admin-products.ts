import { ProductFrontmatter, getAllContent, getContentBySlug } from '@/lib/mdx';
import { ProductItem } from '@/lib/products';
import { hasSupabaseAdminConfig, supabaseAdmin } from '@/lib/supabase';

type Locale = 'zh' | 'ja';
type ProductSource = 'supabase' | 'mdx';

interface ProductRow {
  slug: string;
  lang: string;
  title: string;
  summary: string | null;
  content: string | null;
  tags: string[] | null;
  updated_at: string | null;
  price_display: string;
  price_amount: number;
  currency: string;
  cover_image: string | null;
  seo_title: string | null;
  seo_description: string | null;
  payment_methods: string[] | null;
  fulfillment_url: string | null;
  featured: boolean | null;
  published: boolean;
}

export interface AdminProductSummary {
  slug: string;
  lang: Locale;
  title: string;
  price: string;
  published: boolean;
  updatedAt: string;
  source: ProductSource;
  featured: boolean;
}

export interface ProductEditorRecord {
  slug: string;
  lang: Locale;
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
  source: ProductSource;
}

function normalizeLocale(locale: string): Locale {
  return locale === 'ja' ? 'ja' : 'zh';
}

function mapProductRow(row: ProductRow): ProductItem {
  return {
    slug: row.slug,
    source: 'supabase',
    frontmatter: {
      title: row.title,
      summary: row.summary || '',
      tags: row.tags || [],
      updatedAt: row.updated_at || new Date().toISOString(),
      language: normalizeLocale(row.lang),
      price: row.price_display,
      purchaseUrl: row.fulfillment_url || '',
      priceAmount: row.price_amount,
      currency: row.currency,
      coverImage: row.cover_image || '',
      seoTitle: row.seo_title || '',
      seoDescription: row.seo_description || '',
      paymentMethods: row.payment_methods || ['wechat', 'alipay'],
      fulfillmentUrl: row.fulfillment_url || '',
      featured: Boolean(row.featured),
      published: row.published,
    },
    content: row.content || '',
  };
}

function mapItemToEditorRecord(item: ProductItem): ProductEditorRecord {
  return {
    slug: item.slug,
    lang: normalizeLocale(item.frontmatter.language),
    title: item.frontmatter.title,
    summary: item.frontmatter.summary || '',
    content: item.content || '',
    tags: item.frontmatter.tags || [],
    priceDisplay: item.frontmatter.price || '',
    priceAmount: item.frontmatter.priceAmount || 0,
    currency: item.frontmatter.currency || 'CNY',
    coverImage: item.frontmatter.coverImage || '',
    seoTitle: item.frontmatter.seoTitle || '',
    seoDescription: item.frontmatter.seoDescription || '',
    paymentMethods: item.frontmatter.paymentMethods || ['wechat', 'alipay'],
    fulfillmentUrl: item.frontmatter.fulfillmentUrl || item.frontmatter.purchaseUrl || '',
    featured: Boolean(item.frontmatter.featured),
    published: item.frontmatter.published ?? true,
    source: item.source,
  };
}

function mapFileProduct(locale: Locale, slug: string) {
  const fileProduct = getContentBySlug<ProductFrontmatter>('products', slug, locale);
  if (!fileProduct) {
    return null;
  }

  return {
    ...fileProduct,
    source: 'mdx' as const,
  };
}

export async function getAdminProducts(): Promise<AdminProductSummary[]> {
  const locales: Locale[] = ['zh', 'ja'];
  const summaryMap = new Map<string, AdminProductSummary>();

  for (const locale of locales) {
    const data = hasSupabaseAdminConfig
      ? (
          await supabaseAdmin
            .from('products')
            .select('slug,lang,title,price_display,published,updated_at,featured')
            .eq('lang', locale)
            .order('updated_at', { ascending: false })
        ).data
      : [];

    (data || []).forEach((row) => {
      const key = `${row.slug}:${row.lang}`;
      summaryMap.set(key, {
        slug: row.slug,
        lang: normalizeLocale(row.lang),
        title: row.title,
        price: row.price_display,
        published: row.published,
        updatedAt: row.updated_at || new Date().toISOString(),
        featured: Boolean(row.featured),
        source: 'supabase',
      });
    });

    const fileProducts = getAllContent<ProductFrontmatter>('products', locale);
    fileProducts.forEach((item) => {
      const key = `${item.slug}:${locale}`;
      if (!summaryMap.has(key)) {
        summaryMap.set(key, {
          slug: item.slug,
          lang: locale,
          title: item.frontmatter.title,
          price: item.frontmatter.price,
          published: true,
          updatedAt: item.frontmatter.updatedAt,
          featured: Boolean(item.frontmatter.featured),
          source: 'mdx',
        });
      }
    });
  }

  return Array.from(summaryMap.values()).sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export async function getAdminProductBySlug(slug: string, locale: Locale): Promise<ProductEditorRecord | null> {
  const data = hasSupabaseAdminConfig
    ? (
        await supabaseAdmin
          .from('products')
          .select('*')
          .eq('slug', slug)
          .eq('lang', locale)
          .maybeSingle()
      ).data
    : null;

  if (data) {
    return mapItemToEditorRecord(mapProductRow(data as ProductRow));
  }

  const fileProduct = mapFileProduct(locale, slug);
  if (!fileProduct) {
    return null;
  }

  return mapItemToEditorRecord(fileProduct);
}

export function createEmptyProduct(locale: Locale = 'zh'): ProductEditorRecord {
  return {
    slug: '',
    lang: locale,
    title: '',
    summary: '',
    content: '',
    tags: [],
    priceDisplay: '',
    priceAmount: 0,
    currency: 'CNY',
    coverImage: '',
    seoTitle: '',
    seoDescription: '',
    paymentMethods: ['wechat', 'alipay'],
    fulfillmentUrl: '',
    featured: false,
    published: false,
    source: 'supabase',
  };
}

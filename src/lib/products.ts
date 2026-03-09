import { ContentItem, ProductFrontmatter, getAllContent, getContentBySlug } from '@/lib/mdx';
import { hasSupabasePublicConfig, supabasePublic } from '@/lib/supabase';

type Locale = 'zh' | 'ja';

export type ProductSource = 'supabase' | 'mdx';
export type PaymentMethod = 'wechat' | 'alipay';
export type { ProductFrontmatter };

export interface ProductItem extends ContentItem<ProductFrontmatter> {
  source: ProductSource;
}

export type ProductContentItem = ProductItem;

interface ProductRow {
  slug: string;
  lang: Locale;
  title: string;
  summary: string | null;
  content: string | null;
  tags: string[] | null;
  updated_at: string | null;
  created_at: string | null;
  price_display: string | null;
  price_amount: number;
  currency: string | null;
  cover_image: string | null;
  seo_title: string | null;
  seo_description: string | null;
  payment_methods: PaymentMethod[] | null;
  fulfillment_url: string | null;
  featured: boolean | null;
  published: boolean;
}

const DEFAULT_PAYMENT_METHODS: PaymentMethod[] = ['wechat', 'alipay'];

function sortProducts<T extends ProductItem>(items: T[]) {
  return [...items].sort((left, right) => {
    const featuredDelta = Number(Boolean(right.frontmatter.featured)) - Number(Boolean(left.frontmatter.featured));
    if (featuredDelta !== 0) {
      return featuredDelta;
    }

    return new Date(right.frontmatter.updatedAt).getTime() - new Date(left.frontmatter.updatedAt).getTime();
  });
}

function mapDatabaseProduct(row: ProductRow): ProductItem {
  const currency = (row.currency || 'CNY').toUpperCase();
  const amount = Number.isFinite(row.price_amount) ? row.price_amount : 0;
  const fallbackPrice = currency === 'CNY'
    ? `¥${(amount / 100).toFixed(2).replace(/\.00$/, '')}`
    : `${currency} ${(amount / 100).toFixed(2)}`;

  return {
    slug: row.slug,
    source: 'supabase',
    frontmatter: {
      title: row.title,
      summary: row.summary || '',
      tags: row.tags || [],
      updatedAt: row.updated_at || row.created_at || new Date().toISOString(),
      language: row.lang,
      price: row.price_display || fallbackPrice,
      purchaseUrl: '',
      priceAmount: amount,
      currency,
      coverImage: row.cover_image || '',
      seoTitle: row.seo_title || '',
      seoDescription: row.seo_description || '',
      paymentMethods: row.payment_methods?.length ? row.payment_methods : [...DEFAULT_PAYMENT_METHODS],
      fulfillmentUrl: row.fulfillment_url || '',
      featured: Boolean(row.featured),
      published: row.published,
    },
    content: row.content || '',
  };
}

function mapFileProduct(item: ContentItem<ProductFrontmatter>): ProductItem {
  return {
    ...item,
    source: 'mdx',
  };
}

async function getDatabaseProducts(locale: Locale) {
  if (!hasSupabasePublicConfig) {
    return [] as ProductItem[];
  }

  const { data, error } = await supabasePublic
    .from('products')
    .select('*')
    .eq('lang', locale)
    .eq('published', true)
    .order('featured', { ascending: false })
    .order('updated_at', { ascending: false });

  if (error || !data) {
    console.error('Failed to load database products:', error);
    return [];
  }

  return (data as ProductRow[]).map(mapDatabaseProduct);
}

async function getDatabaseProductBySlug(slug: string, locale: Locale) {
  if (!hasSupabasePublicConfig) {
    return null;
  }

  const { data, error } = await supabasePublic
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('lang', locale)
    .eq('published', true)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return mapDatabaseProduct(data as ProductRow);
}

export async function getAllProducts(locale: Locale): Promise<ProductItem[]> {
  const databaseProducts = await getDatabaseProducts(locale);
  const fileProducts = getAllContent<ProductFrontmatter>('products', locale).map(mapFileProduct);
  const productsBySlug = new Map<string, ProductItem>();

  databaseProducts.forEach((item) => {
    productsBySlug.set(item.slug, item);
  });

  fileProducts.forEach((item) => {
    if (!productsBySlug.has(item.slug)) {
      productsBySlug.set(item.slug, item);
    }
  });

  return sortProducts(Array.from(productsBySlug.values()));
}

export async function getProductBySlug(slug: string, locale: Locale): Promise<ProductItem | null> {
  const databaseProduct = await getDatabaseProductBySlug(slug, locale);
  if (databaseProduct) {
    return databaseProduct;
  }

  const fileProduct = getContentBySlug<ProductFrontmatter>('products', slug, locale);
  return fileProduct ? mapFileProduct(fileProduct) : null;
}

export async function getAllProductSlugs(locale: Locale): Promise<string[]> {
  const databaseProducts = await getDatabaseProducts(locale);
  const fileProducts = getAllContent<ProductFrontmatter>('products', locale);
  const slugSet = new Set<string>();

  databaseProducts.forEach((item) => slugSet.add(item.slug));
  fileProducts.forEach((item) => slugSet.add(item.slug));

  return Array.from(slugSet);
}

export function getAllProductTags(items: ProductItem[]): string[] {
  const tags = new Set<string>();

  items.forEach((item) => {
    item.frontmatter.tags.forEach((tag) => tags.add(tag));
  });

  return Array.from(tags).sort();
}

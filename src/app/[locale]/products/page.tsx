import { setRequestLocale } from 'next-intl/server';
import { getAllProductTags, getAllProducts } from '@/lib/products';
import { Locale } from '@/i18n/routing';
import { ProductsClient } from './ProductsClient';

type Props = {
  params: Promise<{ locale: string }>;
};

export const revalidate = 60;

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;

  return {
    title: locale === 'zh' ? '数字产品' : 'デジタル商品',
    description: locale === 'zh'
      ? '购买可交付的数字产品，支持站内支付与产品详情浏览。'
      : 'デジタル商品の詳細を確認し、サイト内でそのまま購入できます。',
  };
}

export default async function ProductsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const products = await getAllProducts(locale as Locale);
  const allTags = getAllProductTags(products);

  return <ProductsClient products={products} allTags={allTags} />;
}

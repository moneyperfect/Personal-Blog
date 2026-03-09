import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { getProductBySlug } from '@/lib/products';
import { Locale } from '@/i18n/routing';
import CheckoutClient from './CheckoutClient';

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function ProductCheckoutPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const product = await getProductBySlug(slug, locale as Locale);
  if (!product) {
    notFound();
  }

  return (
    <CheckoutClient
      locale={locale}
      slug={slug}
      title={product.frontmatter.title}
      price={product.frontmatter.price}
      paymentMethods={product.frontmatter.paymentMethods || ['wechat', 'alipay']}
    />
  );
}

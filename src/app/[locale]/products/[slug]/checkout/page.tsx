import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { getProductBySlug } from '@/lib/products';
import ManualPaymentPanel from '@/components/payments/ManualPaymentPanel';
import { Locale } from '@/i18n/routing';

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
    <div className="page-shell">
      <div className="page-container page-width-content py-8 sm:py-10">
        <nav className="mb-6">
          <Link href={`/${locale}/products/${slug}`} className="link text-sm font-medium">
            {locale === 'zh' ? '返回产品详情' : '商品ページに戻る'}
          </Link>
        </nav>

        <ManualPaymentPanel
          locale={locale}
          slug={slug}
          title={product.frontmatter.title}
          price={product.frontmatter.price}
        />
      </div>
    </div>
  );
}

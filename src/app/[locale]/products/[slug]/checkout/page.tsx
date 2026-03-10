import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import ContactGuidePanel from '@/components/contact/ContactGuidePanel';
import { getProductBySlug } from '@/lib/products';
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

        <div className="page-header pb-6">
          <h1 className="page-title">
            {locale === 'zh' ? '先联系站长，再继续购买' : 'まずは連絡してから進めましょう'}
          </h1>
          <p className="page-description">
            {locale === 'zh'
              ? '当前站点不公开站内支付。你可以先添加我的联系方式，告诉我你感兴趣的产品和需求，我会继续和你对接。'
              : '現在のサイトではサイト内決済を公開していません。まずはご連絡いただければ、その後の流れをご案内します。'}
          </p>
        </div>

        <ContactGuidePanel
          locale={locale}
          title={product.frontmatter.title}
          price={product.frontmatter.price}
          showContactLink
        />
      </div>
    </div>
  );
}

import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { ProductCard } from '@/components/cards';
import { NewsletterSignup } from '@/components/forms';
import { getAllProducts, getAllLibraryItems } from '@/lib/mdx';
import { Locale } from '@/i18n/routing';

type Props = {
    params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    const products = getAllProducts(locale as Locale).slice(0, 3);
    const resources = getAllLibraryItems(locale as Locale).slice(0, 4);

    return <HomeContent locale={locale} products={products} resources={resources} />;
}

function HomeContent({
    locale,
    products,
    resources
}: {
    locale: string;
    products: Awaited<ReturnType<typeof getAllProducts>>;
    resources: Awaited<ReturnType<typeof getAllLibraryItems>>;
}) {
    const t = useTranslations('home');

    return (
        <div className="page-shell">
            <div className="page-container page-width">
                <header className="page-header">
                    <h1 className="page-title">{t('hero.title')}</h1>
                    <p className="page-description">{t('hero.subtitle')}</p>
                    <div className="mt-5 flex flex-wrap gap-3">
                        <Link
                            href={`/${locale}/products`}
                            className="btn btn-primary"
                        >
                            {t('hero.cta')}
                        </Link>
                        <Link
                            href={`/${locale}/library`}
                            className="btn btn-tonal"
                        >
                            {t('resources.title')}
                        </Link>
                    </div>
                </header>

                <section className="section">
                    <div className="section-header">
                        <h2 className="section-title">{t('featured.title')}</h2>
                        <Link
                            href={`/${locale}/products`}
                            className="link text-sm font-medium"
                        >
                            {t('featured.viewAll')}
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {products.map((product) => (
                            <ProductCard
                                key={product.slug}
                                slug={product.slug}
                                frontmatter={product.frontmatter}
                            />
                        ))}
                    </div>
                </section>

                <section className="section">
                    <div className="section-header">
                        <h2 className="section-title">{t('resources.title')}</h2>
                        <Link
                            href={`/${locale}/library`}
                            className="link text-sm font-medium"
                        >
                            {t('resources.viewAll')}
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {resources.map((resource) => (
                            <Link
                                key={resource.slug}
                                href={`/${locale}/library/${resource.slug}`}
                                className="card card-hover p-4"
                            >
                                <h3 className="font-semibold text-surface-900 mb-1">
                                    {resource.frontmatter.title}
                                </h3>
                                <p className="text-sm text-surface-600 line-clamp-2">
                                    {resource.frontmatter.summary}
                                </p>
                            </Link>
                        ))}
                    </div>
                </section>

                <section className="section pb-12 sm:pb-16">
                    <div className="card p-6 sm:p-8">
                        <div className="section-header mb-3">
                            <h2 className="section-title">{t('newsletter.title')}</h2>
                        </div>
                        <p className="section-description mb-4">
                            {t('newsletter.description')}
                        </p>
                        <NewsletterSignup />
                    </div>
                </section>
            </div>
        </div>
    );
}

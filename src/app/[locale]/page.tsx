import { useTranslations, useLocale } from 'next-intl';
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
    const nav = useTranslations('nav');

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-primary-50 via-white to-surface-100 py-20 sm:py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-surface-900 mb-6">
                            {t('hero.title')}
                        </h1>
                        <p className="text-lg sm:text-xl text-surface-600 mb-8">
                            {t('hero.subtitle')}
                        </p>
                        <Link
                            href={`/${locale}/products`}
                            className="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 text-white font-medium rounded-google-lg hover:bg-primary-700 shadow-elevated-2 hover:shadow-elevated-3 transition-all duration-200"
                        >
                            {t('hero.cta')}
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-72 h-72 bg-primary-200/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-yellow/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
            </section>

            {/* Featured Products */}
            <section className="py-16 sm:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-2xl sm:text-3xl font-bold text-surface-900">
                            {t('featured.title')}
                        </h2>
                        <Link
                            href={`/${locale}/products`}
                            className="text-primary-600 font-medium hover:underline"
                        >
                            {t('featured.viewAll')} →
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product) => (
                            <ProductCard
                                key={product.slug}
                                slug={product.slug}
                                frontmatter={product.frontmatter}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Resources Preview */}
            <section className="py-16 sm:py-24 bg-surface-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-2xl sm:text-3xl font-bold text-surface-900">
                            {t('resources.title')}
                        </h2>
                        <Link
                            href={`/${locale}/library`}
                            className="text-primary-600 font-medium hover:underline"
                        >
                            {t('resources.viewAll')} →
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {resources.map((resource) => (
                            <Link
                                key={resource.slug}
                                href={`/${locale}/library/${resource.slug}`}
                                className="bg-white rounded-google-lg p-5 border border-surface-300 hover:shadow-elevated-1 transition-all"
                            >
                                <span className="text-2xl mb-2 block">
                                    {resource.frontmatter.type === 'template' && '📄'}
                                    {resource.frontmatter.type === 'checklist' && '✅'}
                                    {resource.frontmatter.type === 'sop' && '📋'}
                                    {resource.frontmatter.type === 'prompt' && '💡'}
                                </span>
                                <h3 className="font-semibold text-surface-900 mb-1">
                                    {resource.frontmatter.title}
                                </h3>
                                <p className="text-sm text-surface-600 line-clamp-2">
                                    {resource.frontmatter.summary}
                                </p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter */}
            <section className="py-16 sm:py-24 bg-primary-600">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                        {t('newsletter.title')}
                    </h2>
                    <p className="text-primary-100 mb-8">
                        {t('newsletter.description')}
                    </p>
                    <div className="bg-white/10 backdrop-blur-sm rounded-google-lg p-6">
                        <NewsletterSignup />
                    </div>
                </div>
            </section>
        </div>
    );
}

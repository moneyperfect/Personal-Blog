import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from 'next/link';
import { getProductBySlug, getAllSlugs } from '@/lib/mdx';
import { Locale, routing } from '@/i18n/routing';
import { ProductDetailClient } from './ProductDetailClient';

type Props = {
    params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
    const params: { locale: string; slug: string }[] = [];

    for (const locale of routing.locales) {
        const slugs = await getAllSlugs('products', locale);
        for (const slug of slugs) {
            params.push({ locale, slug });
        }
    }

    return params;
}

export async function generateMetadata({ params }: Props) {
    const { locale, slug } = await params;
    const product = getProductBySlug(slug, locale as Locale);

    if (!product) {
        return { title: 'Product Not Found' };
    }

    return {
        title: product.frontmatter.title,
        description: product.frontmatter.summary,
        openGraph: {
            title: product.frontmatter.title,
            description: product.frontmatter.summary,
            type: 'article',
        },
    };
}

export default async function ProductDetailPage({ params }: Props) {
    const { locale, slug } = await params;
    setRequestLocale(locale);

    const product = getProductBySlug(slug, locale as Locale);

    if (!product) {
        notFound();
    }

    const t = await getTranslations({ locale, namespace: 'products' });
    const common = await getTranslations({ locale, namespace: 'common' });

    return (
        <div className="page-shell">
            <div className="page-container page-width-content">
                <nav className="pt-8">
                    <Link
                        href={`/${locale}/products`}
                        className="link text-sm font-medium"
                    >
                        {common('backTo')} {t('title')}
                    </Link>
                </nav>

                <header className="page-header pb-4">
                    <div className="flex flex-wrap gap-2 mb-4">
                        {product.frontmatter.tags.map((tag) => (
                            <span
                                key={tag}
                                className="chip chip-active text-[11px]"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                    <h1 className="page-title">{product.frontmatter.title}</h1>
                    <p className="page-description">{product.frontmatter.summary}</p>
                    <div className="flex flex-wrap items-center gap-4 mt-5">
                        <span className="text-2xl font-semibold text-primary-600">
                            {product.frontmatter.price}
                        </span>
                        <ProductDetailClient
                            slug={slug}
                            title={product.frontmatter.title}
                            purchaseUrl={product.frontmatter.purchaseUrl}
                            locale={locale}
                        />
                    </div>
                </header>

                <article className="prose max-w-none">
                    <MDXRemote source={product.content} />
                </article>

                <div className="mt-10 card p-6 sm:p-8">
                    <div className="section-header mb-3">
                        <h2 className="section-title">{t('buyNow')}</h2>
                    </div>
                    <p className="section-description mb-4">{t('description')}</p>
                    <ProductDetailClient
                        slug={slug}
                        title={product.frontmatter.title}
                        purchaseUrl={product.frontmatter.purchaseUrl}
                        locale={locale}
                        large
                    />
                </div>
            </div>
        </div>
    );
}

import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
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
        const slugs = getAllSlugs('products', locale);
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

    return (
        <div className="py-12 sm:py-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <nav className="mb-8">
                    <Link
                        href={`/${locale}/products`}
                        className="text-primary-600 hover:underline"
                    >
                        ← {locale === 'zh' ? '返回产品列表' : '製品一覧に戻る'}
                    </Link>
                </nav>

                {/* Header */}
                <header className="mb-10">
                    <div className="flex flex-wrap gap-2 mb-4">
                        {product.frontmatter.tags.map((tag) => (
                            <span
                                key={tag}
                                className="px-3 py-1 text-sm bg-primary-50 text-primary-700 rounded-full"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-surface-900 mb-4">
                        {product.frontmatter.title}
                    </h1>
                    <p className="text-lg text-surface-600 mb-6">
                        {product.frontmatter.summary}
                    </p>
                    <div className="flex items-center gap-4">
                        <span className="text-3xl font-bold text-primary-600">
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

                {/* Content */}
                <article className="prose max-w-none">
                    <MDXRemote source={product.content} />
                </article>

                {/* Bottom CTA */}
                <div className="mt-16 p-8 bg-surface-100 rounded-google-xl text-center">
                    <h3 className="text-xl font-bold text-surface-900 mb-2">
                        {locale === 'zh' ? '准备好开始了吗？' : '始める準備はできましたか？'}
                    </h3>
                    <p className="text-surface-600 mb-6">
                        {locale === 'zh' ? '立即获取，开始你的提效之旅' : '今すぐ手に入れて、効率化を始めましょう'}
                    </p>
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

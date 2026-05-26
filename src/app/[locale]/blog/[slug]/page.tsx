import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import MarkdownRenderer from '@/components/notes/MarkdownRenderer';
import { getPostBySlug, getAllPostSlugs, getRelatedPosts } from '@/lib/blog';
import { Locale, routing } from '@/i18n/routing';
import {
    absoluteUrl,
    buildArticleJsonLd,
    buildBreadcrumbJsonLd,
    localeAlternates,
    seoImageUrl,
} from '@/lib/seo';

export const revalidate = 60;

export async function generateStaticParams() {
    const params: { locale: string; slug: string }[] = [];
    for (const locale of routing.locales) {
        const slugs = await getAllPostSlugs(locale);
        for (const slug of slugs) {
            params.push({ locale, slug });
        }
    }
    return params;
}

type Props = {
    params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale, slug } = await params;
    const post = await getPostBySlug(slug, locale as Locale);

    if (!post) {
        return { title: 'Post Not Found' };
    }

    const title = post.frontmatter.title;
    const description = post.frontmatter.description;
    const path = `/blog/${slug}`;
    const image = seoImageUrl(post.frontmatter.coverImage);

    return {
        title,
        description,
        alternates: localeAlternates(path, locale as Locale),
        openGraph: {
            title,
            description,
            type: 'article',
            url: absoluteUrl(`/${locale}${path}`),
            images: [{ url: image }],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [image],
        },
    };
}

export default async function BlogDetailPage({ params }: Props) {
    const { locale, slug } = await params;
    setRequestLocale(locale);

    const post = await getPostBySlug(slug, locale as Locale);

    if (!post) {
        notFound();
    }

    const t = await getTranslations({ locale, namespace: 'blog' });
    const common = await getTranslations({ locale, namespace: 'common' });
    const relatedPosts = await getRelatedPosts(slug, locale as Locale, 3);

    const pageUrl = absoluteUrl(`/${locale}/blog/${slug}`);
    const articleJsonLd = buildArticleJsonLd({
        title: post.frontmatter.title,
        description: post.frontmatter.description,
        url: pageUrl,
        datePublished: post.frontmatter.date,
        dateModified: post.frontmatter.date,
        locale: locale as Locale,
        image: post.frontmatter.coverImage,
    });

    const breadcrumbJsonLd = buildBreadcrumbJsonLd([
        { name: 'Home', url: absoluteUrl(`/${locale}`) },
        { name: 'Blog', url: absoluteUrl(`/${locale}/blog`) },
        { name: post.frontmatter.title, url: pageUrl },
    ]);

    return (
        <div className="page-shell">
            <div className="page-container page-width-content">
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
                />

                <nav className="pt-8">
                    <Link href={`/${locale}/blog`} className="link text-sm font-medium">
                        {common('backTo')} {t('title')}
                    </Link>
                </nav>

                <header className="page-header pb-4">
                    <div className="flex flex-wrap gap-2 mb-3">
                        {post.frontmatter.category && (
                            <span className="chip chip-active text-[11px]">
                                {post.frontmatter.category}
                            </span>
                        )}
                        {post.frontmatter.tags.map((tag) => (
                            <Link
                                key={tag}
                                href={`/${locale}/blog?tag=${encodeURIComponent(tag)}`}
                                className="chip chip-muted text-[11px]"
                            >
                                #{tag}
                            </Link>
                        ))}
                    </div>
                    <h1 className="page-title">{post.frontmatter.title}</h1>
                    <p className="text-sm text-surface-500 mt-2">
                        {new Date(post.frontmatter.date).toLocaleDateString()}
                    </p>
                </header>

                <MarkdownRenderer content={post.content} />

                {/* Related posts */}
                {relatedPosts.length > 0 && (
                    <section className="section pb-12 sm:pb-16">
                        <h2 className="section-title mb-4">{t('relatedPosts')}</h2>
                        <div className="space-y-4">
                            {relatedPosts.map((related) => (
                                <Link
                                    key={related.slug}
                                    href={`/${locale}/blog/${related.slug}`}
                                    className="group block list-card"
                                >
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {related.frontmatter.category && (
                                            <span className="chip chip-active text-[11px]">
                                                {related.frontmatter.category}
                                            </span>
                                        )}
                                        {related.frontmatter.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="chip chip-muted text-[11px]"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                    <h3 className="text-lg font-semibold text-surface-900 group-hover:text-accent mb-2">
                                        {related.frontmatter.title}
                                    </h3>
                                    <p className="text-surface-600 line-clamp-2">
                                        {related.frontmatter.description}
                                    </p>
                                    <span className="text-sm text-surface-500 mt-2 block">
                                        {new Date(
                                            related.frontmatter.date
                                        ).toLocaleDateString()}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}

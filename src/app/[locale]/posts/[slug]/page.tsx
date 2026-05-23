import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import MarkdownRenderer from '@/components/notes/MarkdownRenderer';
import { getPostBySlug, getAllPostSlugs } from '@/lib/posts';
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
        const slugs = getAllPostSlugs(locale);
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
    const post = getPostBySlug(slug, locale as Locale);

    if (!post) {
        return { title: 'Post Not Found' };
    }

    const title = post.frontmatter.title;
    const description = post.frontmatter.description;
    const path = `/posts/${slug}`;
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

export default async function PostDetailPage({ params }: Props) {
    const { locale, slug } = await params;
    setRequestLocale(locale);

    const post = getPostBySlug(slug, locale as Locale);

    if (!post) {
        notFound();
    }

    const t = await getTranslations({ locale, namespace: 'posts' });
    const common = await getTranslations({ locale, namespace: 'common' });

    const pageUrl = absoluteUrl(`/${locale}/posts/${slug}`);
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
        { name: 'Posts', url: absoluteUrl(`/${locale}/posts`) },
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
                    <Link href={`/${locale}/posts`} className="link text-sm font-medium">
                        {common('backTo')} {t('title')}
                    </Link>
                </nav>

                <header className="page-header pb-4">
                    <div className="flex flex-wrap gap-2 mb-3">
                        {post.frontmatter.tags.map((tag) => (
                            <Link
                                key={tag}
                                href={`/${locale}/posts?tag=${encodeURIComponent(tag)}`}
                                className="chip chip-muted text-[11px] hover:border-primary-300"
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
            </div>
        </div>
    );
}

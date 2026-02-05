import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from 'next/link';
import { getLibraryItemBySlug, getAllSlugs } from '@/lib/mdx';
import { Locale, routing } from '@/i18n/routing';
import { CopyButton } from '@/components/ui/CopyButton';
import { DownloadButton } from '@/components/ui/DownloadButton';

type Props = {
    params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
    const params: { locale: string; slug: string }[] = [];

    for (const locale of routing.locales) {
        const slugs = getAllSlugs('library', locale);
        for (const slug of slugs) {
            params.push({ locale, slug });
        }
    }

    return params;
}

export async function generateMetadata({ params }: Props) {
    const { locale, slug } = await params;
    const item = getLibraryItemBySlug(slug, locale as Locale);

    if (!item) {
        return { title: 'Resource Not Found' };
    }

    return {
        title: item.frontmatter.title,
        description: item.frontmatter.summary,
    };
}

export default async function LibraryItemPage({ params }: Props) {
    const { locale, slug } = await params;
    setRequestLocale(locale);

    const item = getLibraryItemBySlug(slug, locale as Locale);

    if (!item) {
        notFound();
    }

    const typeLabels: Record<string, Record<string, string>> = {
        zh: { template: '模板', checklist: '清单', sop: 'SOP', prompt: 'Prompt' },
        ja: { template: 'テンプレート', checklist: 'チェックリスト', sop: 'SOP', prompt: 'Prompt' },
    };

    return (
        <div className="py-12 sm:py-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <nav className="mb-8">
                    <Link
                        href={`/${locale}/library`}
                        className="text-primary-600 hover:underline"
                    >
                        ← {locale === 'zh' ? '返回资源库' : 'ライブラリに戻る'}
                    </Link>
                </nav>

                {/* Header */}
                <header className="mb-10">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 text-sm bg-primary-50 text-primary-700 rounded-full">
                            {typeLabels[locale]?.[item.frontmatter.type] || item.frontmatter.type}
                        </span>
                        {item.frontmatter.tags.map((tag) => (
                            <span
                                key={tag}
                                className="px-3 py-1 text-sm bg-surface-100 text-surface-600 rounded-full"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-surface-900 mb-4">
                        {item.frontmatter.title}
                    </h1>
                    <p className="text-lg text-surface-600 mb-6">
                        {item.frontmatter.summary}
                    </p>
                    <div className="flex gap-3">
                        {item.frontmatter.copyText && (
                            <CopyButton
                                text={item.frontmatter.copyText}
                                slug={slug}
                                title={item.frontmatter.title}
                                className="px-6 py-3"
                            />
                        )}
                        {item.frontmatter.downloadUrl && (
                            <DownloadButton
                                url={item.frontmatter.downloadUrl}
                                slug={slug}
                                title={item.frontmatter.title}
                                className="px-6 py-3"
                            />
                        )}
                    </div>
                </header>

                {/* Content */}
                <article className="prose max-w-none">
                    <MDXRemote source={item.content} />
                </article>
            </div>
        </div>
    );
}

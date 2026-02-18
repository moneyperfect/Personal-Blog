import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { getAllNotes, getAllSlugs, getNoteBySlug } from '@/lib/mdx';
import { Locale } from '@/i18n/routing';
import {
    absoluteUrl,
    buildArticleJsonLd,
    buildBreadcrumbJsonLd,
    localeAlternates,
} from '@/lib/seo';

export const revalidate = 60;

export async function generateStaticParams() {
    const zhSlugs = await getAllSlugs('notes', 'zh');
    const jaSlugs = await getAllSlugs('notes', 'ja');

    return [
        ...zhSlugs.map((slug) => ({ locale: 'zh', slug })),
        ...jaSlugs.map((slug) => ({ locale: 'ja', slug })),
    ];
}

type Props = {
    params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale, slug } = await params;
    const note = await getNoteBySlug(slug, locale as Locale);

    if (!note) {
        return { title: 'Note Not Found' };
    }

    const title = note.frontmatter.seoTitle || note.frontmatter.title;
    const description = note.frontmatter.seoDescription || note.frontmatter.summary || '';
    const path = `/notes/${slug}`;
    const image = note.frontmatter.coverImage || '/icons/icon-512.png';

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

export default async function NoteDetailPage({ params }: Props) {
    const { locale, slug } = await params;
    setRequestLocale(locale);

    const language = locale as Locale;
    const currentNote = await getNoteBySlug(slug, language);

    if (!currentNote) {
        notFound();
    }

    const allNotes = await getAllNotes(language);
    const relatedNotes = allNotes
        .filter((item) => item.slug !== currentNote.slug)
        .map((item) => {
            const sharedTagCount = item.frontmatter.tags.filter((tag) =>
                currentNote.frontmatter.tags.includes(tag)
            ).length;
            return { item, sharedTagCount };
        })
        .filter((entry) => entry.sharedTagCount > 0)
        .sort((a, b) => b.sharedTagCount - a.sharedTagCount)
        .slice(0, 3)
        .map((entry) => entry.item);

    const { content, frontmatter } = currentNote;
    const t = await getTranslations({ locale, namespace: 'notes' });
    const common = await getTranslations({ locale, namespace: 'common' });

    const pageUrl = absoluteUrl(`/${locale}/notes/${slug}`);
    const articleJsonLd = buildArticleJsonLd({
        title: frontmatter.seoTitle || frontmatter.title,
        description: frontmatter.seoDescription || frontmatter.summary || '',
        url: pageUrl,
        datePublished: frontmatter.updatedAt,
        dateModified: frontmatter.updatedAt,
        locale: language,
        image: frontmatter.coverImage,
    });

    const breadcrumbJsonLd = buildBreadcrumbJsonLd([
        { name: 'Home', url: absoluteUrl(`/${locale}`) },
        { name: 'Notes', url: absoluteUrl(`/${locale}/notes`) },
        { name: frontmatter.title, url: pageUrl },
    ]);

    return (
        <div className="page-shell">
            <div className="page-container page-width-reading">
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
                />

                <nav className="pt-8">
                    <Link href={`/${locale}/notes`} className="link text-sm font-medium">
                        {common('backTo')} {t('title')}
                    </Link>
                </nav>

                <header className="page-header pb-4">
                    <div className="flex flex-wrap gap-2 mb-3">
                        {frontmatter.tags.map((tag) => (
                            <Link
                                key={tag}
                                href={`/${locale}/notes?tag=${encodeURIComponent(tag)}`}
                                className="chip chip-muted text-[11px] hover:border-primary-300"
                            >
                                #{tag}
                            </Link>
                        ))}
                    </div>
                    <h1 className="page-title">{frontmatter.title}</h1>
                    <p className="text-sm text-surface-500 mt-2">{frontmatter.updatedAt}</p>
                </header>

                <article className="prose max-w-none pb-8">
                    <ReactMarkdown>{content}</ReactMarkdown>
                </article>

                <section className="card p-6 sm:p-8 mb-8">
                    <h2 className="text-xl font-semibold text-surface-900 mb-2">
                        Need help shipping your next project?
                    </h2>
                    <p className="text-surface-600 mb-4">
                        If you are working on product validation, growth, or automation, I can help you move faster.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <Link href={`/${locale}/work-with-me`} className="btn btn-primary">
                            Work with me
                        </Link>
                        <Link href={`/${locale}/products`} className="btn btn-tonal">
                            View products
                        </Link>
                    </div>
                </section>

                {relatedNotes.length > 0 && (
                    <section className="pb-10">
                        <div className="section-header">
                            <h2 className="section-title">Related notes</h2>
                        </div>
                        <div className="space-y-3">
                            {relatedNotes.map((item) => (
                                <Link
                                    key={item.slug}
                                    href={`/${locale}/notes/${item.slug}`}
                                    className="block list-card"
                                >
                                    <h3 className="text-base font-semibold text-surface-900 mb-1">{item.frontmatter.title}</h3>
                                    <p className="text-sm text-surface-600 line-clamp-2">{item.frontmatter.summary}</p>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}

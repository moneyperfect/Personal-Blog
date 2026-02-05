import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from 'next/link';
import { getNoteBySlug, getAllSlugs } from '@/lib/mdx';
import { Locale, routing } from '@/i18n/routing';

type Props = {
    params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
    const params: { locale: string; slug: string }[] = [];
    for (const locale of routing.locales) {
        const slugs = getAllSlugs('notes', locale);
        for (const slug of slugs) {
            params.push({ locale, slug });
        }
    }
    return params;
}

export async function generateMetadata({ params }: Props) {
    const { locale, slug } = await params;
    const note = getNoteBySlug(slug, locale as Locale);
    if (!note) return { title: 'Note Not Found' };
    return {
        title: note.frontmatter.title,
        description: note.frontmatter.summary,
    };
}

export default async function NoteDetailPage({ params }: Props) {
    const { locale, slug } = await params;
    setRequestLocale(locale);

    const note = getNoteBySlug(slug, locale as Locale);
    if (!note) notFound();

    return (
        <div className="py-12 sm:py-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <nav className="mb-8">
                    <Link href={`/${locale}/notes`} className="text-primary-600 hover:underline">
                        ← {locale === 'zh' ? '返回笔记' : 'ノートに戻る'}
                    </Link>
                </nav>
                <header className="mb-10">
                    <div className="flex flex-wrap gap-2 mb-3">
                        {note.frontmatter.tags.map((tag) => (
                            <span key={tag} className="text-sm text-surface-500">#{tag}</span>
                        ))}
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-surface-900 mb-4">
                        {note.frontmatter.title}
                    </h1>
                    <p className="text-surface-500">{note.frontmatter.updatedAt}</p>
                </header>
                <article className="prose max-w-none">
                    <MDXRemote source={note.content} />
                </article>
            </div>
        </div>
    );
}

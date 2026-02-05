import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { getNotePageBySlug, getPageContent } from '@/lib/notion';
import { Locale } from '@/i18n/routing';

export const revalidate = 60; // Cache for 60 seconds

type Props = {
    params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props) {
    const { locale, slug } = await params;
    const note = await getNotePageBySlug(slug, locale as 'zh' | 'ja');
    if (!note) return { title: 'Note Not Found' };
    return {
        title: note.title,
        description: note.summary,
    };
}

export default async function NoteDetailPage({ params }: Props) {
    const { locale, slug } = await params;
    setRequestLocale(locale);

    const note = await getNotePageBySlug(slug, locale as 'zh' | 'ja');
    if (!note) notFound();

    const markdownContent = await getPageContent(note.id);

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
                        {note.tags.map((tag) => (
                            <span key={tag} className="text-sm text-surface-500">#{tag}</span>
                        ))}
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-surface-900 mb-4">
                        {note.title}
                    </h1>
                    <p className="text-surface-500">{note.date}</p>
                </header>
                <article className="prose max-w-none">
                    <ReactMarkdown>{markdownContent}</ReactMarkdown>
                </article>
            </div>
        </div>
    );
}

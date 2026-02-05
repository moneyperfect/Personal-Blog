import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { getNotePageBySlug, getPageContent } from '@/lib/notion';

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
    const t = await getTranslations({ locale, namespace: 'notes' });
    const common = await getTranslations({ locale, namespace: 'common' });

    return (
        <div className="page-shell">
            <div className="page-container page-width-reading">
                <nav className="pt-8">
                    <Link href={`/${locale}/notes`} className="link text-sm font-medium">
                        {common('backTo')} {t('title')}
                    </Link>
                </nav>
                <header className="page-header pb-4">
                    <div className="flex flex-wrap gap-2 mb-3">
                        {note.tags.map((tag) => (
                            <span key={tag} className="chip chip-muted text-[11px]">#{tag}</span>
                        ))}
                    </div>
                    <h1 className="page-title">{note.title}</h1>
                    <p className="text-sm text-surface-500 mt-2">{note.date}</p>
                </header>
                <article className="prose max-w-none pb-12">
                    <ReactMarkdown>{markdownContent}</ReactMarkdown>
                </article>
            </div>
        </div>
    );
}

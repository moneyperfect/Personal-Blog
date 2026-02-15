import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { getNotePageBySlug, getPageContent, getAllNoteSlugs, NotionNote } from '@/lib/notion';
import { getNoteBySlug, convertLocalNoteToNotionNote } from '@/lib/mdx';
// import { ArticleBottomAd } from '@/components/AdUnit'; // 取消注释以启用广告

export const revalidate = 60; // Cache for 60 seconds

export async function generateStaticParams() {
    const slugs = await getAllNoteSlugs();
    return slugs.map(({ locale, slug }) => ({ locale, slug }));
}

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

    let note: NotionNote | null = null;
    let markdownContent = '';
    const language = locale as 'zh' | 'ja';

    // Try to get note from local MDX files first
    const localNote = getNoteBySlug(slug, language);
    if (localNote) {
        note = convertLocalNoteToNotionNote(localNote);
        markdownContent = localNote.content;
    } else {
        // Fallback to Notion API
        note = await getNotePageBySlug(slug, language);
        if (!note) notFound();
        markdownContent = await getPageContent(note.id);
    }

    const t = await getTranslations({ locale, namespace: 'notes' });
    const common = await getTranslations({ locale, namespace: 'common' });

    // 广告位开关 - 设置为 true 并取消注释上方 import 以启用
    const showAds = false;
    const adSlot = "YOUR_AD_SLOT_ID"; // 从 AdSense 获取

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
                <article className="prose max-w-none pb-8">
                    <ReactMarkdown>{markdownContent}</ReactMarkdown>
                </article>

                {/* 文章底部广告位 - 取消注释以启用 */}
                {/* {showAds && <ArticleBottomAd slot={adSlot} />} */}
            </div>
        </div>
    );
}

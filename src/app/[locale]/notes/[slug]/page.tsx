import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { getAllSlugs, getNoteBySlug } from '@/lib/mdx';
// import { ArticleBottomAd } from '@/components/AdUnit'; // 取消注释以启用广告

export const revalidate = 60; // Cache for 60 seconds

export async function generateStaticParams() {
    const zhSlugs = await getAllSlugs('notes', 'zh');
    const jaSlugs = await getAllSlugs('notes', 'ja');

    return [
        ...zhSlugs.map(slug => ({ locale: 'zh', slug })),
        ...jaSlugs.map(slug => ({ locale: 'ja', slug }))
    ];
}

type Props = {
    params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props) {
    const { locale, slug } = await params;
    const note = await getNoteBySlug(slug, locale as 'zh' | 'ja');
    if (!note) return { title: 'Note Not Found' };
    return {
        title: note.frontmatter.title,
        description: note.frontmatter.summary,
    };
}

export default async function NoteDetailPage({ params }: Props) {
    const { locale, slug } = await params;
    setRequestLocale(locale);

    const language = locale as 'zh' | 'ja';
    const localNote = await getNoteBySlug(slug, language);

    if (!localNote) {
        notFound();
    }

    const { content, frontmatter } = localNote;
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
                        {frontmatter.tags.map((tag) => (
                            <span key={tag} className="chip chip-muted text-[11px]">#{tag}</span>
                        ))}
                    </div>
                    <h1 className="page-title">{frontmatter.title}</h1>
                    <p className="text-sm text-surface-500 mt-2">{frontmatter.updatedAt}</p>
                </header>
                <article className="prose max-w-none pb-8">
                    <ReactMarkdown>{content}</ReactMarkdown>
                </article>

                {/* 文章底部广告位 - 取消注释以启用 */}
                {/* {showAds && <ArticleBottomAd slot={adSlot} />} */}
            </div>
        </div>
    );
}

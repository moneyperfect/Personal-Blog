import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { Locale } from '@/i18n/routing';
import { getAllNotes, getAllTags } from '@/lib/mdx';
import { localeAlternates } from '@/lib/seo';

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
    const { locale } = await params;
    const isZh = locale === 'zh';

    return {
        title: isZh ? '主题导航' : 'トピックナビ',
        description: isZh
            ? '按主题快速找到相关文章，构建连续阅读路径。'
            : 'トピック別に関連記事を素早く探せます。',
        alternates: localeAlternates('/topics', locale as Locale),
    };
}

export default async function TopicsPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    const isZh = locale === 'zh';

    const notes = await getAllNotes(locale as Locale);
    const tags = getAllTags(notes);

    const grouped = tags
        .map((tag) => ({
            tag,
            notes: notes.filter((note) => note.frontmatter.tags.includes(tag)).slice(0, 4),
            count: notes.filter((note) => note.frontmatter.tags.includes(tag)).length,
        }))
        .sort((a, b) => b.count - a.count);

    return (
        <div className="page-shell">
            <div className="page-container page-width">
                <header className="page-header">
                    <h1 className="page-title">{isZh ? '主题导航' : 'トピックナビ'}</h1>
                    <p className="page-description">
                        {isZh ? '从主题切入，连续阅读相关内容。' : 'トピック単位で関連ノートを連続して読めます。'}
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {grouped.map((group) => (
                        <section key={group.tag} className="card p-5">
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="text-lg font-semibold text-surface-900">#{group.tag}</h2>
                                <Link
                                    href={`/${locale}/notes?tag=${encodeURIComponent(group.tag)}`}
                                    className="text-xs text-primary-600 hover:underline"
                                >
                                    {isZh ? '查看全部' : 'すべて見る'}
                                </Link>
                            </div>
                            <ul className="space-y-2">
                                {group.notes.map((note) => (
                                    <li key={note.slug}>
                                        <Link
                                            href={`/${locale}/notes/${note.slug}`}
                                            className="text-sm text-surface-700 hover:text-primary-600"
                                        >
                                            {note.frontmatter.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    ))}
                </div>
            </div>
        </div>
    );
}

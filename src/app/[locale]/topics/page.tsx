import Link from 'next/link';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Locale } from '@/i18n/routing';
import { getAllPosts, getAllPostTags, getAllCategories } from '@/lib/blog';
import { localeAlternates } from '@/lib/seo';

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
    const { locale } = await params;
    const isZh = locale === 'zh';

    return {
        title: isZh ? '主题' : 'トピック',
        description: isZh
            ? '按主题浏览所有文章'
            : 'トピックで記事を閲覧',
        alternates: localeAlternates('/topics', locale as Locale),
    };
}

export default async function TopicsPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    const t = await getTranslations({ locale, namespace: 'topics' });
    const posts = getAllPosts(locale as Locale);
    const tags = getAllPostTags(locale as Locale);
    const categories = getAllCategories(locale as Locale);

    // Build topic list from both tags and categories
    const topics: { name: string; type: 'tag' | 'category'; count: number }[] = [];

    for (const cat of categories) {
        const count = posts.filter(
            (p) => p.frontmatter.category === cat
        ).length;
        topics.push({ name: cat, type: 'category', count });
    }

    for (const tag of tags) {
        // Skip if a category with the same name exists
        if (categories.includes(tag)) continue;
        const count = posts.filter((p) =>
            p.frontmatter.tags.includes(tag)
        ).length;
        topics.push({ name: tag, type: 'tag', count });
    }

    topics.sort((a, b) => b.count - a.count);

    return (
        <div className="page-shell">
            <div className="page-container page-width">
                <header className="page-header">
                    <h1 className="page-title">{t('title')}</h1>
                    <p className="page-description">{t('description')}</p>
                </header>

                <section className="section pb-12 sm:pb-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {topics.map((topic) => (
                            <Link
                                key={`${topic.type}-${topic.name}`}
                                href={`/${locale}/topics/${encodeURIComponent(topic.name)}`}
                                className="card card-hover block p-5"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span
                                        className={`chip text-[11px] ${
                                            topic.type === 'category'
                                                ? 'chip-active'
                                                : 'chip-muted'
                                        }`}
                                    >
                                        {topic.type === 'category' ? topic.name : `#${topic.name}`}
                                    </span>
                                    <span className="text-sm text-surface-500">
                                        {topic.count} {topic.count === 1 ? 'article' : 'articles'}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}

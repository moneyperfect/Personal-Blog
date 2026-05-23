import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Locale } from '@/i18n/routing';
import { getAllPosts, getAllPostTags, getAllCategories } from '@/lib/blog';
import { localeAlternates } from '@/lib/seo';

type Props = {
    params: Promise<{ locale: string; topic: string }>;
};

export async function generateMetadata({ params }: Props) {
    const { locale, topic } = await params;
    const decodedTopic = decodeURIComponent(topic);

    return {
        title: decodedTopic,
        alternates: localeAlternates(
            `/topics/${encodeURIComponent(decodedTopic)}`,
            locale as Locale
        ),
    };
}

export default async function TopicDetailPage({ params }: Props) {
    const { locale, topic } = await params;
    setRequestLocale(locale);

    const decodedTopic = decodeURIComponent(topic);
    const t = await getTranslations({ locale, namespace: 'topics' });
    const common = await getTranslations({ locale, namespace: 'common' });

    const posts = getAllPosts(locale as Locale);
    const tags = getAllPostTags(locale as Locale);
    const categories = getAllCategories(locale as Locale);

    // Determine if this topic is a tag or category
    const isCategory = categories.includes(decodedTopic);
    const isTag = tags.includes(decodedTopic);

    if (!isCategory && !isTag) {
        notFound();
    }

    // Filter posts by this topic
    const topicPosts = posts.filter((post) => {
        if (isCategory) {
            return post.frontmatter.category === decodedTopic;
        }
        return post.frontmatter.tags.includes(decodedTopic);
    });

    topicPosts.sort(
        (a, b) =>
            new Date(b.frontmatter.date).getTime() -
            new Date(a.frontmatter.date).getTime()
    );

    return (
        <div className="page-shell">
            <div className="page-container page-width">
                <nav className="pt-8">
                    <Link
                        href={`/${locale}/topics`}
                        className="link text-sm font-medium"
                    >
                        {common('backTo')} {t('title')}
                    </Link>
                </nav>

                <header className="page-header">
                    <span
                        className={`chip text-[11px] mb-3 inline-block ${
                            isCategory ? 'chip-active' : 'chip-muted'
                        }`}
                    >
                        {isCategory ? decodedTopic : `#${decodedTopic}`}
                    </span>
                    <h1 className="page-title">
                        {isCategory ? decodedTopic : `#${decodedTopic}`}
                    </h1>
                    <p className="page-description">
                        {topicPosts.length}{' '}
                        {topicPosts.length === 1 ? 'article' : 'articles'}
                    </p>
                </header>

                <section className="section pb-12 sm:pb-16">
                    <div className="space-y-4">
                        {topicPosts.map((post) => (
                            <Link
                                key={post.slug}
                                href={`/${locale}/blog/${post.slug}`}
                                className="group block list-card"
                            >
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {post.frontmatter.category && (
                                        <span className="chip chip-active text-[11px]">
                                            {post.frontmatter.category}
                                        </span>
                                    )}
                                    {post.frontmatter.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="chip chip-muted text-[11px]"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                                <h2 className="text-lg font-semibold text-surface-900 group-hover:text-accent mb-2">
                                    {post.frontmatter.title}
                                </h2>
                                <p className="text-surface-600 line-clamp-2">
                                    {post.frontmatter.description}
                                </p>
                                <span className="text-sm text-surface-500 mt-2 block">
                                    {new Date(
                                        post.frontmatter.date
                                    ).toLocaleDateString()}
                                </span>
                            </Link>
                        ))}
                    </div>

                    {topicPosts.length === 0 && (
                        <div className="text-center py-16 text-surface-600 card p-6">
                            <p className="font-medium">{common('notFound')}</p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

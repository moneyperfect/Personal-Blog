import { setRequestLocale } from 'next-intl/server';
import { getAllPosts, getAllPostTags, getAllCategories } from '@/lib/blog';
import { Locale } from '@/i18n/routing';
import { localeAlternates } from '@/lib/seo';
import { BlogClient } from './BlogClient';

export const revalidate = 60;

type Props = {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ tag?: string; category?: string }>;
};

export async function generateMetadata({ params }: Pick<Props, 'params'>) {
    const { locale } = await params;
    const isZh = locale === 'zh';

    return {
        title: isZh ? '博客' : 'ブログ',
        description: isZh
            ? '产品思考、技术分享与创业心得。按标签快速筛选主题。'
            : 'プロダクト思考、技術共有、起業の知見。タグで素早く絞り込み。',
        alternates: localeAlternates('/blog', locale as Locale),
    };
}

export default async function BlogPage({ params, searchParams }: Props) {
    const { locale } = await params;
    const { tag, category } = await searchParams;
    setRequestLocale(locale);

    const posts = getAllPosts(locale as Locale);
    const allTags = getAllPostTags(locale as Locale);
    const allCategories = getAllCategories(locale as Locale);
    const initialTag = tag && allTags.includes(tag) ? tag : undefined;
    const initialCategory =
        category && allCategories.includes(category) ? category : undefined;

    return (
        <BlogClient
            posts={posts}
            allTags={allTags}
            allCategories={allCategories}
            initialTag={initialTag}
            initialCategory={initialCategory}
        />
    );
}

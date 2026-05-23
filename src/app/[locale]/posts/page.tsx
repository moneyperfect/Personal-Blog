import { setRequestLocale } from 'next-intl/server';
import { getAllPosts, getAllPostTags } from '@/lib/posts';
import { Locale } from '@/i18n/routing';
import { localeAlternates } from '@/lib/seo';
import { PostsClient } from './PostsClient';

export const revalidate = 60;

type Props = {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ tag?: string }>;
};

export async function generateMetadata({ params }: Pick<Props, 'params'>) {
    const { locale } = await params;
    const isZh = locale === 'zh';

    return {
        title: isZh ? '文章' : '記事',
        description: isZh
            ? '产品思考、技术分享与创业心得。按标签快速筛选主题。'
            : 'プロダクト思考、技術共有、起業の知見。タグで素早く絞り込み。',
        alternates: localeAlternates('/posts', locale as Locale),
    };
}

export default async function PostsPage({ params, searchParams }: Props) {
    const { locale } = await params;
    const { tag } = await searchParams;
    setRequestLocale(locale);

    const posts = getAllPosts(locale as Locale);
    const allTags = getAllPostTags(locale as Locale);
    const initialTag = tag && allTags.includes(tag) ? tag : undefined;

    return <PostsClient posts={posts} allTags={allTags} initialTag={initialTag} />;
}

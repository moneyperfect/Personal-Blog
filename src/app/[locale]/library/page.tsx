import { setRequestLocale } from 'next-intl/server';
import { getAllLibraryItems, getAllTags } from '@/lib/mdx';
import { queryLibraryByCategory } from '@/lib/notion';
import { Locale } from '@/i18n/routing';
import { LibraryClient } from './LibraryClient';

export const revalidate = 60; // Cache for 60 seconds

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
    const { locale } = await params;
    return {
        title: locale === 'zh' ? '资源库' : 'リソースライブラリ',
        description: locale === 'zh'
            ? '免费模板、清单、Prompt、SOP 与笔记'
            : '無料のテンプレート、チェックリスト、Prompt、SOP、ノート',
    };
}

export default async function LibraryPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    // Fetch MDX library items (static resources)
    const mdxItems = getAllLibraryItems(locale as Locale);
    const allTags = getAllTags(mdxItems);

    // Fetch all Notion items for library (Published + Language filter)
    const notionItems = await queryLibraryByCategory(locale as 'zh' | 'ja');

    return (
        <LibraryClient
            mdxItems={mdxItems}
            notionItems={notionItems}
            allTags={allTags}
            locale={locale}
        />
    );
}

import { setRequestLocale } from 'next-intl/server';
import { getAllLibraryItems, getAllTags } from '@/lib/mdx';
import { queryNotes } from '@/lib/notion';
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
            ? '免费模板、清单、Prompt 与 SOP'
            : '無料のテンプレート、チェックリスト、Prompt、SOP',
    };
}

export default async function LibraryPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    // Fetch MDX library items
    const items = getAllLibraryItems(locale as Locale);
    const allTags = getAllTags(items);

    // Fetch Notion notes
    const notes = await queryNotes(locale as 'zh' | 'ja');

    return <LibraryClient items={items} allTags={allTags} notes={notes} locale={locale} />;
}

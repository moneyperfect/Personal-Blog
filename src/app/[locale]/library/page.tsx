import { setRequestLocale } from 'next-intl/server';
import { getAllResources } from '@/lib/mdx';
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

    // Fetch all resources (MDX library items + Notes)
    const resources = await getAllResources(locale as Locale);

    return (
        <LibraryClient
            resources={resources}
            locale={locale}
        />
    );
}

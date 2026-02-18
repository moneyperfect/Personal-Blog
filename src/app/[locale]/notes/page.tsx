import { setRequestLocale } from 'next-intl/server';
import { getAllNotes, getAllTags } from '@/lib/mdx';
import { Locale } from '@/i18n/routing';
import { NotesClient } from './NotesClient';
import { localeAlternates } from '@/lib/seo';

export const revalidate = 60;

type Props = {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ tag?: string }>;
};

export async function generateMetadata({ params }: Pick<Props, 'params'>) {
    const { locale } = await params;
    const isZh = locale === 'zh';

    return {
        title: isZh ? '笔记' : 'ノート',
        description: isZh
            ? '产品思考、实战复盘与技术记录。按标签快速筛选主题。'
            : 'プロダクト思考、実践記録、技術メモをタグで素早く絞り込み。',
        alternates: localeAlternates('/notes', locale as Locale),
    };
}

export default async function NotesPage({ params, searchParams }: Props) {
    const { locale } = await params;
    const { tag } = await searchParams;
    setRequestLocale(locale);

    const notes = await getAllNotes(locale as Locale);
    const allTags = getAllTags(notes);
    const initialTag = tag && allTags.includes(tag) ? tag : undefined;

    return <NotesClient notes={notes} allTags={allTags} initialTag={initialTag} />;
}

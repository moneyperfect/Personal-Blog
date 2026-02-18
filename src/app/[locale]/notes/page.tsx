import { setRequestLocale } from 'next-intl/server';
import { getAllNotes, getAllTags } from '@/lib/mdx';
import { Locale } from '@/i18n/routing';
import { NotesClient } from './NotesClient';

export const revalidate = 60; // Cache for 60 seconds

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
    const { locale } = await params;
    return {
        title: locale === 'zh' ? '笔记' : 'ノート',
    };
}

export default async function NotesPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    const notes = await getAllNotes(locale as Locale);

    // Extract unique tags
    const allTags = getAllTags(notes);

    return <NotesClient notes={notes} allTags={allTags} />;
}

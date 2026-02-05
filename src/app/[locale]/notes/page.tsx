import { setRequestLocale } from 'next-intl/server';
import { queryNotes } from '@/lib/notion';
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

    const notes = await queryNotes(locale as 'zh' | 'ja');

    // Extract unique tags
    const allTags = Array.from(new Set(notes.flatMap(note => note.tags))).sort();

    return <NotesClient notes={notes} allTags={allTags} />;
}

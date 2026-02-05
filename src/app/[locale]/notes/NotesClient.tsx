'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import Link from 'next/link';
import { TagFilter } from '@/components/ui';
import { NotionNote } from '@/lib/notion';
import { useLocale } from 'next-intl';

interface NotesClientProps {
    notes: NotionNote[];
    allTags: string[];
}

export function NotesClient({ notes, allTags }: NotesClientProps) {
    const locale = useLocale();
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const filteredNotes = selectedTags.length === 0
        ? notes
        : notes.filter((note) =>
            selectedTags.some((tag) => note.tags.includes(tag))
        );

    // Hardcoded titles if translation missing, but ideally we use t()
    const title = locale === 'zh' ? '笔记' : 'ノート';
    const description = locale === 'zh'
        ? '产品思考、创业心得与技术分享'
        : '製品思考、起業の知見、技術共有';

    return (
        <div className="py-12 sm:py-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl sm:text-4xl font-bold text-surface-900 mb-4">
                        {title}
                    </h1>
                    <p className="text-lg text-surface-600 max-w-2xl mx-auto">
                        {description}
                    </p>
                </div>

                {/* Filters */}
                <div className="mb-10">
                    <TagFilter
                        tags={allTags}
                        selectedTags={selectedTags}
                        onChange={setSelectedTags}
                    />
                </div>

                {/* Notes List */}
                <div className="space-y-6">
                    {filteredNotes.map((note) => (
                        <Link
                            key={note.id}
                            href={`/${locale}/notes/${note.slug}`}
                            className="group block bg-white rounded-google-lg border border-surface-300 p-6 hover:shadow-elevated-1 transition-all"
                        >
                            <div className="flex flex-wrap gap-2 mb-2">
                                {note.tags.map((tag) => (
                                    <span key={tag} className="text-xs text-surface-500">#{tag}</span>
                                ))}
                            </div>
                            <h2 className="text-xl font-semibold text-surface-900 group-hover:text-primary-600 mb-2">
                                {note.title}
                            </h2>
                            <p className="text-surface-600 line-clamp-2">{note.summary}</p>
                            <span className="text-sm text-surface-500 mt-2 block">
                                {note.date}
                            </span>
                        </Link>
                    ))}
                </div>

                {filteredNotes.length === 0 && (
                    <div className="text-center py-16 text-surface-600">
                        {locale === 'zh' ? '暂无文章' : '記事なし'}
                    </div>
                )}
            </div>
        </div>
    );
}

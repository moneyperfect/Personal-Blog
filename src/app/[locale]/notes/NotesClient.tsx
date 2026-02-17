'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import Link from 'next/link';
import { TagFilter } from '@/components/ui';
import { NoteFrontmatter, ContentItem } from '@/lib/mdx';
import { useLocale } from 'next-intl';

interface NotesClientProps {
    notes: ContentItem<NoteFrontmatter>[];
    allTags: string[];
}

export function NotesClient({ notes, allTags }: NotesClientProps) {
    const locale = useLocale();
    const t = useTranslations('notes');
    const common = useTranslations('common');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const filteredNotes = selectedTags.length === 0
        ? notes
        : notes.filter((note) =>
            selectedTags.some((tag) => note.frontmatter.tags.includes(tag))
        );

    return (
        <div className="page-shell">
            <div className="page-container page-width">
                <header className="page-header">
                    <h1 className="page-title">{t('title')}</h1>
                    <p className="page-description">{t('description')}</p>
                </header>

                <section className="section">
                    <div className="section-header">
                        <h2 className="section-title">{t('title')}</h2>
                    </div>
                    <div className="mb-4">
                        <TagFilter
                            tags={allTags}
                            selectedTags={selectedTags}
                            onChange={setSelectedTags}
                        />
                    </div>

                    <div className="space-y-4">
                        {filteredNotes.map((note) => (
                            <Link
                                key={note.slug}
                                href={`/${locale}/notes/${note.slug}`}
                                className="group block list-card"
                            >
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {note.frontmatter.tags.map((tag) => (
                                        <span key={tag} className="chip chip-muted text-[11px]">#{tag}</span>
                                    ))}
                                </div>
                                <h2 className="text-lg font-semibold text-surface-900 group-hover:text-primary-600 mb-2">
                                    {note.frontmatter.title}
                                </h2>
                                <p className="text-surface-600 line-clamp-2">{note.frontmatter.summary}</p>
                                <span className="text-sm text-surface-500 mt-2 block">
                                    {new Date(note.frontmatter.updatedAt).toLocaleDateString()}
                                </span>
                            </Link>
                        ))}
                    </div>

                    {filteredNotes.length === 0 && (
                        <div className="text-center py-16 text-surface-600 card p-6">
                            <p className="font-medium">{common('notFound')}</p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

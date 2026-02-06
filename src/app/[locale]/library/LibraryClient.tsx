'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import Link from 'next/link';
import { ResourceCard } from '@/components/cards';
import { TagFilter, ChipButton } from '@/components/ui';
import { LibraryFrontmatter, ContentItem } from '@/lib/mdx';
import { NotionNote } from '@/lib/notion';

interface LibraryClientProps {
    items: ContentItem<LibraryFrontmatter>[];
    allTags: string[];
    notes: NotionNote[];
    locale: string;
}

export function LibraryClient({ items, allTags, notes, locale }: LibraryClientProps) {
    const t = useTranslations('library');
    const common = useTranslations('common');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [selectedType, setSelectedType] = useState<string>('');

    // Resource types (MDX-based)
    const resourceTypes = ['template', 'checklist', 'sop', 'prompt'];
    // All types including notes
    const allTypes = [...resourceTypes, 'note'];

    // Filter MDX items
    const filteredItems = items.filter((item) => {
        const matchesTags = selectedTags.length === 0 ||
            selectedTags.some((tag) => item.frontmatter.tags.includes(tag));
        const matchesType = !selectedType || selectedType === 'note' ? false : item.frontmatter.type === selectedType;
        // Show MDX items only when not viewing notes and type matches
        return selectedType !== 'note' && matchesTags && (selectedType === '' || item.frontmatter.type === selectedType);
    });

    // Filter notes when "note" type is selected
    const filteredNotes = selectedType === 'note' ? notes.filter((note) => {
        if (selectedTags.length === 0) return true;
        return selectedTags.some((tag) => note.tags.includes(tag));
    }) : [];

    // Combine all tags from both MDX and notes for the filter
    const noteTags = notes.flatMap(n => n.tags);
    const combinedTags = Array.from(new Set([...allTags, ...noteTags])).sort();

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

                    {/* Type Filter Chips */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        <ChipButton
                            onClick={() => setSelectedType('')}
                            active={selectedType === ''}
                            aria-pressed={selectedType === ''}
                            type="button"
                        >
                            {t('filterAll')}
                        </ChipButton>
                        {resourceTypes.map((type) => (
                            <ChipButton
                                key={type}
                                onClick={() => setSelectedType(selectedType === type ? '' : type)}
                                active={selectedType === type}
                                aria-pressed={selectedType === type}
                                type="button"
                            >
                                {t(`types.${type}`)}
                            </ChipButton>
                        ))}
                        {/* Notes Tab */}
                        <ChipButton
                            onClick={() => setSelectedType(selectedType === 'note' ? '' : 'note')}
                            active={selectedType === 'note'}
                            aria-pressed={selectedType === 'note'}
                            type="button"
                        >
                            {locale === 'zh' ? '笔记' : 'ノート'}
                        </ChipButton>
                    </div>

                    {/* Tag Filter */}
                    <div className="mb-6">
                        <TagFilter
                            tags={selectedType === 'note' ? noteTags.filter((v, i, a) => a.indexOf(v) === i).sort() : allTags}
                            selectedTags={selectedTags}
                            onChange={setSelectedTags}
                        />
                    </div>

                    {/* Content Grid */}
                    {selectedType !== 'note' ? (
                        // MDX Resource Cards
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredItems.map((item) => (
                                <ResourceCard
                                    key={item.slug}
                                    slug={item.slug}
                                    frontmatter={item.frontmatter}
                                />
                            ))}
                        </div>
                    ) : (
                        // Notion Notes as Article Cards
                        <div className="space-y-4">
                            {filteredNotes.map((note) => (
                                <Link
                                    key={note.id}
                                    href={`/${locale}/notes/${note.slug}`}
                                    className="group block bg-white rounded-google-lg border border-surface-300 p-6 hover:shadow-elevated-1 transition-all"
                                >
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {note.tags.map((tag) => (
                                            <span key={tag} className="text-xs text-surface-500 bg-surface-100 px-2 py-0.5 rounded-full">#{tag}</span>
                                        ))}
                                    </div>
                                    <h3 className="text-xl font-semibold text-surface-900 group-hover:text-primary-600 mb-2">
                                        {note.title}
                                    </h3>
                                    <p className="text-surface-600 line-clamp-2 mb-3">{note.summary}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-surface-500">{note.date}</span>
                                        <span className="text-sm text-primary-600 group-hover:underline">
                                            {locale === 'zh' ? '查看详情 →' : '詳細を見る →'}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Empty State */}
                    {selectedType !== 'note' && filteredItems.length === 0 && (
                        <div className="text-center py-16 text-surface-600">
                            {common('notFound')}
                        </div>
                    )}
                    {selectedType === 'note' && filteredNotes.length === 0 && (
                        <div className="text-center py-16 text-surface-600 bg-surface-50 rounded-google-lg border border-surface-200">
                            <p className="font-medium mb-2">
                                {locale === 'zh' ? '暂无笔记' : 'ノートがありません'}
                            </p>
                            <p className="text-sm">
                                {locale === 'zh'
                                    ? '请在 Notion 中勾选 Published 并确认 Language/Type/Slug 配置正确'
                                    : 'NotionでPublishedをチェックし、Language/Type/Slugの設定を確認してください'}
                            </p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

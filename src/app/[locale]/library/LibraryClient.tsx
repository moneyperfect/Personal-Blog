'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { ResourceCard } from '@/components/cards';
import { TagFilter, ChipButton } from '@/components/ui';
import { LibraryFrontmatter, ContentItem } from '@/lib/mdx';

interface LibraryClientProps {
    items: ContentItem<LibraryFrontmatter>[];
    allTags: string[];
}

export function LibraryClient({ items, allTags }: LibraryClientProps) {
    const t = useTranslations('library');
    const common = useTranslations('common');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [selectedType, setSelectedType] = useState<string>('');

    const filteredItems = items.filter((item) => {
        const matchesTags = selectedTags.length === 0 ||
            selectedTags.some((tag) => item.frontmatter.tags.includes(tag));
        const matchesType = !selectedType || item.frontmatter.type === selectedType;
        return matchesTags && matchesType;
    });

    const types = ['template', 'checklist', 'sop', 'prompt'];

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

                    <div className="flex flex-wrap gap-2 mb-4">
                        <ChipButton
                            onClick={() => setSelectedType('')}
                            active={selectedType === ''}
                            aria-pressed={selectedType === ''}
                            type="button"
                        >
                            {t('filterAll')}
                        </ChipButton>
                        {types.map((type) => (
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
                    </div>

                    <div className="mb-6">
                        <TagFilter
                            tags={allTags}
                            selectedTags={selectedTags}
                            onChange={setSelectedTags}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredItems.map((item) => (
                            <ResourceCard
                                key={item.slug}
                                slug={item.slug}
                                frontmatter={item.frontmatter}
                            />
                        ))}
                    </div>

                    {filteredItems.length === 0 && (
                        <div className="text-center py-16 text-surface-600">
                            {common('notFound')}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

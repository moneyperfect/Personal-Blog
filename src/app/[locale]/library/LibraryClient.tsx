'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { ResourceCard } from '@/components/cards';
import { TagFilter } from '@/components/ui';
import { LibraryFrontmatter, ContentItem } from '@/lib/mdx';

interface LibraryClientProps {
    items: ContentItem<LibraryFrontmatter>[];
    allTags: string[];
}

export function LibraryClient({ items, allTags }: LibraryClientProps) {
    const t = useTranslations('library');
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
        <div className="py-12 sm:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl sm:text-4xl font-bold text-surface-900 mb-4">
                        {t('title')}
                    </h1>
                    <p className="text-lg text-surface-600 max-w-2xl mx-auto">
                        {t('description')}
                    </p>
                </div>

                {/* Type Filter */}
                <div className="flex flex-wrap gap-2 mb-6">
                    <button
                        onClick={() => setSelectedType('')}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedType === ''
                                ? 'bg-primary-600 text-white'
                                : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                            }`}
                    >
                        {t('filterAll')}
                    </button>
                    {types.map((type) => (
                        <button
                            key={type}
                            onClick={() => setSelectedType(selectedType === type ? '' : type)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedType === type
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                                }`}
                        >
                            {t(`types.${type}`)}
                        </button>
                    ))}
                </div>

                {/* Tag Filter */}
                <div className="mb-10">
                    <TagFilter
                        tags={allTags}
                        selectedTags={selectedTags}
                        onChange={setSelectedTags}
                    />
                </div>

                {/* Resources Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
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
                        {t('filterAll')}
                    </div>
                )}
            </div>
        </div>
    );
}

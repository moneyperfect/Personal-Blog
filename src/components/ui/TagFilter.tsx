'use client';

import { useTranslations } from 'next-intl';

interface TagFilterProps {
    tags: string[];
    selectedTags: string[];
    onChange: (tags: string[]) => void;
    allLabel?: string;
}

export function TagFilter({ tags, selectedTags, onChange, allLabel }: TagFilterProps) {
    const t = useTranslations('products');

    const handleTagClick = (tag: string) => {
        if (selectedTags.includes(tag)) {
            onChange(selectedTags.filter((t) => t !== tag));
        } else {
            onChange([...selectedTags, tag]);
        }
    };

    const handleClearAll = () => {
        onChange([]);
    };

    return (
        <div className="flex flex-wrap gap-2">
            <button
                onClick={handleClearAll}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${selectedTags.length === 0
                        ? 'bg-primary-600 text-white shadow-sm'
                        : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                    }`}
            >
                {allLabel || t('filterAll')}
            </button>
            {tags.map((tag) => (
                <button
                    key={tag}
                    onClick={() => handleTagClick(tag)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${selectedTags.includes(tag)
                            ? 'bg-primary-600 text-white shadow-sm'
                            : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                        }`}
                >
                    {tag}
                </button>
            ))}
        </div>
    );
}

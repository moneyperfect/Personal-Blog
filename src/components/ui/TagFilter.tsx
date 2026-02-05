'use client';

import { useTranslations } from 'next-intl';
import { ChipButton } from './Chip';

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
            <ChipButton
                onClick={handleClearAll}
                active={selectedTags.length === 0}
                aria-pressed={selectedTags.length === 0}
                type="button"
            >
                {allLabel || t('filterAll')}
            </ChipButton>
            {tags.map((tag) => (
                <ChipButton
                    key={tag}
                    onClick={() => handleTagClick(tag)}
                    active={selectedTags.includes(tag)}
                    aria-pressed={selectedTags.includes(tag)}
                    type="button"
                >
                    {tag}
                </ChipButton>
            ))}
        </div>
    );
}

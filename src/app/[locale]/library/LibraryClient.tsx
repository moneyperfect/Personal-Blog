'use client';

import { useTranslations } from 'next-intl';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ResourceCard } from '@/components/cards';
import { ChipButton } from '@/components/ui';
import { LibraryFrontmatter, ContentItem, NoteFrontmatter } from '@/lib/mdx';

interface LibraryClientProps {
    resources: ContentItem<LibraryFrontmatter | NoteFrontmatter>[];
    locale: string;
}

// Categories mix of Library types and Note categories
const rawCategories = [
    'AI', 'Bug修复', 'MVP', 'SOP', '上线', '产品', '代码审查',
    '写作', '开发', '效率', '文案', '检查清单', '模板', '用户研究',
    '竞品分析', '编程', '营销', '访谈'
];
// Deduplicate and filter
const categories = Array.from(new Set(rawCategories.map(c => c.trim()))).sort();

export function LibraryClient({ resources, locale }: LibraryClientProps) {
    const t = useTranslations('library');
    const common = useTranslations('common');
    const [selectedCategory, setSelectedCategory] = useState<string | 'all'>('all');

    const filteredItems = useMemo(() => {
        return resources.filter(item => {
            const isNote = item.frontmatter.type === 'note' || (item.frontmatter as NoteFrontmatter).category;
            const itemType = item.frontmatter.type;
            const itemCategory = (item.frontmatter as NoteFrontmatter).category;

            // Category filter
            if (selectedCategory !== 'all') {
                // Check if selected category matches Note category (case-insensitive)
                const categoryMatch = itemCategory && itemCategory.toLowerCase() === selectedCategory.toLowerCase();
                // Check if selected category matches Library type
                const typeMatch = itemType === selectedCategory || (selectedCategory === '模板' && itemType === 'template') || (selectedCategory === '检查清单' && itemType === 'checklist');

                if (!categoryMatch && !typeMatch) return false;
            }

            return true;
        });
    }, [resources, selectedCategory]);

    const getCategoryLabel = (cat: string) => {
        if (cat === 'all') return t('filterAll');
        return cat;
    };

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

                    {/* Category Filter Chips */}
                    <div className="flex flex-wrap gap-3 mb-8 leading-relaxed">
                        <ChipButton
                            onClick={() => setSelectedCategory('all')}
                            active={selectedCategory === 'all'}
                            aria-pressed={selectedCategory === 'all'}
                            type="button"
                        >
                            {t('filterAll')}
                        </ChipButton>
                        {categories.map((cat) => (
                            <ChipButton
                                key={cat}
                                onClick={() => setSelectedCategory(selectedCategory === cat ? 'all' : cat)}
                                active={selectedCategory === cat}
                                aria-pressed={selectedCategory === cat}
                                type="button"
                            >
                                {cat}
                            </ChipButton>
                        ))}
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredItems.map((item) => {
                            // Check if it's a Note
                            if (item.frontmatter.type === 'note' || (item.frontmatter as NoteFrontmatter).category) {
                                const note = item as ContentItem<NoteFrontmatter>;
                                return (
                                    <div
                                        key={`note-${note.slug}`}
                                        className="bg-white rounded-google-lg border border-surface-300 p-5 hover:shadow-elevated-1 transition-all flex flex-col"
                                    >
                                        {/* Category & Tags */}
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {note.frontmatter.category && (
                                                <span className="text-xs text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full font-medium">
                                                    {getCategoryLabel(note.frontmatter.category)}
                                                </span>
                                            )}
                                            {note.frontmatter.tags.slice(0, 3).map((tag) => (
                                                <span key={tag} className="text-xs text-surface-500 bg-surface-100 px-2 py-0.5 rounded-full">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-lg font-semibold text-surface-900 mb-2 line-clamp-2">
                                            {note.frontmatter.title}
                                        </h3>

                                        {/* Summary */}
                                        <p className="text-surface-600 text-sm line-clamp-2 mb-3 flex-grow">
                                            {note.frontmatter.summary || (locale === 'zh' ? '暂无描述' : '説明なし')}
                                        </p>

                                        {/* Date & Action */}
                                        <div className="flex items-center justify-between mt-auto pt-3 border-t border-surface-100">
                                            <span className="text-xs text-surface-500">{new Date(note.frontmatter.updatedAt).toLocaleDateString()}</span>
                                            <Link
                                                href={`/${locale}/notes/${note.slug}`}
                                                className="text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline"
                                            >
                                                {locale === 'zh' ? '查看详情 →' : '詳細を見る →'}
                                            </Link>
                                        </div>
                                    </div>
                                );
                            } else {
                                // It's a Library Item
                                return (
                                    <ResourceCard
                                        key={`mdx-${item.slug}`}
                                        slug={item.slug}
                                        frontmatter={item.frontmatter as LibraryFrontmatter}
                                    />
                                );
                            }
                        })}
                    </div>

                    {/* Empty State */}
                    {filteredItems.length === 0 && (
                        <div className="text-center py-16 text-surface-600 bg-surface-50 rounded-google-lg border border-surface-200">
                            <p className="font-medium mb-2">{common('notFound')}</p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

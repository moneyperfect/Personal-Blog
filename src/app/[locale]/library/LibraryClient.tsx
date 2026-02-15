'use client';

import { useTranslations } from 'next-intl';
import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { ResourceCard } from '@/components/cards';
import { TagFilter, ChipButton } from '@/components/ui';
import { LibraryFrontmatter, ContentItem } from '@/lib/mdx';
import { NotionNote, CategoryType } from '@/lib/notion';

interface LibraryClientProps {
    mdxItems: ContentItem<LibraryFrontmatter>[];
    notionItems: NotionNote[];
    allTags: string[];
    locale: string;
}

// Map category values to display labels
const categoryLabels: Record<string, { zh: string; ja: string }> = {
    template: { zh: '模板', ja: 'テンプレート' },
    checklist: { zh: '清单', ja: 'チェックリスト' },
    sop: { zh: 'SOP', ja: 'SOP' },
    prompt: { zh: 'Prompt', ja: 'Prompt' },
    note: { zh: '笔记', ja: 'ノート' },
    uncategorized: { zh: '未分类', ja: '未分類' },
};

const categories: CategoryType[] = ['template', 'checklist', 'sop', 'prompt', 'note'];

export function LibraryClient({ mdxItems, notionItems, allTags, locale }: LibraryClientProps) {
    const t = useTranslations('library');
    const common = useTranslations('common');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'all'>('all');

    // Debug: log Notion items for troubleshooting
    useEffect(() => {
        if (notionItems.length > 0) {
            console.log('Notion items loaded:', notionItems.length);
            notionItems.forEach((item, idx) => {
                console.log(`  [${idx}] ${item.title}`, {
                    category: item.category,
                    type: item.type,
                    language: item.language,
                    tags: item.tags
                });
            });
        }
    }, [notionItems]);

    // Count uncategorized Notion items
    const uncategorizedCount = useMemo(() =>
        notionItems.filter(item => {
            if (!item.category) return true;
            // Check if normalized category is in categories list
            const normalizedCat = item.category.toLowerCase() as CategoryType;
            return !categories.includes(normalizedCat);
        }).length,
        [notionItems]
    );

    // Filter Notion items by category and tags
    const filteredNotionItems = useMemo(() => {
        return notionItems.filter(item => {
            // Category filter (case-insensitive)
            if (selectedCategory !== 'all') {
                if (!item.category) return false;
                if (item.category.toLowerCase() !== selectedCategory.toLowerCase()) return false;
            }

            // Tag filter
            if (selectedTags.length > 0) {
                if (!selectedTags.some(tag => item.tags.includes(tag))) return false;
            }

            return true;
        });
    }, [notionItems, selectedCategory, selectedTags]);

    // Filter MDX items by category and tags (for backward compatibility)
    const filteredMdxItems = useMemo(() => {
        return mdxItems.filter(item => {
            // If viewing a category that maps to MDX type
            if (selectedCategory !== 'all' && selectedCategory !== 'note') {
                if (item.frontmatter.type !== selectedCategory) return false;
            } else if (selectedCategory === 'note') {
                // Notes are from Notion, not MDX
                return false;
            }

            // Tag filter
            if (selectedTags.length > 0) {
                if (!selectedTags.some(tag => item.frontmatter.tags.includes(tag))) return false;
            }

            return true;
        });
    }, [mdxItems, selectedCategory, selectedTags]);

    // Combine all unique tags
    const combinedTags = useMemo(() => {
        const notionTags = notionItems.flatMap(n => n.tags);
        return Array.from(new Set([...allTags, ...notionTags])).sort();
    }, [allTags, notionItems]);

    const getCategoryLabel = (cat: CategoryType | 'all' | 'uncategorized') => {
        if (cat === 'all') return t('filterAll');
        // Normalize category for label lookup
        const normalizedCat = cat.toLowerCase();
        const labels = categoryLabels[normalizedCat];
        return labels ? (locale === 'zh' ? labels.zh : labels.ja) : cat;
    };

    const isNotionNote = (item: NotionNote) => item.type === 'note' || item.category === 'note';

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
                    <div className="flex flex-wrap gap-2 mb-4">
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
                                {getCategoryLabel(cat)}
                            </ChipButton>
                        ))}
                    </div>

                    {/* Uncategorized warning */}
                    {uncategorizedCount > 0 && (
                        <div className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-google px-3 py-2 mb-4">
                            {locale === 'zh'
                                ? `有 ${uncategorizedCount} 条内容未设置 Category，请在 Notion 中完善分类`
                                : `${uncategorizedCount}件のコンテンツにCategoryが設定されていません。Notionで分類を設定してください`}
                        </div>
                    )}

                    {/* Tag Filter */}
                    <div className="mb-6">
                        <TagFilter
                            tags={combinedTags}
                            selectedTags={selectedTags}
                            onChange={setSelectedTags}
                        />
                    </div>

                    {/* Content Grid - Mixed MDX and Notion items */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* MDX Resource Cards */}
                        {filteredMdxItems.map((item) => (
                            <ResourceCard
                                key={`mdx-${item.slug}`}
                                slug={item.slug}
                                frontmatter={item.frontmatter}
                            />
                        ))}

                        {/* Notion Items as Cards */}
                        {filteredNotionItems.map((item) => (
                            <div
                                key={`notion-${item.id}`}
                                className="bg-white rounded-google-lg border border-surface-300 p-5 hover:shadow-elevated-1 transition-all flex flex-col"
                            >
                                {/* Category & Tags */}
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {item.category && (
                                        <span className="text-xs text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full font-medium">
                                            {getCategoryLabel(item.category)}
                                        </span>
                                    )}
                                    {item.tags.slice(0, 3).map((tag) => (
                                        <span key={tag} className="text-xs text-surface-500 bg-surface-100 px-2 py-0.5 rounded-full">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>

                                {/* Title */}
                                <h3 className="text-lg font-semibold text-surface-900 mb-2 line-clamp-2">
                                    {item.title}
                                </h3>

                                {/* Summary */}
                                <p className="text-surface-600 text-sm line-clamp-2 mb-3 flex-grow">
                                    {item.summary || (locale === 'zh' ? '暂无描述' : '説明なし')}
                                </p>

                                {/* Date & Action */}
                                <div className="flex items-center justify-between mt-auto pt-3 border-t border-surface-100">
                                    <span className="text-xs text-surface-500">{item.date}</span>
                                    {isNotionNote(item) ? (
                                        <Link
                                            href={`/${locale}/notes/${item.slug}`}
                                            className="text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline"
                                        >
                                            {locale === 'zh' ? '查看详情 →' : '詳細を見る →'}
                                        </Link>
                                    ) : (
                                        <Link
                                            href={`/${locale}/notes/${item.slug}`}
                                            className="text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline"
                                        >
                                            {locale === 'zh' ? '查看 →' : '見る →'}
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {filteredMdxItems.length === 0 && filteredNotionItems.length === 0 && (
                        <div className="text-center py-16 text-surface-600 bg-surface-50 rounded-google-lg border border-surface-200">
                            <p className="font-medium mb-2">{common('notFound')}</p>
                            <p className="text-sm">
                                {locale === 'zh'
                                    ? '请在 Notion 中确认 Published、Language、Category 配置正确'
                                    : 'NotionでPublished、Language、Categoryの設定を確認してください'}
                            </p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

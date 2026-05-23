'use client';

import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { TagFilter } from '@/components/ui';
import { BlogItem } from '@/lib/blog';
import { useLocale } from 'next-intl';

interface BlogClientProps {
    posts: BlogItem[];
    allTags: string[];
    allCategories: string[];
    initialTag?: string;
    initialCategory?: string;
}

export function BlogClient({
    posts,
    allTags,
    allCategories,
    initialTag,
    initialCategory,
}: BlogClientProps) {
    const locale = useLocale();
    const t = useTranslations('blog');
    const common = useTranslations('common');
    const [selectedTags, setSelectedTags] = useState<string[]>(
        initialTag ? [initialTag] : []
    );
    const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
        initialCategory
    );

    const filteredPosts = useMemo(() => {
        let result = posts;

        // Filter by category first
        if (selectedCategory) {
            result = result.filter(
                (post) => post.frontmatter.category === selectedCategory
            );
        }

        // Then filter by tags
        if (selectedTags.length > 0) {
            result = result.filter((post) =>
                selectedTags.some((tag) => post.frontmatter.tags.includes(tag))
            );
        }

        return result;
    }, [posts, selectedCategory, selectedTags]);

    return (
        <div className="page-shell">
            <div className="page-container page-width">
                <header className="page-header">
                    <h1 className="page-title">{t('title')}</h1>
                    <p className="page-description">{t('description')}</p>
                </header>

                <section className="section">
                    {/* Category filter */}
                    {allCategories.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                            <button
                                type="button"
                                onClick={() => setSelectedCategory(undefined)}
                                className={`chip text-[11px] ${
                                    !selectedCategory ? 'chip-active' : 'chip-muted'
                                }`}
                            >
                                {t('filterAll')}
                            </button>
                            {allCategories.map((cat) => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() =>
                                        setSelectedCategory(
                                            selectedCategory === cat ? undefined : cat
                                        )
                                    }
                                    className={`chip text-[11px] ${
                                        selectedCategory === cat
                                            ? 'chip-active'
                                            : 'chip-muted'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Tag filter */}
                    <div className="mb-6">
                        <TagFilter
                            tags={allTags}
                            selectedTags={selectedTags}
                            onChange={setSelectedTags}
                        />
                    </div>

                    <div className="space-y-4">
                        {filteredPosts.map((post) => (
                            <Link
                                key={post.slug}
                                href={`/${locale}/blog/${post.slug}`}
                                className="group block list-card"
                            >
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {post.frontmatter.category && (
                                        <span className="chip chip-active text-[11px]">
                                            {post.frontmatter.category}
                                        </span>
                                    )}
                                    {post.frontmatter.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="chip chip-muted text-[11px]"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                                <h2 className="text-lg font-semibold text-surface-900 group-hover:text-accent mb-2">
                                    {post.frontmatter.title}
                                </h2>
                                <p className="text-surface-600 line-clamp-2">
                                    {post.frontmatter.description}
                                </p>
                                <span className="text-sm text-surface-500 mt-2 block">
                                    {new Date(
                                        post.frontmatter.date
                                    ).toLocaleDateString()}
                                </span>
                            </Link>
                        ))}
                    </div>

                    {filteredPosts.length === 0 && (
                        <div className="text-center py-16 text-surface-600 card p-6">
                            <p className="font-medium">{common('notFound')}</p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

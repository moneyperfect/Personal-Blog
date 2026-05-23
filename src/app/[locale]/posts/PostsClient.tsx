'use client';

import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { TagFilter } from '@/components/ui';
import { PostItem } from '@/lib/posts';
import { useLocale } from 'next-intl';

interface PostsClientProps {
    posts: PostItem[];
    allTags: string[];
    initialTag?: string;
}

export function PostsClient({ posts, allTags, initialTag }: PostsClientProps) {
    const locale = useLocale();
    const t = useTranslations('posts');
    const common = useTranslations('common');
    const [selectedTags, setSelectedTags] = useState<string[]>(
        initialTag ? [initialTag] : []
    );

    const filteredPosts = useMemo(() => {
        if (selectedTags.length === 0) return posts;

        return posts.filter((post) =>
            selectedTags.some((tag) => post.frontmatter.tags.includes(tag))
        );
    }, [posts, selectedTags]);

    return (
        <div className="page-shell">
            <div className="page-container page-width">
                <header className="page-header">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h1 className="page-title">{t('title')}</h1>
                            <p className="page-description">{t('description')}</p>
                        </div>
                    </div>
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
                        {filteredPosts.map((post) => (
                            <Link
                                key={post.slug}
                                href={`/${locale}/posts/${post.slug}`}
                                className="group block list-card"
                            >
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {post.frontmatter.tags.map((tag) => (
                                        <span key={tag} className="chip chip-muted text-[11px]">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                                <h2 className="text-lg font-semibold text-surface-900 group-hover:text-primary-600 mb-2">
                                    {post.frontmatter.title}
                                </h2>
                                <p className="text-surface-600 line-clamp-2">
                                    {post.frontmatter.description}
                                </p>
                                <span className="text-sm text-surface-500 mt-2 block">
                                    {new Date(post.frontmatter.date).toLocaleDateString()}
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

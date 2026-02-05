'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useState } from 'react';
import { ProductCard } from '@/components/cards';
import { TagFilter } from '@/components/ui';
import { ProductFrontmatter, ContentItem } from '@/lib/mdx';

interface ProductsClientProps {
    products: ContentItem<ProductFrontmatter>[];
    allTags: string[];
}

export function ProductsClient({ products, allTags }: ProductsClientProps) {
    const t = useTranslations('products');
    const common = useTranslations('common');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const filteredProducts = selectedTags.length === 0
        ? products
        : products.filter((product) =>
            selectedTags.some((tag) => product.frontmatter.tags.includes(tag))
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filteredProducts.map((product) => (
                            <ProductCard
                                key={product.slug}
                                slug={product.slug}
                                frontmatter={product.frontmatter}
                            />
                        ))}
                    </div>

                    {filteredProducts.length === 0 && (
                        <div className="text-center py-16 text-surface-600">
                            {common('notFound')}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

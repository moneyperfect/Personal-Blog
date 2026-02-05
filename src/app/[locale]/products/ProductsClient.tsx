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
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const filteredProducts = selectedTags.length === 0
        ? products
        : products.filter((product) =>
            selectedTags.some((tag) => product.frontmatter.tags.includes(tag))
        );

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

                {/* Filters */}
                <div className="mb-10">
                    <TagFilter
                        tags={allTags}
                        selectedTags={selectedTags}
                        onChange={setSelectedTags}
                    />
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                        No products found matching your criteria.
                    </div>
                )}
            </div>
        </div>
    );
}

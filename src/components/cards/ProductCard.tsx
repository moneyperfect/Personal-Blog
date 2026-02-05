'use client';

import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { ProductFrontmatter } from '@/lib/mdx';

interface ProductCardProps {
    slug: string;
    frontmatter: ProductFrontmatter;
}

export function ProductCard({ slug, frontmatter }: ProductCardProps) {
    const t = useTranslations('products');
    const locale = useLocale();

    return (
        <Link
            href={`/${locale}/products/${slug}`}
            className="group block card card-hover p-6"
        >
            <div className="flex flex-col h-full">
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                    {frontmatter.tags.slice(0, 3).map((tag) => (
                        <span
                            key={tag}
                            className="chip chip-muted"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-surface-900 group-hover:text-primary-600 transition-colors mb-2">
                    {frontmatter.title}
                </h3>

                {/* Summary */}
                <p className="text-sm text-surface-600 line-clamp-2 mb-4 flex-grow">
                    {frontmatter.summary}
                </p>

                {/* Price and CTA */}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-surface-200">
                    <span className="text-lg font-semibold text-primary-600">
                        {frontmatter.price}
                    </span>
                    <span className="text-sm font-medium text-primary-600 group-hover:underline">
                        {t('buyNow')}
                    </span>
                </div>
            </div>
        </Link>
    );
}

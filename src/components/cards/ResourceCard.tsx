'use client';

import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { LibraryFrontmatter } from '@/lib/mdx';
import { CopyButton } from '../ui/CopyButton';
import { DownloadButton } from '../ui/DownloadButton';
import { Chip } from '../ui/Chip';
import { Card } from '../ui/Card';

interface ResourceCardProps {
    slug: string;
    frontmatter: LibraryFrontmatter;
}

export function ResourceCard({ slug, frontmatter }: ResourceCardProps) {
    const t = useTranslations('library');
    const locale = useLocale();

    return (
        <Card className="p-5">
            <div className="flex flex-col h-full">
                {/* Type badge */}
                <div className="flex items-center gap-2 mb-3">
                    <Chip active>{t(`types.${frontmatter.type}`)}</Chip>
                </div>

                {/* Title */}
                <Link
                    href={`/${locale}/library/${slug}`}
                    className="text-base font-semibold text-surface-900 hover:text-primary-600 transition-colors mb-2"
                >
                    {frontmatter.title}
                </Link>

                {/* Summary */}
                <p className="text-sm text-surface-600 line-clamp-2 mb-4 flex-grow">
                    {frontmatter.summary}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                    {frontmatter.tags.slice(0, 3).map((tag) => (
                        <Chip key={tag} muted>
                            {tag}
                        </Chip>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-auto">
                    {frontmatter.copyText && (
                        <CopyButton
                            text={frontmatter.copyText}
                            slug={slug}
                            title={frontmatter.title}
                        />
                    )}
                    {frontmatter.downloadUrl && (
                        <DownloadButton
                            url={frontmatter.downloadUrl}
                            slug={slug}
                            title={frontmatter.title}
                        />
                    )}
                </div>
            </div>
        </Card>
    );
}

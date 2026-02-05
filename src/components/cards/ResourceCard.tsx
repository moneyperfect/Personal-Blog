'use client';

import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { LibraryFrontmatter } from '@/lib/mdx';
import { CopyButton } from '../ui/CopyButton';
import { DownloadButton } from '../ui/DownloadButton';

interface ResourceCardProps {
    slug: string;
    frontmatter: LibraryFrontmatter;
}

const typeIcons: Record<string, string> = {
    template: '📄',
    checklist: '✅',
    sop: '📋',
    prompt: '💡',
};

export function ResourceCard({ slug, frontmatter }: ResourceCardProps) {
    const t = useTranslations('library');
    const locale = useLocale();

    return (
        <div className="bg-white rounded-google-lg border border-surface-300 p-5 hover:shadow-elevated-1 transition-all duration-200">
            <div className="flex flex-col h-full">
                {/* Type badge and icon */}
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">{typeIcons[frontmatter.type]}</span>
                    <span className="px-2 py-0.5 text-xs font-medium bg-primary-50 text-primary-700 rounded-full">
                        {t(`types.${frontmatter.type}`)}
                    </span>
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
                        <span
                            key={tag}
                            className="px-2 py-0.5 text-xs bg-surface-100 text-surface-600 rounded-full"
                        >
                            {tag}
                        </span>
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
                    <Link
                        href={`/${locale}/library/${slug}`}
                        className="ml-auto text-sm font-medium text-primary-600 hover:underline"
                    >
                        →
                    </Link>
                </div>
            </div>
        </div>
    );
}

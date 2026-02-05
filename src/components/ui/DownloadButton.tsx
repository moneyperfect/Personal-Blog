'use client';

import { useTranslations } from 'next-intl';
import { trackResourceDownload } from '@/lib/analytics';
import { ButtonLink } from './Button';

interface DownloadButtonProps {
    url: string;
    slug: string;
    title: string;
    className?: string;
}

export function DownloadButton({ url, slug, title, className = '' }: DownloadButtonProps) {
    const t = useTranslations('library');

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        trackResourceDownload(slug, title);
    };

    return (
        <ButtonLink
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClick}
            variant="primary"
            className={`px-3 py-1.5 text-xs ${className}`}
        >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {t('download')}
        </ButtonLink>
    );
}

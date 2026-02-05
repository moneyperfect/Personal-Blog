'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { trackResourceCopy } from '@/lib/analytics';
import { Button } from './Button';

interface CopyButtonProps {
    text: string;
    slug: string;
    title: string;
    className?: string;
}

export function CopyButton({ text, slug, title, className = '' }: CopyButtonProps) {
    const t = useTranslations('library');
    const [copied, setCopied] = useState(false);

    const handleCopy = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            trackResourceCopy(slug, title);

            setTimeout(() => {
                setCopied(false);
            }, 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <Button
            type="button"
            onClick={handleCopy}
            variant={copied ? 'success' : 'tonal'}
            className={`px-3 py-1.5 text-xs ${className}`}
        >
            {copied ? (
                <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {t('copied')}
                </>
            ) : (
                <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    {t('copy')}
                </>
            )}
        </Button>
    );
}

'use client';

import Link from 'next/link';
import { trackAppEvent } from '@/lib/analytics';

interface NoteCtaActionsProps {
    locale: string;
    slug: string;
}

export default function NoteCtaActions({ locale, slug }: NoteCtaActionsProps) {
    const isZh = locale === 'zh';

    return (
        <div className="flex flex-wrap gap-3">
            <Link
                href={`/${locale}/work-with-me`}
                className="btn btn-primary"
                onClick={() => {
                    trackAppEvent('note_cta_click', {
                        category: 'content',
                        label: 'work_with_me',
                        metadata: { slug, locale, destination: 'work-with-me' },
                    });
                }}
            >
                {isZh ? '与我合作' : 'Work with me'}
            </Link>
            <Link
                href={`/${locale}/products`}
                className="btn btn-tonal"
                onClick={() => {
                    trackAppEvent('note_cta_click', {
                        category: 'content',
                        label: 'view_products',
                        metadata: { slug, locale, destination: 'products' },
                    });
                }}
            >
                {isZh ? '查看产品' : 'View products'}
            </Link>
        </div>
    );
}

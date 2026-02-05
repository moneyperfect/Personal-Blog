'use client';

import { trackPurchaseClick } from '@/lib/analytics';

interface ProductDetailClientProps {
    slug: string;
    title: string;
    purchaseUrl: string;
    locale: string;
    large?: boolean;
}

export function ProductDetailClient({
    slug,
    title,
    purchaseUrl,
    locale,
    large = false
}: ProductDetailClientProps) {
    const handleClick = () => {
        trackPurchaseClick(slug, title);
    };

    const buttonText = locale === 'zh' ? '立即购买' : '今すぐ購入';

    return (
        <a
            href={purchaseUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClick}
            className={`btn btn-primary ${large ? 'px-8 py-4 text-base sm:text-lg' : 'px-6 py-3'}`}
        >
            {buttonText}
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
        </a>
    );
}

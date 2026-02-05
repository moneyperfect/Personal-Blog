'use client';

import Script from 'next/script';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export function GoogleAnalytics() {
    if (!GA_ID) return null;

    return (
        <>
        <Script
        src= {`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
}
strategy = "afterInteractive"
    />
    <Script id="google-analytics" strategy = "afterInteractive" >
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
</Script>
    </>
  );
}

// Analytics event helpers
export function trackEvent(
    action: string,
    category: string,
    label?: string,
    value?: number
) {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value,
        });
    }
}

export function trackProductView(productSlug: string, productTitle: string) {
    trackEvent('view_item', 'product', `${productSlug}: ${productTitle}`);
}

export function trackPurchaseClick(productSlug: string, productTitle: string) {
    trackEvent('begin_checkout', 'product', `${productSlug}: ${productTitle}`);
}

export function trackWaitlistSubmit(source: string) {
    trackEvent('generate_lead', 'waitlist', source);
}

export function trackResourceCopy(resourceSlug: string, resourceTitle: string) {
    trackEvent('copy_content', 'library', `${resourceSlug}: ${resourceTitle}`);
}

export function trackResourceDownload(resourceSlug: string, resourceTitle: string) {
    trackEvent('download', 'library', `${resourceSlug}: ${resourceTitle}`);
}

// TypeScript declaration for gtag
declare global {
    interface Window {
        gtag: (
            command: 'event' | 'config' | 'js',
            targetId: string | Date,
            config?: Record<string, unknown>
        ) => void;
        dataLayer: unknown[];
    }
}

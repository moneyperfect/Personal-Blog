'use client';

import Script from 'next/script';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const ANALYTICS_SESSION_KEY = 'app-analytics-session-id';

interface TrackAppEventOptions {
    category?: string;
    label?: string;
    value?: number;
    metadata?: Record<string, unknown>;
    path?: string;
}

function getSessionId(): string {
    if (typeof window === 'undefined') return 'server';

    const cached = window.localStorage.getItem(ANALYTICS_SESSION_KEY);
    if (cached) return cached;

    const generated = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

    window.localStorage.setItem(ANALYTICS_SESSION_KEY, generated);
    return generated;
}

function postAnalyticsEvent(eventName: string, options: TrackAppEventOptions) {
    if (typeof window === 'undefined') return;

    const payload = {
        sessionId: getSessionId(),
        eventName,
        eventCategory: options.category,
        eventLabel: options.label,
        path: options.path || window.location.pathname,
        value: options.value,
        metadata: options.metadata || {},
    };

    const body = JSON.stringify(payload);

    if (navigator.sendBeacon) {
        const blob = new Blob([body], { type: 'application/json' });
        navigator.sendBeacon('/api/analytics', blob);
        return;
    }

    fetch('/api/analytics', {
        method: 'POST',
        body,
        headers: { 'content-type': 'application/json' },
        keepalive: true,
    }).catch(() => {
        // Ignore analytics network errors
    });
}

export function GoogleAnalytics() {
    if (!GA_ID) return null;

    return (
        <>
            <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
                strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
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

export function trackAppEvent(eventName: string, options: TrackAppEventOptions = {}) {
    if (typeof window === 'undefined') return;

    if (window.gtag) {
        window.gtag('event', eventName, {
            event_category: options.category,
            event_label: options.label,
            value: options.value,
        });
    }

    postAnalyticsEvent(eventName, options);
}

// Backward-compatible helper
export function trackEvent(
    action: string,
    category: string,
    label?: string,
    value?: number
) {
    trackAppEvent(action, { category, label, value });
}

export function trackProductView(productSlug: string, productTitle: string) {
    trackAppEvent('view_item', {
        category: 'product',
        label: `${productSlug}: ${productTitle}`,
        metadata: { productSlug },
    });
}

export function trackPurchaseClick(productSlug: string, productTitle: string) {
    trackAppEvent('begin_checkout', {
        category: 'product',
        label: `${productSlug}: ${productTitle}`,
        metadata: { productSlug },
    });
}

export function trackWaitlistSubmit(source: string) {
    trackAppEvent('generate_lead', {
        category: 'waitlist',
        label: source,
    });
}

export function trackResourceCopy(resourceSlug: string, resourceTitle: string) {
    trackAppEvent('copy_content', {
        category: 'library',
        label: `${resourceSlug}: ${resourceTitle}`,
        metadata: { resourceSlug },
    });
}

export function trackResourceDownload(resourceSlug: string, resourceTitle: string) {
    trackAppEvent('download', {
        category: 'library',
        label: `${resourceSlug}: ${resourceTitle}`,
        metadata: { resourceSlug },
    });
}

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

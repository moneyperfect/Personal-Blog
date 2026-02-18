'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useReportWebVitals } from 'next/web-vitals';

export function WebVitalsReporter() {
    const pathname = usePathname();

    useReportWebVitals((metric) => {
        const body = JSON.stringify({
            ...metric,
            path: pathname,
            timestamp: Date.now(),
        });

        if (navigator.sendBeacon) {
            const blob = new Blob([body], { type: 'application/json' });
            navigator.sendBeacon('/api/rum', blob);
            return;
        }

        fetch('/api/rum', {
            method: 'POST',
            body,
            headers: { 'content-type': 'application/json' },
            keepalive: true,
        }).catch(() => {
            // swallow client-side metric send errors
        });
    });

    useEffect(() => undefined, []);

    return null;
}

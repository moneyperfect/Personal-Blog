'use client';

import { useEffect } from 'react';

export function PwaRegister() {
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js').catch(() => {
                    // Swallow registration errors; PWA should be best-effort.
                });
            });
        }
    }, []);

    return null;
}

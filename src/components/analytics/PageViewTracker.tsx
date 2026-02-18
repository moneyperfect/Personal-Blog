'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackAppEvent } from '@/lib/analytics';

export function PageViewTracker() {
    const pathname = usePathname();

    useEffect(() => {
        if (!pathname || pathname.startsWith('/admin')) return;

        trackAppEvent('page_view', {
            category: 'navigation',
            label: pathname,
            path: pathname,
        });
    }, [pathname]);

    return null;
}

// The standalone homepage does not mount the React analytics components.
// Keep its existing page_view contract and public GA configuration available
// without shipping the Next.js runtime with the WebGL scene.
export const dynamic = 'force-dynamic';

export function GET() {
    const gaId = JSON.stringify(process.env.NEXT_PUBLIC_GA_ID || null);
    const script = `(() => {
    if (window.__nasHomeAnalyticsStarted) return;
    window.__nasHomeAnalyticsStarted = true;

    const gaId = ${gaId};
    if (gaId) {
        window.dataLayer = window.dataLayer || [];
        window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
        window.gtag('js', new Date());
        window.gtag('config', gaId);
        const tag = document.createElement('script');
        tag.async = true;
        tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(gaId);
        document.head.appendChild(tag);
    }

    const path = window.location.pathname;
    if (!path || path.startsWith('/admin')) return;

    try {
        const key = 'app-analytics-session-id';
        let sessionId = window.localStorage.getItem(key);
        if (!sessionId) {
            sessionId = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
                ? crypto.randomUUID()
                : Date.now() + '-' + Math.random().toString(36).slice(2, 10);
            window.localStorage.setItem(key, sessionId);
        }
        const body = JSON.stringify({
            sessionId,
            eventName: 'page_view',
            eventCategory: 'navigation',
            eventLabel: path,
            path,
            metadata: {},
        });
        if (navigator.sendBeacon) {
            navigator.sendBeacon('/api/analytics', new Blob([body], { type: 'application/json' }));
        } else {
            fetch('/api/analytics', {
                method: 'POST',
                body,
                headers: { 'content-type': 'application/json' },
                keepalive: true,
            }).catch(() => {});
        }
    } catch {
        // Match the rest of the site: analytics must not interrupt interaction.
    }
})();`;

    return new Response(script, {
        headers: {
            'Content-Type': 'application/javascript; charset=utf-8',
            'Cache-Control': 'private, no-store, max-age=0',
            'X-Content-Type-Options': 'nosniff',
        },
    });
}

import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Only the locale landing page uses the self-contained WebGL experience.
    // Blog, project, account and API routes keep their existing Next.js pages.
    const homeLocale = pathname.match(/^\/(zh|ja)\/?$/)?.[1];
    if (homeLocale) {
        const destination = request.nextUrl.clone();
        destination.pathname = `/experience/${homeLocale}.html`;
        return NextResponse.rewrite(destination);
    }

    // Skip i18n processing for /admin and /api paths
    if (pathname.startsWith('/admin') || pathname.startsWith('/api')) {
        return NextResponse.next();
    }

    return intlMiddleware(request);
}

export const config = {
    matcher: [
        // Match all paths except Next.js internals and static files
        '/((?!_next|icons|images|.*\\..*).*)'
    ]
};

import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
    // Match all paths except:
    // - /admin (admin panel)
    // - /api (API routes)
    // - /_next (Next.js internals)
    // - /icons, /images, etc. (static files)
    // - files with extensions (.ico, .png, .jpg, etc.)
    matcher: [
        '/',
        '/(zh|ja)/:path*',
        '/((?!admin|api|_next|icons|images|.*\\..*).*)'
    ]
};

import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 跳过 /admin 和 /api 路径，不做 i18n 处理
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

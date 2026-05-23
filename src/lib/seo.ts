import type { Metadata } from 'next';
import type { Locale } from '@/i18n/routing';

export const canonicalSiteUrl = 'https://nasbuild.dev';

const legacyOrPlaceholderHosts = new Set([
    'example.com',
    'www.example.com',
    'yourdomain.com',
    'www.yourdomain.com',
]);

export function getSiteUrl() {
    return canonicalSiteUrl;
}

export function absoluteUrl(pathname: string) {
    if (/^https?:\/\//i.test(pathname)) {
        const parsed = new URL(pathname);
        if (legacyOrPlaceholderHosts.has(parsed.hostname)) {
            return `${getSiteUrl()}${parsed.pathname}${parsed.search}${parsed.hash}`;
        }

        return pathname;
    }

    const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
    return `${getSiteUrl()}${path}`;
}

function normalizePathname(pathname: string) {
    if (!pathname || pathname === '/') {
        return '';
    }

    const normalized = pathname.startsWith('/')
        ? pathname
        : `/${pathname}`;

    return normalized.endsWith('/') ? normalized.slice(0, -1) : normalized;
}

export function localeAlternates(pathnameWithoutLocale: string, locale: Locale | string) {
    const normalized = normalizePathname(pathnameWithoutLocale);

    return {
        canonical: absoluteUrl(`/${locale}${normalized}`),
        languages: {
            zh: absoluteUrl(`/zh${normalized}`),
            ja: absoluteUrl(`/ja${normalized}`),
            'x-default': absoluteUrl(`/zh${normalized}`),
        },
    };
}

export function localizedMetadata(
    pathnameWithoutLocale: string,
    locale: Locale | string,
    metadata: Metadata
): Metadata {
    const alternates = localeAlternates(pathnameWithoutLocale, locale);

    return {
        ...metadata,
        alternates: {
            ...alternates,
            ...(metadata.alternates || {}),
        },
        openGraph: {
            url: alternates.canonical,
            images: [
                {
                    url: seoImageUrl('/icons/icon-512.png'),
                    width: 512,
                    height: 512,
                    alt: 'NAS Build',
                },
            ],
            ...(metadata.openGraph || {}),
        },
    };
}

export function seoImageUrl(image?: string) {
    return absoluteUrl(image || '/icons/icon-512.png');
}

export function buildHomeJsonLd(locale: Locale | string) {
    const siteUrl = getSiteUrl();
    const language = locale === 'ja' ? 'ja-JP' : 'zh-CN';

    return {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Organization',
                '@id': `${siteUrl}/#organization`,
                name: 'NAS Build',
                url: siteUrl,
                logo: {
                    '@type': 'ImageObject',
                    url: seoImageUrl('/icons/icon-512.png'),
                    width: 512,
                    height: 512,
                },
                sameAs: ['https://github.com/moneyperfect'],
            },
            {
                '@type': 'WebSite',
                '@id': `${siteUrl}/#website`,
                url: siteUrl,
                name: 'NAS Build',
                inLanguage: language,
                publisher: {
                    '@id': `${siteUrl}/#organization`,
                },
            },
        ],
    };
}

interface ArticleJsonLdInput {
    title: string;
    description: string;
    url: string;
    datePublished: string;
    dateModified: string;
    locale: Locale;
    image?: string;
}

export function buildArticleJsonLd(input: ArticleJsonLdInput) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: input.title,
        description: input.description,
        datePublished: input.datePublished,
        dateModified: input.dateModified,
        inLanguage: input.locale === 'zh' ? 'zh-CN' : 'ja-JP',
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': input.url,
        },
        image: input.image || absoluteUrl('/icons/icon-512.png'),
        author: {
            '@type': 'Person',
            name: 'NAS',
        },
        publisher: {
            '@type': 'Organization',
            name: 'NAS Digital Products',
            logo: {
                '@type': 'ImageObject',
                url: absoluteUrl('/icons/icon-192.png'),
            },
        },
    };
}

export function buildBreadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    };
}

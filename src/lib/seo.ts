import type { Locale } from '@/i18n/routing';

const fallbackSiteUrl = 'https://example.com';

function normalizeSiteUrl(siteUrl: string) {
    return siteUrl.endsWith('/') ? siteUrl.slice(0, -1) : siteUrl;
}

export function getSiteUrl() {
    return normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL || fallbackSiteUrl);
}

export function absoluteUrl(pathname: string) {
    const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
    return `${getSiteUrl()}${path}`;
}

export function localeAlternates(pathnameWithoutLocale: string, locale: Locale) {
    const normalized = pathnameWithoutLocale.startsWith('/')
        ? pathnameWithoutLocale
        : `/${pathnameWithoutLocale}`;

    return {
        canonical: absoluteUrl(`/${locale}${normalized}`),
        languages: {
            zh: absoluteUrl(`/zh${normalized}`),
            ja: absoluteUrl(`/ja${normalized}`),
            'x-default': absoluteUrl(`/zh${normalized}`),
        },
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

import { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { getAllSlugs } from '@/lib/mdx';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';

export default function sitemap(): MetadataRoute.Sitemap {
    const routes = [
        '',
        '/products',
        '/library',
        '/saas',
        '/playbooks',
        '/cases',
        '/notes',
        '/about',
        '/privacy',
        '/terms',
        '/contact',
        '/work-with-me',
    ];

    const staticPages = routing.locales.flatMap((locale) =>
        routes.map((route) => ({
            url: `${baseUrl}/${locale}${route}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: route === '' ? 1 : 0.8,
        }))
    );

    const dynamicPages: MetadataRoute.Sitemap = [];

    // Products
    routing.locales.forEach((locale) => {
        const slugs = getAllSlugs('products', locale);
        slugs.forEach((slug) => {
            dynamicPages.push({
                url: `${baseUrl}/${locale}/products/${slug}`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.7,
            });
        });
    });

    // Library
    routing.locales.forEach((locale) => {
        const slugs = getAllSlugs('library', locale);
        slugs.forEach((slug) => {
            dynamicPages.push({
                url: `${baseUrl}/${locale}/library/${slug}`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.6,
            });
        });
    });

    // Playbooks
    routing.locales.forEach((locale) => {
        const slugs = getAllSlugs('playbooks', locale);
        slugs.forEach((slug) => {
            dynamicPages.push({
                url: `${baseUrl}/${locale}/playbooks/${slug}`,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.7,
            });
        });
    });

    // Cases
    routing.locales.forEach((locale) => {
        const slugs = getAllSlugs('cases', locale);
        slugs.forEach((slug) => {
            dynamicPages.push({
                url: `${baseUrl}/${locale}/cases/${slug}`,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.5,
            });
        });
    });

    // Notes
    routing.locales.forEach((locale) => {
        const slugs = getAllSlugs('notes', locale);
        slugs.forEach((slug) => {
            dynamicPages.push({
                url: `${baseUrl}/${locale}/notes/${slug}`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.5,
            });
        });
    });

    return [...staticPages, ...dynamicPages];
}

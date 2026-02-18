import { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { getAllSlugs } from '@/lib/mdx';
import { getSiteUrl } from '@/lib/seo';

const baseUrl = getSiteUrl();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const routes = [
        '',
        '/products',
        '/library',
        '/saas',
        '/playbooks',
        '/cases',
        '/notes',
        '/topics',
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
    for (const locale of routing.locales) {
        const slugs = await getAllSlugs('products', locale);
        slugs.forEach((slug) => {
            dynamicPages.push({
                url: `${baseUrl}/${locale}/products/${slug}`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.7,
            });
        });
    }

    // Library
    for (const locale of routing.locales) {
        const slugs = await getAllSlugs('library', locale);
        slugs.forEach((slug) => {
            dynamicPages.push({
                url: `${baseUrl}/${locale}/library/${slug}`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.6,
            });
        });
    }

    // Playbooks
    for (const locale of routing.locales) {
        const slugs = await getAllSlugs('playbooks', locale);
        slugs.forEach((slug) => {
            dynamicPages.push({
                url: `${baseUrl}/${locale}/playbooks/${slug}`,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.7,
            });
        });
    }

    // Cases
    for (const locale of routing.locales) {
        const slugs = await getAllSlugs('cases', locale);
        slugs.forEach((slug) => {
            dynamicPages.push({
                url: `${baseUrl}/${locale}/cases/${slug}`,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.5,
            });
        });
    }

    // Notes
    for (const locale of routing.locales) {
        const slugs = await getAllSlugs('notes', locale);
        slugs.forEach((slug) => {
            dynamicPages.push({
                url: `${baseUrl}/${locale}/notes/${slug}`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.5,
            });
        });
    }

    return [...staticPages, ...dynamicPages];
}

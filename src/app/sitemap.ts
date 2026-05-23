import { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { getAllProjectSlugs } from '@/lib/projects';
import { getAllPostSlugs } from '@/lib/blog';
import { getSiteUrl } from '@/lib/seo';

const baseUrl = getSiteUrl();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const routes = [
        '',
        '/blog',
        '/topics',
        '/about',
        '/privacy',
        '/terms',
        '/projects',
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

    // Projects
    const projectSlugs = getAllProjectSlugs();
    for (const locale of routing.locales) {
        projectSlugs.forEach((slug) => {
            dynamicPages.push({
                url: `${baseUrl}/${locale}/projects/${slug}`,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.7,
            });
        });
    }

    // Blog posts
    for (const locale of routing.locales) {
        const slugs = getAllPostSlugs(locale);
        slugs.forEach((slug) => {
            dynamicPages.push({
                url: `${baseUrl}/${locale}/blog/${slug}`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.6,
            });
        });
    }

    return [...staticPages, ...dynamicPages];
}

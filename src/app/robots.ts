import { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/seo';

const baseUrl = getSiteUrl();

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/api/'],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}

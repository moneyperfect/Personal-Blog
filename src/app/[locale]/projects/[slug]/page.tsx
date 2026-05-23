import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import MarkdownRenderer from '@/components/notes/MarkdownRenderer';
import { getProjectBySlug, getAllProjectSlugs } from '@/lib/projects';
import { Locale, routing } from '@/i18n/routing';
import {
    absoluteUrl,
    buildArticleJsonLd,
    buildBreadcrumbJsonLd,
    localeAlternates,
    seoImageUrl,
} from '@/lib/seo';

export const revalidate = 60;

export async function generateStaticParams() {
    const slugs = getAllProjectSlugs();
    const params: { locale: string; slug: string }[] = [];
    for (const locale of routing.locales) {
        for (const slug of slugs) {
            params.push({ locale, slug });
        }
    }
    return params;
}

type Props = {
    params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale, slug } = await params;
    const project = getProjectBySlug(slug, locale as Locale);

    if (!project) {
        return { title: 'Project Not Found' };
    }

    const title = project.name;
    const description = project.description;
    const path = `/projects/${slug}`;
    const image = seoImageUrl(project.image);

    return {
        title,
        description,
        alternates: localeAlternates(path, locale as Locale),
        openGraph: {
            title,
            description,
            type: 'article',
            url: absoluteUrl(`/${locale}${path}`),
            images: [{ url: image }],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [image],
        },
    };
}

export default async function ProjectDetailPage({ params }: Props) {
    const { locale, slug } = await params;
    setRequestLocale(locale);

    const project = getProjectBySlug(slug, locale as Locale);

    if (!project) {
        notFound();
    }

    const t = await getTranslations({ locale, namespace: 'projects' });
    const common = await getTranslations({ locale, namespace: 'common' });

    const pageUrl = absoluteUrl(`/${locale}/projects/${slug}`);
    const articleJsonLd = buildArticleJsonLd({
        title: project.name,
        description: project.description,
        url: pageUrl,
        datePublished: new Date().toISOString(),
        dateModified: new Date().toISOString(),
        locale: locale as Locale,
        image: project.image,
    });

    const breadcrumbJsonLd = buildBreadcrumbJsonLd([
        { name: 'Home', url: absoluteUrl(`/${locale}`) },
        { name: 'Projects', url: absoluteUrl(`/${locale}/projects`) },
        { name: project.name, url: pageUrl },
    ]);

    return (
        <div className="page-shell">
            <div className="page-container page-width-content">
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
                />

                <nav className="pt-8">
                    <Link href={`/${locale}/projects`} className="link text-sm font-medium">
                        {common('backTo')} {t('title')}
                    </Link>
                </nav>

                {project.image && (
                    <div className="mt-6 overflow-hidden rounded-google-lg border border-surface-200 shadow-card">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={project.image}
                            alt={project.name}
                            className="w-full h-auto object-cover"
                        />
                    </div>
                )}

                <header className="page-header pb-4">
                    <h1 className="page-title">{project.name}</h1>
                    <p className="text-surface-600 mt-2">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mt-4">
                        {project.techStack.map((tech) => (
                            <span key={tech} className="chip chip-muted text-[11px]">
                                {tech}
                            </span>
                        ))}
                    </div>
                    <div className="flex flex-wrap gap-3 mt-5">
                        {project.link && (
                            <a
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-primary text-sm"
                            >
                                {t('visit')}
                            </a>
                        )}
                        {project.github && (
                            <a
                                href={project.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-tonal text-sm"
                            >
                                {t('source')}
                            </a>
                        )}
                    </div>
                </header>

                <MarkdownRenderer content={project.content} />
            </div>
        </div>
    );
}

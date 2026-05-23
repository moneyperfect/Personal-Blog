import { setRequestLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { getAllProjects } from '@/lib/projects';
import { Locale } from '@/i18n/routing';
import { localeAlternates } from '@/lib/seo';

export const revalidate = 60;

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Pick<Props, 'params'>) {
    const { locale } = await params;
    const isZh = locale === 'zh';

    return {
        title: isZh ? '项目' : 'プロジェクト',
        description: isZh
            ? '我的作品与开源项目'
            : '作品とオープンソースプロジェクト',
        alternates: localeAlternates('/projects', locale as Locale),
    };
}

export default async function ProjectsPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    const projects = getAllProjects(locale as Locale);
    const t = await getTranslations({ locale, namespace: 'projects' });

    return (
        <div className="page-shell">
            <div className="page-container page-width">
                <header className="page-header">
                    <h1 className="page-title">{t('title')}</h1>
                    <p className="page-description">{t('description')}</p>
                </header>

                <section className="section pb-12 sm:pb-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {projects.map((project) => (
                            <Link
                                key={project.slug}
                                href={`/${locale}/projects/${project.slug}`}
                                className="card card-hover block overflow-hidden h-full"
                            >
                                {project.image && (
                                    <div className="aspect-video overflow-hidden bg-surface-100">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={project.image}
                                            alt={project.name}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                )}
                                <div className="p-5">
                                    <h2 className="font-semibold text-surface-900 mb-2">
                                        {project.name}
                                    </h2>
                                    <p className="text-sm text-surface-600 line-clamp-2 mb-3">
                                        {project.description}
                                    </p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {project.techStack.map((tech) => (
                                            <span key={tech} className="chip chip-muted text-[10px]">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}

import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { Reveal, StaggerGroup, StaggerItem } from '@/components/ui';
import { getAllProjects } from '@/lib/projects';
import { getAllPosts } from '@/lib/blog';
import { buildHomeJsonLd, localizedMetadata } from '@/lib/seo';
import { Locale } from '@/i18n/routing';
import { getAboutContent } from './about/content';
import { ABOUT_PROFILE_MEDIA_DEFAULTS } from '@/lib/about-profile-media';

type Props = {
    params: Promise<{ locale: string }>;
};

export const revalidate = 60;

export async function generateMetadata({ params }: Props) {
    const { locale } = await params;
    const isZh = locale === 'zh';

    return localizedMetadata('', locale, {
        title: isZh ? '首页' : 'ホーム',
        description: isZh
            ? 'NAS Build 的个人博客、数字产品和 AI 自动化资源。'
            : 'NAS Build のブログ、デジタル商品、AI 自動化リソース。',
    });
}

export default async function HomePage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    const projects = getAllProjects(locale as Locale).slice(0, 3);
    const posts = getAllPosts(locale as Locale).slice(0, 3);
    const aboutContent = getAboutContent(locale, {
        avatarUrl: ABOUT_PROFILE_MEDIA_DEFAULTS.avatarUrl,
        portraitUrl: ABOUT_PROFILE_MEDIA_DEFAULTS.portraitUrl,
        updatedAt: null,
    });
    const homeJsonLd = buildHomeJsonLd(locale);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
            />
            <HomeContent
                locale={locale}
                hero={aboutContent.hero}
                projects={projects}
                posts={posts}
            />
        </>
    );
}

function HomeContent({
    locale,
    hero,
    projects,
    posts,
}: {
    locale: string;
    hero: { avatarSrc: string; avatarAlt: string; floatingPills: string[]; aboutKicker: string; aboutTitle: string; aboutSubtitle: string };
    projects: Awaited<ReturnType<typeof getAllProjects>>;
    posts: Awaited<ReturnType<typeof getAllPosts>>;
}) {
    const t = useTranslations('home');

    return (
        <div className="page-shell">
            <div className="page-container page-width">
                {/* 个人介绍 */}
                <Reveal direction="up">
                    <section className="section pt-8 pb-12">
                        <div className="card p-6 sm:p-8">
                            <div className="flex flex-col sm:flex-row items-start gap-6">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={hero.avatarSrc}
                                    alt={hero.avatarAlt}
                                    className="h-20 w-20 rounded-full border-2 border-surface-200 object-cover shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                    <span className="chip chip-active text-[11px] mb-3 inline-block">
                                        {hero.aboutKicker}
                                    </span>
                                    <h1 className="text-2xl sm:text-3xl font-semibold text-surface-900 mb-3">
                                        {hero.aboutTitle}
                                    </h1>
                                    <p className="text-surface-600 leading-7 mb-4">
                                        {hero.aboutSubtitle}
                                    </p>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {hero.floatingPills.map((pill) => (
                                            <span key={pill} className="chip chip-muted text-[11px]">
                                                {pill}
                                            </span>
                                        ))}
                                    </div>
                                    <Link
                                        href={`/${locale}/about`}
                                        className="btn btn-tonal text-sm"
                                    >
                                        {t('intro.cta')}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </section>
                </Reveal>

                {/* 项目/作品展示 */}
                {projects.length > 0 && (
                    <Reveal direction="up" delay={0.1}>
                        <section className="section">
                            <div className="section-header">
                                <h2 className="section-title">{t('projects.title')}</h2>
                                <Link
                                    href={`/${locale}/projects`}
                                    className="link text-sm font-medium"
                                >
                                    {t('projects.viewAll')}
                                </Link>
                            </div>
                            <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {projects.map((project) => (
                                    <StaggerItem key={project.slug}>
                                        <Link
                                            href={project.detailPage || `/${locale}/projects/${project.slug}`}
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
                                                <h3 className="font-semibold text-surface-900 mb-2">
                                                    {project.name}
                                                </h3>
                                                <p className="text-sm text-surface-600 line-clamp-2 mb-3">
                                                    {project.description}
                                                </p>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {project.techStack.slice(0, 4).map((tech) => (
                                                        <span key={tech} className="chip chip-muted text-[10px]">
                                                            {tech}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </Link>
                                    </StaggerItem>
                                ))}
                            </StaggerGroup>
                        </section>
                    </Reveal>
                )}

                {/* 博客 */}
                {posts.length > 0 && (
                    <Reveal direction="up" delay={0.1}>
                        <section className="section pb-12 sm:pb-16">
                            <div className="section-header">
                                <h2 className="section-title">{t('latestBlog.title')}</h2>
                                <Link
                                    href={`/${locale}/blog`}
                                    className="link text-sm font-medium"
                                >
                                    {t('latestBlog.viewAll')}
                                </Link>
                            </div>
                            <div className="space-y-4">
                                {posts.map((post) => (
                                    <Link
                                        key={post.slug}
                                        href={`/${locale}/blog/${post.slug}`}
                                        className="group block list-card"
                                    >
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {post.frontmatter.tags.map((tag) => (
                                                <span key={tag} className="chip chip-muted text-[11px]">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                        <h3 className="text-lg font-semibold text-surface-900 group-hover:text-accent mb-2">
                                            {post.frontmatter.title}
                                        </h3>
                                        <p className="text-surface-600 line-clamp-2">
                                            {post.frontmatter.description}
                                        </p>
                                        <span className="text-sm text-surface-500 mt-2 block">
                                            {new Date(post.frontmatter.date).toLocaleDateString()}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    </Reveal>
                )}
            </div>
        </div>
    );
}

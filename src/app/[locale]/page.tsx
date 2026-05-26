import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import {
    ArrowRight,
    ChevronDown,
    Blocks,
    Newspaper,
    Wrench,
} from 'lucide-react';
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
    const posts = (await getAllPosts(locale as Locale)).slice(0, 4);
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
    hero: {
        avatarSrc: string;
        avatarAlt: string;
        floatingPills: string[];
        aboutKicker: string;
        aboutTitle: string;
        aboutSubtitle: string;
    };
    projects: Awaited<ReturnType<typeof getAllProjects>>;
    posts: Awaited<ReturnType<typeof getAllPosts>>;
}) {
    const t = useTranslations('home');

    return (
        <div className="min-h-screen">
            {/* ── Hero ── */}
            <section className="hero-gradient relative overflow-hidden flex flex-col items-center justify-center text-center px-6 pt-32 pb-24 sm:pt-40 sm:pb-32 min-h-[85vh]">
                {/* Floating pills — desktop only */}
                <div className="hidden lg:block">
                    {hero.floatingPills.slice(0, 3).map((pill, i) => (
                        <span
                            key={pill}
                            className={`absolute rounded-full border border-white/10 bg-white/5 backdrop-blur-sm px-4 py-1.5 text-[11px] font-medium text-stone-300 select-none ${
                                i === 0
                                    ? 'top-[18%] left-[8%] float-slow'
                                    : i === 1
                                      ? 'top-[28%] right-[10%] float-medium'
                                      : 'bottom-[25%] left-[12%] float-fast'
                            }`}
                        >
                            {pill}
                        </span>
                    ))}
                    {hero.floatingPills.slice(3, 5).map((pill, i) => (
                        <span
                            key={pill}
                            className={`absolute rounded-full border border-white/10 bg-white/5 backdrop-blur-sm px-4 py-1.5 text-[11px] font-medium text-stone-300 select-none ${
                                i === 0
                                    ? 'top-[40%] right-[6%] float-fast'
                                    : 'bottom-[18%] right-[14%] float-slow'
                            }`}
                        >
                            {pill}
                        </span>
                    ))}
                </div>

                <Reveal direction="up">
                    <div className="relative z-10 max-w-3xl mx-auto">
                        {/* Kicker */}
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-accent mb-8">
                            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                            {hero.aboutKicker}
                        </span>

                        {/* Avatar */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={hero.avatarSrc}
                            alt={hero.avatarAlt}
                            className="h-24 w-24 sm:h-28 sm:w-28 rounded-full border-2 border-white/10 object-cover mx-auto mb-8"
                        />

                        {/* Headline */}
                        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-stone-50 leading-[1.1] tracking-tight mb-6">
                            {hero.aboutTitle}
                        </h1>

                        {/* Subtitle */}
                        <p className="text-base sm:text-lg text-stone-300 leading-relaxed max-w-xl mx-auto mb-10">
                            {hero.aboutSubtitle}
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-wrap items-center justify-center gap-4">
                            <Link
                                href={`/${locale}/projects`}
                                className="btn bg-accent text-stone-50 hover:brightness-110 px-6 py-3 text-sm font-medium"
                            >
                                <Blocks className="h-4 w-4" />
                                {t('projects.title')}
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                            <Link
                                href={`/${locale}/about`}
                                className="btn border border-white/15 text-stone-200 hover:bg-white/10 px-6 py-3 text-sm font-medium"
                            >
                                {t('intro.cta')}
                            </Link>
                        </div>
                    </div>
                </Reveal>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bounce-subtle">
                    <ChevronDown className="h-5 w-5 text-stone-400" />
                </div>
            </section>

            {/* ── Stats Bar ── */}
            <Reveal direction="up">
                <section className="border-y border-surface-300 bg-surface-100">
                    <div className="max-w-page mx-auto px-6 py-8 grid grid-cols-3 divide-x divide-surface-300">
                        <div className="text-center px-4">
                            <div className="font-display text-3xl sm:text-4xl font-bold text-surface-900">
                                3+
                            </div>
                            <div className="text-xs sm:text-sm text-surface-600 mt-1 font-medium">
                                Products
                            </div>
                        </div>
                        <div className="text-center px-4">
                            <div className="font-display text-3xl sm:text-4xl font-bold text-surface-900">
                                20+
                            </div>
                            <div className="text-xs sm:text-sm text-surface-600 mt-1 font-medium">
                                Articles
                            </div>
                        </div>
                        <div className="text-center px-4">
                            <div className="font-display text-3xl sm:text-4xl font-bold text-surface-900">
                                5+
                            </div>
                            <div className="text-xs sm:text-sm text-surface-600 mt-1 font-medium">
                                Tech Areas
                            </div>
                        </div>
                    </div>
                </section>
            </Reveal>

            <div className="page-container page-width">
                {/* ── Projects Bento Grid ── */}
                {projects.length > 0 && (
                    <Reveal direction="up">
                        <section className="section">
                            <div className="section-header">
                                <h2 className="section-title flex items-center gap-2">
                                    <Wrench className="h-5 w-5 text-accent" />
                                    {t('projects.title')}
                                </h2>
                                <Link
                                    href={`/${locale}/projects`}
                                    className="link text-sm font-medium inline-flex items-center gap-1"
                                >
                                    {t('projects.viewAll')}
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </Link>
                            </div>
                            <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {projects.map((project, index) => (
                                    <StaggerItem
                                        key={project.slug}
                                        className={index === 0 ? 'md:col-span-2' : ''}
                                    >
                                        <Link
                                            href={
                                                project.detailPage ||
                                                `/${locale}/projects/${project.slug}`
                                            }
                                            className="group block bg-surface-200 rounded-google-xl overflow-hidden bento-glow transition-all duration-300 hover:-translate-y-0.5"
                                        >
                                            <div
                                                className={`flex flex-col ${index === 0 ? 'sm:flex-row' : ''}`}
                                            >
                                                {project.image && (
                                                    <div
                                                        className={`overflow-hidden bg-surface-100 ${index === 0 ? 'sm:w-3/5 aspect-video sm:aspect-auto' : 'aspect-video'}`}
                                                    >
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img
                                                            src={project.image}
                                                            alt={project.name}
                                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                                        />
                                                    </div>
                                                )}
                                                <div
                                                    className={`p-5 sm:p-6 flex flex-col justify-center ${index === 0 ? 'sm:w-2/5' : ''}`}
                                                >
                                                    <h3 className="font-display text-lg sm:text-xl font-semibold text-surface-900 mb-2 group-hover:text-accent transition-colors">
                                                        {project.name}
                                                    </h3>
                                                    <p className="text-sm text-surface-600 line-clamp-2 mb-4">
                                                        {project.description}
                                                    </p>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {project.techStack
                                                            .slice(0, 4)
                                                            .map((tech) => (
                                                                <span
                                                                    key={tech}
                                                                    className="chip chip-muted text-[10px]"
                                                                >
                                                                    {tech}
                                                                </span>
                                                            ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </StaggerItem>
                                ))}
                            </StaggerGroup>
                        </section>
                    </Reveal>
                )}

                {/* ── Blog List ── */}
                {posts.length > 0 && (
                    <Reveal direction="up" delay={0.1}>
                        <section className="section pb-16 sm:pb-24">
                            <div className="section-header">
                                <h2 className="section-title flex items-center gap-2">
                                    <Newspaper className="h-5 w-5 text-accent" />
                                    {t('latestBlog.title')}
                                </h2>
                                <Link
                                    href={`/${locale}/blog`}
                                    className="link text-sm font-medium inline-flex items-center gap-1"
                                >
                                    {t('latestBlog.viewAll')}
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </Link>
                            </div>
                            <div className="divide-y divide-surface-300">
                                {posts.map((post) => (
                                    <Link
                                        key={post.slug}
                                        href={`/${locale}/blog/${post.slug}`}
                                        className="group flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 py-5 transition-colors hover:bg-surface-200/50 -mx-3 px-3 rounded-google"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap gap-1.5 mb-1.5">
                                                {post.frontmatter.tags
                                                    .slice(0, 2)
                                                    .map((tag) => (
                                                        <span
                                                            key={tag}
                                                            className="text-[10px] font-medium text-accent uppercase tracking-wider"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                            </div>
                                            <h3 className="font-display text-base sm:text-lg font-semibold text-surface-900 group-hover:text-accent transition-colors truncate">
                                                {post.frontmatter.title}
                                            </h3>
                                        </div>
                                        <span className="text-xs text-surface-500 tabular-nums shrink-0">
                                            {new Date(
                                                post.frontmatter.date
                                            ).toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'ja-JP')}
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

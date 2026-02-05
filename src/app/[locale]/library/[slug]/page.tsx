import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from 'next/link';
import { getLibraryItemBySlug, getAllSlugs } from '@/lib/mdx';
import { Locale, routing } from '@/i18n/routing';
import { CopyButton } from '@/components/ui/CopyButton';
import { DownloadButton } from '@/components/ui/DownloadButton';

type Props = {
    params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
    const params: { locale: string; slug: string }[] = [];

    for (const locale of routing.locales) {
        const slugs = getAllSlugs('library', locale);
        for (const slug of slugs) {
            params.push({ locale, slug });
        }
    }

    return params;
}

export async function generateMetadata({ params }: Props) {
    const { locale, slug } = await params;
    const item = getLibraryItemBySlug(slug, locale as Locale);

    if (!item) {
        return { title: 'Resource Not Found' };
    }

    return {
        title: item.frontmatter.title,
        description: item.frontmatter.summary,
    };
}

export default async function LibraryItemPage({ params }: Props) {
    const { locale, slug } = await params;
    setRequestLocale(locale);

    const item = getLibraryItemBySlug(slug, locale as Locale);

    if (!item) {
        notFound();
    }

    const t = await getTranslations({ locale, namespace: 'library' });
    const common = await getTranslations({ locale, namespace: 'common' });

    return (
        <div className="page-shell">
            <div className="page-container page-width-content">
                <nav className="pt-8">
                    <Link
                        href={`/${locale}/library`}
                        className="link text-sm font-medium"
                    >
                        {common('backTo')} {t('title')}
                    </Link>
                </nav>

                <header className="page-header pb-4">
                    <div className="flex flex-wrap gap-2 mb-4">
                        <span className="chip chip-active text-[11px]">
                            {t(`types.${item.frontmatter.type}`)}
                        </span>
                        {item.frontmatter.tags.map((tag) => (
                            <span
                                key={tag}
                                className="chip chip-muted text-[11px]"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                    <h1 className="page-title">{item.frontmatter.title}</h1>
                    <p className="page-description">{item.frontmatter.summary}</p>
                    <div className="flex flex-wrap gap-3 mt-5">
                        {item.frontmatter.copyText && (
                            <CopyButton
                                text={item.frontmatter.copyText}
                                slug={slug}
                                title={item.frontmatter.title}
                                className="px-4 py-2"
                            />
                        )}
                        {item.frontmatter.downloadUrl && (
                            <DownloadButton
                                url={item.frontmatter.downloadUrl}
                                slug={slug}
                                title={item.frontmatter.title}
                                className="px-4 py-2"
                            />
                        )}
                    </div>
                </header>

                <article className="prose max-w-none pb-12">
                    <MDXRemote source={item.content} />
                </article>
            </div>
        </div>
    );
}

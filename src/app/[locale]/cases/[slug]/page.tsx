import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from 'next/link';
import { getCaseBySlug, getAllSlugs } from '@/lib/mdx';
import { Locale, routing } from '@/i18n/routing';

type Props = {
    params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
    const params: { locale: string; slug: string }[] = [];
    for (const locale of routing.locales) {
        const slugs = await getAllSlugs('cases', locale);
        for (const slug of slugs) {
            params.push({ locale, slug });
        }
    }
    return params;
}

export async function generateMetadata({ params }: Props) {
    const { locale, slug } = await params;
    const caseItem = getCaseBySlug(slug, locale as Locale);
    if (!caseItem) return { title: 'Case Not Found' };
    return {
        title: caseItem.frontmatter.title,
        description: caseItem.frontmatter.summary,
    };
}

export default async function CaseDetailPage({ params }: Props) {
    const { locale, slug } = await params;
    setRequestLocale(locale);

    const caseItem = getCaseBySlug(slug, locale as Locale);
    if (!caseItem) notFound();

    return (
        <div className="py-12 sm:py-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <nav className="mb-8">
                    <Link href={`/${locale}/cases`} className="text-primary-600 hover:underline">
                        ← {locale === 'zh' ? '返回案例' : '事例に戻る'}
                    </Link>
                </nav>
                <header className="mb-10">
                    <h1 className="text-3xl sm:text-4xl font-bold text-surface-900 mb-4">
                        {caseItem.frontmatter.title}
                    </h1>
                    <p className="text-lg text-surface-600">{caseItem.frontmatter.summary}</p>
                </header>
                <article className="prose max-w-none">
                    <MDXRemote source={caseItem.content} />
                </article>
            </div>
        </div>
    );
}

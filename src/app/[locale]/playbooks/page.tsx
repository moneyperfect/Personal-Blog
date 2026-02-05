import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { getAllPlaybooks } from '@/lib/mdx';
import { Locale } from '@/i18n/routing';

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
    const { locale } = await params;
    return {
        title: locale === 'zh' ? '实战 Playbook' : '実践Playbook',
        description: locale === 'zh'
            ? '一步步带你从想法到上线'
            : 'アイデアからローンチまでステップバイステップでガイド',
    };
}

export default async function PlaybooksPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    const playbooks = getAllPlaybooks(locale as Locale);

    const title = locale === 'zh' ? '实战 Playbook' : '実践Playbook';
    const description = locale === 'zh'
        ? '一步步带你从想法到上线'
        : 'アイデアからローンチまでステップバイステップでガイド';

    return (
        <div className="py-12 sm:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-3xl sm:text-4xl font-bold text-surface-900 mb-4">
                        {title}
                    </h1>
                    <p className="text-lg text-surface-600 max-w-2xl mx-auto">
                        {description}
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {playbooks.map((playbook) => (
                        <Link
                            key={playbook.slug}
                            href={`/${locale}/playbooks/${playbook.slug}`}
                            className="group block bg-white rounded-google-xl border border-surface-300 p-8 hover:shadow-elevated-3 hover:border-primary-200 transition-all"
                        >
                            <div className="flex flex-wrap gap-2 mb-4">
                                {playbook.frontmatter.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-2 py-1 text-xs bg-primary-50 text-primary-700 rounded-full"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <h2 className="text-xl font-bold text-surface-900 group-hover:text-primary-600 mb-3">
                                {playbook.frontmatter.title}
                            </h2>
                            <p className="text-surface-600 mb-4">
                                {playbook.frontmatter.summary}
                            </p>
                            <span className="text-primary-600 font-medium group-hover:underline">
                                {locale === 'zh' ? '开始学习 →' : '学習を始める →'}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

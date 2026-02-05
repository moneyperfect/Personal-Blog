import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { getAllCases } from '@/lib/mdx';
import { Locale } from '@/i18n/routing';

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
    const { locale } = await params;
    return {
        title: locale === 'zh' ? '成功案例' : '成功事例',
    };
}

export default async function CasesPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    const cases = getAllCases(locale as Locale);
    const title = locale === 'zh' ? '成功案例' : '成功事例';
    const description = locale === 'zh'
        ? '看看其他创作者是如何使用我们的产品和资源的'
        : '他のクリエイターがどのように製品やリソースを活用しているか';

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

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cases.map((caseItem) => (
                        <Link
                            key={caseItem.slug}
                            href={`/${locale}/cases/${caseItem.slug}`}
                            className="group block bg-white rounded-google-lg border border-surface-300 p-6 hover:shadow-elevated-2 transition-all"
                        >
                            <h2 className="text-lg font-semibold text-surface-900 group-hover:text-primary-600 mb-2">
                                {caseItem.frontmatter.title}
                            </h2>
                            <p className="text-sm text-surface-600 line-clamp-3">
                                {caseItem.frontmatter.summary}
                            </p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

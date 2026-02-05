import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { WaitlistForm } from '@/components/forms';

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
    const { locale } = await params;
    return {
        title: locale === 'zh' ? 'SaaS 产品' : 'SaaS製品',
        description: locale === 'zh'
            ? '下一代工具，正在打造中'
            : '次世代ツール、現在開発中',
    };
}

export default async function SaaSPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    return <SaaSContent locale={locale} />;
}

function SaaSContent({ locale }: { locale: string }) {
    const t = useTranslations('saas');

    const roadmapItems = locale === 'zh'
        ? [
            { phase: 'Q1 2024', title: 'MVP 发布', description: '核心功能上线，开放内测' },
            { phase: 'Q2 2024', title: '用户反馈迭代', description: '根据用户反馈优化产品' },
            { phase: 'Q3 2024', title: '正式发布', description: '公开发布，开放注册' },
        ]
        : [
            { phase: 'Q1 2024', title: 'MVP リリース', description: 'コア機能の公開、ベータテスト開始' },
            { phase: 'Q2 2024', title: 'フィードバック対応', description: 'ユーザーフィードバックに基づく改善' },
            { phase: 'Q3 2024', title: '正式リリース', description: '一般公開、登録受付開始' },
        ];

    return (
        <div className="py-12 sm:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-3xl sm:text-4xl font-bold text-surface-900 mb-4">
                        {t('title')}
                    </h1>
                    <p className="text-lg text-surface-600 max-w-2xl mx-auto">
                        {t('subtitle')}
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Roadmap */}
                    <div>
                        <h2 className="text-2xl font-bold text-surface-900 mb-8">
                            {t('roadmap')}
                        </h2>
                        <div className="space-y-6">
                            {roadmapItems.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex gap-4 p-5 bg-surface-50 rounded-google-lg border border-surface-200"
                                >
                                    <div className="flex-shrink-0">
                                        <span className="inline-block px-3 py-1 text-sm font-medium bg-primary-100 text-primary-700 rounded-full">
                                            {item.phase}
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-surface-900 mb-1">
                                            {item.title}
                                        </h3>
                                        <p className="text-sm text-surface-600">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Waitlist Form */}
                    <div className="lg:sticky lg:top-24">
                        <div className="bg-white rounded-google-xl border border-surface-300 shadow-elevated-2 p-8">
                            <h2 className="text-xl font-bold text-surface-900 mb-2">
                                {t('waitlist.title')}
                            </h2>
                            <p className="text-surface-600 mb-6">
                                {t('waitlist.description')}
                            </p>
                            <WaitlistForm />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

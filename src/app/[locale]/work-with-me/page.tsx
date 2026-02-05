import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
    const { locale } = await params;
    return { title: locale === 'zh' ? '与我合作' : 'お仕事依頼' };
}

export default async function WorkWithMePage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    const content = locale === 'zh' ? {
        title: '与我合作',
        description: '提供多种合作方式，助力你的项目成功',
        services: [
            { title: '产品咨询', price: '¥500/小时', description: '1对1咨询，帮你理清产品思路、验证想法、制定上线计划', cta: '预约咨询' },
            { title: '定制开发', price: '按项目报价', description: 'Next.js / React 项目开发，从 MVP 到生产级应用', cta: '咨询报价' },
            { title: '内容合作', price: '商议', description: '联合推广、客座文章、播客访谈等内容合作', cta: '发起合作' },
        ],
    } : {
        title: 'お仕事依頼',
        description: 'さまざまな形でプロジェクトの成功をサポートします',
        services: [
            { title: 'プロダクトコンサル', price: '¥5,000/時間', description: '1対1のコンサルティングで、アイデア検証からローンチ計画まで', cta: '相談を予約' },
            { title: 'カスタム開発', price: 'プロジェクト単位', description: 'Next.js / React プロジェクト開発、MVPから本番環境まで', cta: '見積もり相談' },
            { title: 'コンテンツ連携', price: '要相談', description: '共同プロモーション、ゲスト記事、ポッドキャストなど', cta: '連携を開始' },
        ],
    };

    return (
        <div className="py-12 sm:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-3xl sm:text-4xl font-bold text-surface-900 mb-4">{content.title}</h1>
                    <p className="text-lg text-surface-600">{content.description}</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {content.services.map((service, i) => (
                        <div key={i} className="bg-white rounded-google-xl border border-surface-300 p-8 hover:shadow-elevated-2 transition-all">
                            <h2 className="text-xl font-bold text-surface-900 mb-2">{service.title}</h2>
                            <p className="text-2xl font-bold text-primary-600 mb-4">{service.price}</p>
                            <p className="text-surface-600 mb-6">{service.description}</p>
                            <Link
                                href={`/${locale}/contact`}
                                className="block text-center px-6 py-3 bg-primary-600 text-white font-medium rounded-google hover:bg-primary-700 transition-colors"
                            >
                                {service.cta}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

import { setRequestLocale } from 'next-intl/server';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
    const { locale } = await params;
    return { title: locale === 'zh' ? '关于我们' : '概要' };
}

export default async function AboutPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    const content = locale === 'zh' ? {
        title: '关于我们',
        description: '我们是一个专注于帮助创作者变现的工作室。通过精选数字产品、实战 Playbook 和高效资源模板，我们帮助个人开发者、设计师和内容创作者快速启动他们的项目。',
        mission: '使命',
        missionText: '让每个创作者都能轻松变现，将想法转化为收入。',
        values: '核心价值',
        valuesList: ['质量优先：每个产品都经过精心打磨', '实用至上：解决真实问题，带来真实价值', '持续迭代：不断改进，追求卓越'],
    } : {
        title: '概要',
        description: '私たちはクリエイターの収益化を支援するスタジオです。厳選されたデジタル製品、実践的なPlaybook、効率的なテンプレートで、個人開発者、デザイナー、コンテンツクリエイターのプロジェクト立ち上げをサポートします。',
        mission: 'ミッション',
        missionText: 'すべてのクリエイターが簡単に収益化し、アイデアを収入に変えられるようにする。',
        values: 'コアバリュー',
        valuesList: ['品質第一：すべての製品を丁寧に仕上げる', '実用性重視：本当の問題を解決し、本当の価値を提供', '継続的改善：常により良くを目指す'],
    };

    return (
        <div className="py-12 sm:py-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-surface-900 mb-6">{content.title}</h1>
                <p className="text-lg text-surface-600 mb-10">{content.description}</p>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-surface-900 mb-4">{content.mission}</h2>
                    <p className="text-surface-600">{content.missionText}</p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-surface-900 mb-4">{content.values}</h2>
                    <ul className="space-y-3">
                        {content.valuesList.map((value, i) => (
                            <li key={i} className="flex items-start gap-3 text-surface-600">
                                <span className="text-primary-600">•</span>
                                {value}
                            </li>
                        ))}
                    </ul>
                </section>
            </div>
        </div>
    );
}

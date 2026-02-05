import { setRequestLocale } from 'next-intl/server';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
    const { locale } = await params;
    return { title: locale === 'zh' ? '隐私政策' : 'プライバシーポリシー' };
}

export default async function PrivacyPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    const content = locale === 'zh' ? {
        title: '隐私政策',
        lastUpdated: '最后更新：2024年1月1日',
        sections: [
            { title: '信息收集', text: '我们收集您自愿提供的信息，如邮箱地址（用于订阅和候补名单）。我们使用 Google Analytics 收集匿名网站使用数据。' },
            { title: '信息使用', text: '收集的信息仅用于：发送产品更新和通知、改善网站体验、分析网站使用情况。' },
            { title: '信息保护', text: '我们采取合理措施保护您的个人信息，不会将其出售或分享给第三方。' },
            { title: '联系我们', text: '如有隐私相关问题，请通过联系页面与我们取得联系。' },
        ],
    } : {
        title: 'プライバシーポリシー',
        lastUpdated: '最終更新：2024年1月1日',
        sections: [
            { title: '情報収集', text: 'お客様が自発的に提供する情報（メールアドレスなど）を収集します。Google Analyticsを使用して匿名のウェブサイト使用データを収集します。' },
            { title: '情報の使用', text: '収集した情報は、製品の更新通知の送信、ウェブサイト体験の改善、利用状況の分析にのみ使用されます。' },
            { title: '情報の保護', text: '個人情報を保護するために合理的な措置を講じ、第三者に販売または共有することはありません。' },
            { title: 'お問い合わせ', text: 'プライバシーに関するご質問は、お問い合わせページからご連絡ください。' },
        ],
    };

    return (
        <div className="py-12 sm:py-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-surface-900 mb-2">{content.title}</h1>
                <p className="text-surface-500 mb-10">{content.lastUpdated}</p>
                {content.sections.map((section, i) => (
                    <section key={i} className="mb-8">
                        <h2 className="text-xl font-semibold text-surface-900 mb-3">{section.title}</h2>
                        <p className="text-surface-600">{section.text}</p>
                    </section>
                ))}
            </div>
        </div>
    );
}

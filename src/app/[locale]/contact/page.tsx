import { setRequestLocale } from 'next-intl/server';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
    const { locale } = await params;
    return { title: locale === 'zh' ? '联系我们' : 'お問い合わせ' };
}

export default async function ContactPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    const content = locale === 'zh' ? {
        title: '联系我们',
        description: '有问题或建议？欢迎随时联系我们。',
        email: '邮箱',
        emailValue: 'hello@example.com',
        response: '我们通常会在 24 小时内回复。',
    } : {
        title: 'お問い合わせ',
        description: 'ご質問やご提案がありましたら、お気軽にご連絡ください。',
        email: 'メール',
        emailValue: 'hello@example.com',
        response: '通常24時間以内にご返信いたします。',
    };

    return (
        <div className="py-12 sm:py-20">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h1 className="text-3xl sm:text-4xl font-bold text-surface-900 mb-4">{content.title}</h1>
                <p className="text-lg text-surface-600 mb-10">{content.description}</p>

                <div className="bg-surface-50 rounded-google-xl p-8 border border-surface-200">
                    <p className="text-surface-600 mb-2">{content.email}</p>
                    <a
                        href={`mailto:${content.emailValue}`}
                        className="text-2xl font-semibold text-primary-600 hover:underline"
                    >
                        {content.emailValue}
                    </a>
                    <p className="text-sm text-surface-500 mt-4">{content.response}</p>
                </div>
            </div>
        </div>
    );
}

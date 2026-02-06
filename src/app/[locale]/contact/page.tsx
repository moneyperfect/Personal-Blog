import { setRequestLocale } from 'next-intl/server';
import Image from 'next/image';

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
        emailValue: 'lingxicto@gmail.com',
        response: '我们通常会在 24 小时内回复。',
        wechat: '微信',
        wechatId: 'Different709world',
        qq: 'QQ',
        qqId: '2720838758',
        payment: '支付方式',
    } : {
        title: 'お問い合わせ',
        description: 'ご質問やご提案がありましたら、お気軽にご連絡ください。',
        email: 'メール',
        emailValue: 'lingxicto@gmail.com',
        response: '通常24時間以内にご返信いたします。',
        wechat: 'WeChat',
        wechatId: 'Different709world',
        qq: 'QQ',
        qqId: '2720838758',
        payment: 'お支払い方法',
    };

    return (
        <div className="py-12 sm:py-20">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h1 className="text-3xl sm:text-4xl font-bold text-surface-900 mb-4">{content.title}</h1>
                <p className="text-lg text-surface-600 mb-10">{content.description}</p>

                {/* Email Section */}
                <div className="bg-surface-50 rounded-google-xl p-8 border border-surface-200 mb-6">
                    <p className="text-surface-600 mb-2">{content.email}</p>
                    <a
                        href={`mailto:${content.emailValue}`}
                        className="text-2xl font-semibold text-primary-600 hover:underline"
                    >
                        {content.emailValue}
                    </a>
                    <p className="text-sm text-surface-500 mt-4">{content.response}</p>
                </div>

                {/* Social Accounts */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="bg-surface-50 rounded-google-xl p-6 border border-surface-200">
                        <p className="text-surface-600 mb-2">{content.wechat}</p>
                        <p className="text-lg font-semibold text-surface-900">{content.wechatId}</p>
                    </div>
                    <div className="bg-surface-50 rounded-google-xl p-6 border border-surface-200">
                        <p className="text-surface-600 mb-2">{content.qq}</p>
                        <p className="text-lg font-semibold text-surface-900">{content.qqId}</p>
                    </div>
                </div>

                {/* Payment QR Codes */}
                <div className="bg-surface-50 rounded-google-xl p-8 border border-surface-200">
                    <p className="text-surface-600 mb-4">{content.payment}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="flex flex-col items-center">
                            <Image
                                src="/wechat-qr.jpg"
                                alt="WeChat Pay"
                                width={200}
                                height={200}
                                className="rounded-google-lg border border-surface-200"
                            />
                            <p className="text-sm text-surface-500 mt-2">微信支付 / WeChat Pay</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <Image
                                src="/qq-qr.png"
                                alt="QQ Pay"
                                width={200}
                                height={200}
                                className="rounded-google-lg border border-surface-200"
                            />
                            <p className="text-sm text-surface-500 mt-2">QQ 支付 / QQ Pay</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

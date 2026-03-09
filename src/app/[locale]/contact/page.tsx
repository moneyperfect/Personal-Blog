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

  const content = locale === 'zh'
    ? {
        title: '联系我们',
        description: '有项目合作、产品问题或付款确认需求时，欢迎随时联系我。',
        email: '邮箱',
        emailValue: 'lingxicto@gmail.com',
        response: '通常会在 24 小时内回复。',
        wechat: '微信',
        wechatId: 'Different709world',
        qq: 'QQ',
        qqId: '2720838758',
        payment: '临时支付方式',
        paymentHint: '当前阶段使用静态收款码，付款后请联系我并附上付款截图与产品名称。',
      }
    : {
        title: 'お問い合わせ',
        description: 'プロジェクト相談、商品に関する質問、または支払い確認が必要な場合は、お気軽にご連絡ください。',
        email: 'Email',
        emailValue: 'lingxicto@gmail.com',
        response: 'Usually I reply within 24 hours.',
        wechat: 'WeChat',
        wechatId: 'Different709world',
        qq: 'QQ',
        qqId: '2720838758',
        payment: 'Temporary payment method',
        paymentHint: 'This stage uses static collection QR codes. After payment, please contact me with the screenshot and product name.',
      };

  return (
    <div className="page-shell">
      <div className="page-container page-width-content py-12 sm:py-16">
        <div className="page-header text-center">
          <h1 className="page-title">{content.title}</h1>
          <p className="page-description mx-auto">{content.description}</p>
        </div>

        <div className="grid gap-6">
          <div className="card p-6 sm:p-8 text-center">
            <p className="text-surface-600 mb-2">{content.email}</p>
            <a
              href={`mailto:${content.emailValue}`}
              className="text-2xl font-semibold text-primary-600 hover:underline break-all"
            >
              {content.emailValue}
            </a>
            <p className="text-sm text-surface-500 mt-4">{content.response}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="card p-6 text-center">
              <p className="text-surface-600 mb-2">{content.wechat}</p>
              <p className="text-lg font-semibold text-surface-900">{content.wechatId}</p>
            </div>
            <div className="card p-6 text-center">
              <p className="text-surface-600 mb-2">{content.qq}</p>
              <p className="text-lg font-semibold text-surface-900">{content.qqId}</p>
            </div>
          </div>

          <div className="card p-6 sm:p-8">
            <div className="section-header mb-3">
              <h2 className="section-title">{content.payment}</h2>
            </div>
            <p className="section-description mb-6">{content.paymentHint}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="rounded-[28px] border border-emerald-100 bg-emerald-50/70 p-4 sm:p-5 text-center">
                <Image
                  src="/payments/wechat-qr.jpg"
                  alt="WeChat Pay"
                  width={260}
                  height={360}
                  className="mx-auto rounded-google-lg border border-white/80 bg-white"
                />
                <p className="text-sm text-surface-500 mt-3">微信支付 / WeChat Pay</p>
              </div>

              <div className="rounded-[28px] border border-sky-100 bg-sky-50/70 p-4 sm:p-5 text-center">
                <Image
                  src="/payments/alipay-qr.jpg"
                  alt="Alipay"
                  width={260}
                  height={360}
                  className="mx-auto rounded-google-lg border border-white/80 bg-white"
                />
                <p className="text-sm text-surface-500 mt-3">支付宝 / Alipay</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

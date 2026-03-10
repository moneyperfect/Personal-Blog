import ContactGuidePanel from '@/components/contact/ContactGuidePanel';
import { setRequestLocale } from 'next-intl/server';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return { title: locale === 'zh' ? '联系我' : 'お問い合わせ' };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const content =
    locale === 'zh'
      ? {
          title: '联系我',
          description:
            '如果你对产品、博客内容、AI 自动化或合作感兴趣，欢迎先加我微信、QQ 或直接发邮件。我会在看到消息后尽快回复。',
          areasTitle: '你可以找我聊什么',
          areas: ['产品购买咨询', 'AI 自动化与独立开发', '内容合作与交流'],
          responseTitle: '回复方式',
          responseBody:
            '当前站点不公开站内支付。涉及购买、合作或进一步沟通时，我会先通过社交渠道或邮件和你确认具体情况。',
        }
      : {
          title: 'お問い合わせ',
          description:
            '商品、ブログ、AI 自動化、コラボレーションに興味があれば、まずは WeChat・QQ・メールでご連絡ください。確認後できるだけ早く返信します。',
          areasTitle: 'ご相談いただける内容',
          areas: ['商品購入の相談', 'AI 自動化と個人開発', 'コンテンツやコラボの相談'],
          responseTitle: '対応について',
          responseBody:
            '現在のサイトではサイト内決済を公開していません。購入やコラボの相談は、まず連絡先経由で内容を確認したうえで進めます。',
        };

  return (
    <div className="page-shell">
      <div className="page-container page-width-content py-12 sm:py-16">
        <div className="page-header text-center">
          <h1 className="page-title">{content.title}</h1>
          <p className="page-description mx-auto">{content.description}</p>
        </div>

        <div className="grid gap-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="card p-6 sm:p-7">
              <h2 className="section-title">{content.areasTitle}</h2>
              <ul className="mt-4 space-y-3 text-sm text-surface-700">
                {content.areas.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-primary-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card p-6 sm:p-7">
              <h2 className="section-title">{content.responseTitle}</h2>
              <p className="mt-4 text-sm leading-7 text-surface-700">{content.responseBody}</p>
            </div>
          </div>

          <section id="connect">
            <ContactGuidePanel locale={locale} />
          </section>
        </div>
      </div>
    </div>
  );
}

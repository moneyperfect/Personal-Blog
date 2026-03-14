import Link from 'next/link';

interface ContactGuidePanelProps {
  locale: string;
  title?: string;
  price?: string;
  showContactLink?: boolean;
}

const CONTACT_EMAIL = 'leizhen2046@gmail.com';
const CONTACT_WECHAT = 'Different709world';
const CONTACT_QQ = '2720838758';

export default function ContactGuidePanel({
  locale,
  title,
  price,
  showContactLink = false,
}: ContactGuidePanelProps) {
  const isZh = locale === 'zh';
  const copy = isZh
    ? {
        badge: '先联系，再继续',
        heading: title ? `如果你对《${title}》感兴趣，先加我好友聊一聊。` : '欢迎先加我好友或发邮件联系我。',
        description:
          '当前站点不公开站内支付能力。你可以先通过微信、QQ 或邮箱联系我，说明你感兴趣的产品、问题或合作方向，我会继续和你对接后续流程。',
        productLabel: '感兴趣的内容',
        priceLabel: '当前标价',
        stepsTitle: '推荐流程',
        steps: [
          '添加我的微信或 QQ，或者直接发邮件。',
          '告诉我你感兴趣的产品名称、用途或想咨询的问题。',
          '我确认需求后，会继续和你沟通后续安排。',
        ],
        contactHint: '联系时带上产品名或需求描述，我会更快回复。',
        channels: '可用联系方式',
        wechat: '微信',
        qq: 'QQ',
        email: '邮箱',
        emailAction: '发送邮件',
        contactAction: '查看联系页',
      }
    : {
        badge: 'まずは相談',
        heading: title ? `「${title}」に興味があれば、まずは私に連絡してください。` : 'まずは WeChat・QQ・メールでご連絡ください。',
        description:
          '現在のサイトではサイト内決済を公開していません。興味のある商品名、相談内容、またはコラボの概要を送っていただければ、その後の流れをご案内します。',
        productLabel: 'ご興味のある内容',
        priceLabel: '表示価格',
        stepsTitle: 'おすすめの流れ',
        steps: [
          'WeChat・QQ を追加するか、メールを送ってください。',
          '商品名や相談内容を簡単に送ってください。',
          '内容を確認したあと、次の進め方をご案内します。',
        ],
        contactHint: '商品名や相談内容があると、より早く返信できます。',
        channels: '連絡先',
        wechat: 'WeChat',
        qq: 'QQ',
        email: 'Email',
        emailAction: 'メールを送る',
        contactAction: 'お問い合わせページへ',
      };

  return (
    <div className="card p-6 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <span className="chip chip-active">{copy.badge}</span>
          <h2 className="mt-4 text-2xl font-semibold text-surface-900">{copy.heading}</h2>
          <p className="mt-2 text-sm text-surface-600 sm:text-base">{copy.description}</p>
        </div>

        {(title || price) && (
          <div className="rounded-google-lg border border-surface-200 bg-surface-50 px-4 py-3 text-right">
            {title ? (
              <>
                <div className="text-xs uppercase tracking-[0.16em] text-surface-500">{copy.productLabel}</div>
                <div className="mt-2 text-base font-semibold text-surface-900">{title}</div>
              </>
            ) : null}
            {price ? (
              <>
                <div className="mt-4 text-xs uppercase tracking-[0.16em] text-surface-500">{copy.priceLabel}</div>
                <div className="mt-2 text-2xl font-semibold text-primary-700">{price}</div>
              </>
            ) : null}
          </div>
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-google-lg border border-amber-200 bg-amber-50/90 p-4 sm:p-5">
          <div className="text-sm font-semibold text-surface-900">{copy.stepsTitle}</div>
          <ol className="mt-3 space-y-2 text-sm text-surface-700">
            {copy.steps.map((step, index) => (
              <li key={step} className="flex gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-xs font-semibold text-primary-700">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-sm text-surface-600">{copy.contactHint}</p>
        </div>

        <div className="rounded-google-lg border border-surface-200 bg-surface-50/90 p-4 sm:p-5">
          <div className="text-sm font-semibold text-surface-900">{copy.channels}</div>
          <div className="mt-4 space-y-3 text-sm text-surface-700">
            <div className="rounded-google border border-white/80 bg-white px-4 py-3">
              <div className="text-xs uppercase tracking-[0.14em] text-surface-500">{copy.wechat}</div>
              <div className="mt-1 font-semibold text-surface-900">{CONTACT_WECHAT}</div>
            </div>
            <div className="rounded-google border border-white/80 bg-white px-4 py-3">
              <div className="text-xs uppercase tracking-[0.14em] text-surface-500">{copy.qq}</div>
              <div className="mt-1 font-semibold text-surface-900">{CONTACT_QQ}</div>
            </div>
            <div className="rounded-google border border-white/80 bg-white px-4 py-3">
              <div className="text-xs uppercase tracking-[0.14em] text-surface-500">{copy.email}</div>
              <div className="mt-1 break-all font-semibold text-surface-900">{CONTACT_EMAIL}</div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            {showContactLink ? (
              <Link href={`/${locale}/contact#connect`} className="btn btn-primary">
                {copy.contactAction}
              </Link>
            ) : null}
            <a href={`mailto:${CONTACT_EMAIL}`} className="btn btn-tonal">
              {copy.emailAction}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

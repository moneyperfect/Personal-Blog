'use client';

import Image from 'next/image';
import Link from 'next/link';

interface ManualPaymentPanelProps {
  locale: string;
  slug?: string;
  title: string;
  price: string;
  compact?: boolean;
  onClose?: () => void;
}

const CONTACT_EMAIL = 'lingxicto@gmail.com';
const CONTACT_WECHAT = 'Different709world';

const qrImages = {
  wechat: {
    src: '/payments/wechat-qr.jpg',
    width: 1279,
    height: 1742,
  },
  alipay: {
    src: '/payments/alipay-qr.jpg',
    width: 1260,
    height: 1890,
  },
} as const;

export default function ManualPaymentPanel({
  locale,
  title,
  price,
  compact = false,
  onClose,
}: ManualPaymentPanelProps) {
  const isZh = locale === 'zh';
  const copy = isZh
    ? {
        badge: '人工确认版',
        heading: '扫码付款后，人工为你处理交付',
        description: '当前阶段使用静态收款码完成付款。支付成功后，请通过微信或邮件发送付款截图、产品名称和联系方式。',
        productLabel: '当前产品',
        priceLabel: '支付金额',
        wechat: '微信支付',
        alipay: '支付宝',
        recommended: '推荐',
        alternative: '备用',
        wechatHint: '推荐优先使用微信扫码支付',
        alipayHint: '也可以使用支付宝扫码完成付款',
        stepsTitle: '付款后这样做',
        steps: [
          '使用微信或支付宝扫码完成支付。',
          '保留付款截图，并备注产品名称。',
          '通过微信或邮件联系我，我会手动确认并处理交付。',
        ],
        eta: '通常会在 24 小时内完成确认和处理。',
        contactHint: '联系时请附上付款截图与产品名称。',
        contact: '支付后联系我',
        email: '发送邮件',
        close: '关闭',
      }
    : {
        badge: 'Manual confirmation',
        heading: 'Pay with the QR codes below and I will fulfill it manually.',
        description: 'This version uses static collection QR codes. After paying, please send the payment screenshot, product name, and your contact details by WeChat or email.',
        productLabel: 'Product',
        priceLabel: 'Price',
        wechat: 'WeChat Pay',
        alipay: 'Alipay',
        recommended: 'Recommended',
        alternative: 'Alternative',
        wechatHint: 'Recommended option for WeChat users',
        alipayHint: 'You can also complete payment with Alipay',
        stepsTitle: 'After you pay',
        steps: [
          'Scan either QR code with WeChat or Alipay.',
          'Keep the payment screenshot and mention the product name.',
          'Contact me by WeChat or email so I can fulfill the order manually.',
        ],
        eta: 'Manual confirmation is usually completed within 24 hours.',
        contactHint: 'Please include your payment screenshot and product name.',
        contact: 'Contact me after payment',
        email: 'Send email',
        close: 'Close',
      };

  const wrapperClassName = compact ? 'card p-5 sm:p-6' : 'card p-6 sm:p-8';

  return (
    <div className={wrapperClassName}>
      {onClose ? (
        <div className="mb-4 flex justify-end">
          <button type="button" onClick={onClose} className="btn btn-tonal">
            {copy.close}
          </button>
        </div>
      ) : null}

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <span className="chip chip-active">{copy.badge}</span>
          <h2 className="mt-4 text-2xl font-semibold text-surface-900">{copy.heading}</h2>
          <p className="mt-2 text-sm sm:text-base text-surface-600">{copy.description}</p>
        </div>

        <div className="rounded-google-lg border border-surface-200 bg-surface-50 px-4 py-3 text-right">
          <div className="text-xs uppercase tracking-[0.16em] text-surface-500">{copy.productLabel}</div>
          <div className="mt-2 text-base font-semibold text-surface-900">{title}</div>
          <div className="mt-4 text-xs uppercase tracking-[0.16em] text-surface-500">{copy.priceLabel}</div>
          <div className="mt-2 text-2xl font-semibold text-primary-700">{price}</div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-[28px] border border-emerald-100 bg-emerald-50/70 p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-lg font-semibold text-surface-900">{copy.wechat}</div>
              <div className="text-sm text-surface-600">{copy.wechatHint}</div>
            </div>
            <span className="chip bg-white text-emerald-700 border-emerald-200">{copy.recommended}</span>
          </div>

          <div className="mt-4 overflow-hidden rounded-[24px] border border-white/80 bg-white shadow-card">
            <Image
              src={qrImages.wechat.src}
              alt={copy.wechat}
              width={qrImages.wechat.width}
              height={qrImages.wechat.height}
              className="h-auto w-full"
              priority
            />
          </div>
        </div>

        <div className="rounded-[28px] border border-sky-100 bg-sky-50/70 p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-lg font-semibold text-surface-900">{copy.alipay}</div>
              <div className="text-sm text-surface-600">{copy.alipayHint}</div>
            </div>
            <span className="chip bg-white text-sky-700 border-sky-200">{copy.alternative}</span>
          </div>

          <div className="mt-4 overflow-hidden rounded-[24px] border border-white/80 bg-white shadow-card">
            <Image
              src={qrImages.alipay.src}
              alt={copy.alipay}
              width={qrImages.alipay.width}
              height={qrImages.alipay.height}
              className="h-auto w-full"
            />
          </div>
        </div>
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
          <p className="mt-4 text-sm text-surface-600">{copy.eta}</p>
        </div>

        <div className="rounded-google-lg border border-surface-200 bg-surface-50/90 p-4 sm:p-5">
          <div className="text-sm font-semibold text-surface-900">{copy.contactHint}</div>
          <div className="mt-4 space-y-3 text-sm text-surface-700">
            <div className="rounded-google border border-white/80 bg-white px-4 py-3">
              <div className="text-xs uppercase tracking-[0.14em] text-surface-500">WeChat</div>
              <div className="mt-1 font-semibold text-surface-900">{CONTACT_WECHAT}</div>
            </div>
            <div className="rounded-google border border-white/80 bg-white px-4 py-3">
              <div className="text-xs uppercase tracking-[0.14em] text-surface-500">Email</div>
              <div className="mt-1 break-all font-semibold text-surface-900">{CONTACT_EMAIL}</div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <Link href={`/${locale}/contact`} className="btn btn-primary">
              {copy.contact}
            </Link>
            <a href={`mailto:${CONTACT_EMAIL}`} className="btn btn-tonal">
              {copy.email}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

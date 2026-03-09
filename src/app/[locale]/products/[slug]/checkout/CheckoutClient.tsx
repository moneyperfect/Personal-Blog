'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface CheckoutClientProps {
  locale: string;
  slug: string;
  title: string;
  price: string;
  paymentMethods: string[];
}

interface CheckoutResponse {
  ok?: boolean;
  error?: string;
  orderNo?: string;
  status?: string;
  qrContent?: string;
}

interface OrderStatusResponse {
  ok?: boolean;
  status?: string;
  provider?: string;
  fulfillmentUrl?: string | null;
  error?: string;
}

export default function CheckoutClient({
  locale,
  slug,
  title,
  price,
  paymentMethods,
}: CheckoutClientProps) {
  const [email, setEmail] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<'wechat' | 'alipay' | null>(null);
  const [creating, setCreating] = useState(false);
  const [orderNo, setOrderNo] = useState('');
  const [status, setStatus] = useState<'idle' | 'pending' | 'paid' | 'failed'>('idle');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [notice, setNotice] = useState('');
  const [fulfillmentUrl, setFulfillmentUrl] = useState('');

  useEffect(() => {
    if (!orderNo || status !== 'pending') {
      return;
    }

    const timer = window.setInterval(async () => {
      try {
        const response = await fetch(`/api/payments/orders/${orderNo}`);
        const data = (await response.json()) as OrderStatusResponse;

        if (!response.ok || !data.ok) {
          return;
        }

        if (data.status === 'paid') {
          setStatus('paid');
          setFulfillmentUrl(data.fulfillmentUrl || '');
          setNotice(locale === 'zh' ? '支付成功，交付链接已就绪。' : '支払いが完了しました。受け取りリンクを表示できます。');
          window.clearInterval(timer);
        }
      } catch (error) {
        console.error(error);
      }
    }, 3000);

    return () => window.clearInterval(timer);
  }, [locale, orderNo, status]);

  const createCheckout = async (provider: 'wechat' | 'alipay') => {
    setSelectedProvider(provider);
    setCreating(true);
    setNotice(locale === 'zh' ? '正在创建订单...' : '注文を作成しています...');

    try {
      const response = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          locale,
          provider,
          customerEmail: email,
        }),
      });
      const data = (await response.json()) as CheckoutResponse;

      if (!response.ok || !data.ok || !data.orderNo || !data.qrContent) {
        setStatus('failed');
        setNotice(data.error || (locale === 'zh' ? '创建支付订单失败。' : '支払い注文の作成に失敗しました。'));
        return;
      }

      const QRCode = await import('qrcode');
      const dataUrl = await QRCode.toDataURL(data.qrContent, {
        width: 280,
        margin: 2,
      });

      setOrderNo(data.orderNo);
      setQrDataUrl(dataUrl);
      setStatus('pending');
      setNotice(locale === 'zh' ? '请使用对应应用扫码完成支付。' : '対応するアプリでコードを読み取って支払ってください。');
    } catch (error) {
      console.error(error);
      setStatus('failed');
      setNotice(locale === 'zh' ? '创建支付订单失败。' : '支払い注文の作成に失敗しました。');
    } finally {
      setCreating(false);
    }
  };

  const providerLabels = {
    wechat: locale === 'zh' ? '微信支付' : 'WeChat Pay',
    alipay: locale === 'zh' ? '支付宝支付' : 'Alipay',
  };

  return (
    <div className="page-shell">
      <div className="page-container page-width-content">
        <nav className="pt-8">
          <Link href={`/${locale}/products/${slug}`} className="link text-sm font-medium">
            {locale === 'zh' ? '返回产品详情' : '商品詳細へ戻る'}
          </Link>
        </nav>

        <div className="page-header pb-4">
          <h1 className="page-title">{locale === 'zh' ? '站内结账' : 'サイト内チェックアウト'}</h1>
          <p className="page-description">{title}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6">
          <div className="card p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-surface-500">{locale === 'zh' ? '当前产品' : '商品'}</p>
                <h2 className="text-xl font-semibold text-surface-900">{title}</h2>
              </div>
              <span className="text-2xl font-semibold text-primary-600">{price}</span>
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">
                {locale === 'zh' ? '购买邮箱（可选）' : '受信用メール（任意）'}
              </label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="input-base"
                placeholder={locale === 'zh' ? '用于接收交付或联系' : '受け取りや連絡に使用'}
              />
            </div>

            <div>
              <p className="text-sm font-medium text-surface-700 mb-3">
                {locale === 'zh' ? '选择支付方式' : '支払い方法を選択'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(['wechat', 'alipay'] as const)
                  .filter((provider) => paymentMethods.includes(provider))
                  .map((provider) => (
                    <button
                      key={provider}
                      type="button"
                      onClick={() => createCheckout(provider)}
                      disabled={creating}
                      className={`rounded-google-lg border px-4 py-4 text-left transition-all ${selectedProvider === provider ? 'border-primary-500 bg-primary-50' : 'border-surface-300 bg-white hover:border-primary-200'} ${creating ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                      <div className="text-sm font-semibold text-surface-900">{providerLabels[provider]}</div>
                      <div className="text-xs text-surface-500 mt-1">
                        {locale === 'zh' ? '生成专属订单二维码' : '専用の支払いコードを生成'}
                      </div>
                    </button>
                  ))}
              </div>
            </div>

            {notice && (
              <div className={`rounded-md border px-3 py-2 text-sm ${status === 'failed' ? 'border-red-200 bg-red-50 text-red-700' : 'border-blue-200 bg-blue-50 text-blue-700'}`}>
                {notice}
              </div>
            )}

            {orderNo && (
              <div className="text-xs text-surface-500">
                {locale === 'zh' ? '订单号' : '注文番号'}: {orderNo}
              </div>
            )}
          </div>

          <div className="card p-6 sm:p-8">
            {status === 'paid' ? (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-surface-900">
                  {locale === 'zh' ? '支付成功' : '支払い完了'}
                </h2>
                <p className="text-sm text-surface-600">
                  {locale === 'zh' ? '订单已完成，下面是你的交付入口。' : '注文が完了しました。以下から受け取りに進めます。'}
                </p>
                {fulfillmentUrl ? (
                  <a href={fulfillmentUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                    {locale === 'zh' ? '打开交付链接' : '受け取りリンクを開く'}
                  </a>
                ) : (
                  <p className="text-sm text-surface-600">
                    {locale === 'zh' ? '暂未配置交付链接，请稍后联系站长。' : '受け取りリンクはまだ設定されていません。'}
                  </p>
                )}
              </div>
            ) : qrDataUrl ? (
              <div className="space-y-4 text-center">
                <h2 className="text-xl font-semibold text-surface-900">
                  {selectedProvider ? providerLabels[selectedProvider] : (locale === 'zh' ? '扫码支付' : 'コード決済')}
                </h2>
                <p className="text-sm text-surface-600">
                  {locale === 'zh' ? '支付成功后页面会自动更新。' : '支払い完了後にページが自動更新されます。'}
                </p>
                <Image
                  src={qrDataUrl}
                  alt="payment qrcode"
                  width={280}
                  height={280}
                  className="mx-auto rounded-google-lg border border-surface-200"
                />
              </div>
            ) : (
              <div className="text-center text-sm text-surface-500 py-12">
                {locale === 'zh' ? '选择支付方式后，这里会显示订单二维码。' : '支払い方法を選ぶと、ここにコードが表示されます。'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

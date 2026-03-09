'use client';

import { useState } from 'react';
import { trackPurchaseClick } from '@/lib/analytics';
import ManualPaymentDialog from '@/components/payments/ManualPaymentDialog';

interface ProductDetailClientProps {
  slug: string;
  title: string;
  locale: string;
  price?: string;
  purchaseUrl?: string;
  large?: boolean;
}

export function ProductDetailClient({
  slug,
  title,
  locale,
  price,
  purchaseUrl,
  large = false,
}: ProductDetailClientProps) {
  const [showManualPayment, setShowManualPayment] = useState(false);
  const buttonText = locale === 'zh' ? '立即付款' : '今すぐ支払う';

  const handleClick = () => {
    trackPurchaseClick(slug, title);

    if (purchaseUrl) {
      const target = purchaseUrl.startsWith('http') ? '_blank' : '_self';
      window.open(purchaseUrl, target, target === '_blank' ? 'noopener,noreferrer' : undefined);
      return;
    }

    setShowManualPayment(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={`btn btn-primary ${large ? 'px-8 py-4 text-base sm:text-lg' : 'px-6 py-3'}`}
      >
        {buttonText}
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </button>

      <ManualPaymentDialog
        open={showManualPayment}
        locale={locale}
        slug={slug}
        title={title}
        price={price || ''}
        onClose={() => setShowManualPayment(false)}
      />
    </>
  );
}

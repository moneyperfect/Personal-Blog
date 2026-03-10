'use client';

import { useRouter } from 'next/navigation';
import { trackPurchaseClick } from '@/lib/analytics';

interface ProductDetailClientProps {
  slug: string;
  title: string;
  locale: string;
  price?: string;
  large?: boolean;
}

export function ProductDetailClient({
  slug,
  title,
  locale,
  large = false,
}: ProductDetailClientProps) {
  const router = useRouter();
  const buttonText = locale === 'zh' ? '咨询购买' : '購入を相談する';

  const handleClick = () => {
    trackPurchaseClick(slug, title);
    router.push(`/${locale}/products/${slug}/checkout`);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`btn btn-primary ${large ? 'px-8 py-4 text-base sm:text-lg' : 'px-6 py-3'}`}
    >
      {buttonText}
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
        />
      </svg>
    </button>
  );
}

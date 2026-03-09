'use client';

import { useEffect } from 'react';
import ManualPaymentPanel from '@/components/payments/ManualPaymentPanel';

interface ManualPaymentDialogProps {
  open: boolean;
  locale: string;
  slug: string;
  title: string;
  price: string;
  onClose: () => void;
}

export default function ManualPaymentDialog({
  open,
  locale,
  slug,
  title,
  price,
  onClose,
}: ManualPaymentDialogProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        aria-label="Close payment dialog"
        onClick={onClose}
        className="absolute inset-0 bg-surface-900/50 backdrop-blur-sm"
      />
      <div className="relative z-10 max-h-[calc(100vh-2rem)] w-full max-w-6xl overflow-y-auto">
        <ManualPaymentPanel
          compact
          locale={locale}
          slug={slug}
          title={title}
          price={price}
          onClose={onClose}
        />
      </div>
    </div>
  );
}

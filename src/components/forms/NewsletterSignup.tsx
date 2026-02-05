'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { trackWaitlistSubmit } from '@/lib/analytics';

export function NewsletterSignup() {
    const t = useTranslations('home.newsletter');
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const endpoint = process.env.NEXT_PUBLIC_FORM_ENDPOINT;
            if (!endpoint) {
                throw new Error('Form endpoint not configured');
            }

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    email,
                    _subject: 'Newsletter Subscription',
                    type: 'newsletter',
                }),
            });

            if (response.ok) {
                setIsSuccess(true);
                trackWaitlistSubmit('newsletter');
                setEmail('');
            }
        } catch (err) {
            console.error('Form submission error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="flex items-center gap-2 text-accent-green">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-medium">Subscribed!</span>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
                type="email"
                required
                placeholder={t('placeholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input flex-1"
            />
            <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary px-6 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSubmitting ? '...' : t('button')}
            </button>
        </form>
    );
}

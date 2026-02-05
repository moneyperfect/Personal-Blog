'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { trackWaitlistSubmit } from '@/lib/analytics';

export function WaitlistForm() {
    const t = useTranslations('saas.waitlist');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: '',
        needs: '',
    });

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
                    ...formData,
                    _subject: 'New SaaS Waitlist Signup',
                }),
            });

            if (response.ok) {
                setIsSuccess(true);
                trackWaitlistSubmit('saas-page');
                setFormData({ name: '', email: '', role: '', needs: '' });
            }
        } catch (err) {
            console.error('Form submission error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="card p-6 text-center border-accent-green/30 bg-accent-green/5">
                <svg
                    className="w-12 h-12 text-accent-green mx-auto mb-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
                <p className="text-lg font-medium text-accent-green">{t('success')}</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-surface-700 mb-1">
                    {t('name')} *
                </label>
                <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input"
                />
            </div>

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-surface-700 mb-1">
                    {t('email')} *
                </label>
                <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input"
                />
            </div>

            <div>
                <label htmlFor="role" className="block text-sm font-medium text-surface-700 mb-1">
                    {t('role')}
                </label>
                <input
                    type="text"
                    id="role"
                    placeholder={t('rolePlaceholder')}
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="input"
                />
            </div>

            <div>
                <label htmlFor="needs" className="block text-sm font-medium text-surface-700 mb-1">
                    {t('needs')}
                </label>
                <textarea
                    id="needs"
                    rows={3}
                    placeholder={t('needsPlaceholder')}
                    value={formData.needs}
                    onChange={(e) => setFormData({ ...formData, needs: e.target.value })}
                    className="input resize-none"
                />
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSubmitting ? '...' : t('submit')}
            </button>
        </form>
    );
}

'use client';

import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';

export function Footer() {
    const t = useTranslations('footer');
    const locale = useLocale();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-surface-200 border-t border-surface-300">
            <div className="max-w-page mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex flex-col items-center md:items-start gap-2">
                        <Link
                            href={`/${locale}`}
                            className="flex items-center gap-2 font-semibold text-lg text-surface-900"
                        >
                            <svg className="w-8 h-8 text-surface-900" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                            </svg>
                            <span>NAS</span>
                        </Link>
                        <p className="text-sm text-surface-600">
                            © {currentYear} NAS Digital Products
                        </p>
                    </div>

                    <nav className="flex flex-wrap justify-center gap-6">
                        <Link
                            href={`/${locale}/about`}
                            className="text-sm text-surface-600 hover:text-accent transition-colors"
                        >
                            {t('about')}
                        </Link>
                        <Link
                            href={`/${locale}/privacy`}
                            className="text-sm text-surface-600 hover:text-accent transition-colors"
                        >
                            {t('privacy')}
                        </Link>
                        <Link
                            href={`/${locale}/terms`}
                            className="text-sm text-surface-600 hover:text-accent transition-colors"
                        >
                            {t('terms')}
                        </Link>
                    </nav>
                </div>
            </div>
        </footer>
    );
}

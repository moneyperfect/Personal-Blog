'use client';

import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';

const footerLinks = [
    { key: 'about', href: '/about' },
    { key: 'privacy', href: '/privacy' },
    { key: 'terms', href: '/terms' },
    { key: 'contact', href: '/contact' },
];

export function Footer() {
    const t = useTranslations('footer');
    const locale = useLocale();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-surface-50 border-t border-surface-200">
            <div className="max-w-page mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    {/* Logo and Copyright */}
                    <div className="flex flex-col items-center md:items-start gap-2">
                        <Link
                            href={`/${locale}`}
                            className="flex items-center gap-2 font-semibold text-lg text-surface-900"
                        >
                            <svg className="w-8 h-8 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                            </svg>
                            <span>Studio</span>
                        </Link>
                        <p className="text-sm text-surface-600">
                            © {currentYear} Digital Product Studio
                        </p>
                    </div>

                    {/* Links */}
                    <nav className="flex flex-wrap justify-center gap-6">
                        {footerLinks.map((link) => (
                            <Link
                                key={link.key}
                                href={`/${locale}${link.href}`}
                                className="text-sm text-surface-600 hover:text-primary-600 transition-colors"
                            >
                                {t(link.key)}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>
        </footer>
    );
}

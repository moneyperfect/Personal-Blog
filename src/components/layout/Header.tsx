'use client';

import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { LanguageSwitcher } from './LanguageSwitcher';

const navItems = [
    { key: 'home', href: '' },
    { key: 'products', href: '/products' },
    { key: 'saas', href: '/saas' },
    { key: 'library', href: '/library' },
    { key: 'workWithMe', href: '/work-with-me' },
];

export function Header() {
    const t = useTranslations('nav');
    const locale = useLocale();
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const isActive = (href: string) => {
        const localePath = `/${locale}${href}`;
        if (href === '') {
            return pathname === `/${locale}` || pathname === `/${locale}/`;
        }
        return pathname.startsWith(localePath);
    };

    return (
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-surface-200">
            <div className="max-w-page mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link
                        href={`/${locale}`}
                        className="flex items-center gap-2 font-semibold text-lg text-surface-900 hover:text-primary-600 transition-colors"
                    >
                        <svg className="w-8 h-8 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                        <span className="hidden sm:inline">NAS</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.key}
                                href={`/${locale}${item.href}`}
                                className={`nav-link ${isActive(item.href) ? 'nav-link-active' : ''}`}
                            >
                                {t(item.key)}
                            </Link>
                        ))}
                    </nav>

                    {/* Right side */}
                    <div className="flex items-center gap-2">
                        <LanguageSwitcher />

                        {/* Mobile menu button */}
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 rounded-google text-surface-600 hover:bg-surface-100"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? (
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <nav className="md:hidden py-4 border-t border-surface-200">
                        <div className="flex flex-col gap-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.key}
                                    href={`/${locale}${item.href}`}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`nav-link ${isActive(item.href) ? 'nav-link-active' : ''}`}
                                >
                                    {t(item.key)}
                                </Link>
                            ))}
                        </div>
                    </nav>
                )}
            </div>
        </header>
    );
}

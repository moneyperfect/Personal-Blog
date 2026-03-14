'use client';

import { AnimatePresence, motion } from 'framer-motion';
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
    { key: 'about', href: '/about' },
    { key: 'workWithMe', href: '/work-with-me' },
];

export function Header() {
    const t = useTranslations('nav');
    const locale = useLocale();
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const isAboutPage = pathname === `/${locale}/about`;

    const getNavLabel = (key: string) => {
        if (key === 'about') {
            return locale === 'zh' ? '关于我' : '私について';
        }

        return t(key);
    };

    const isActive = (href: string) => {
        const localePath = `/${locale}${href}`;
        if (href === '') {
            return pathname === `/${locale}` || pathname === `/${locale}/`;
        }

        return pathname.startsWith(localePath);
    };

    return (
        <header
            className={`sticky top-0 z-50 border-b backdrop-blur-md transition-colors ${
                isAboutPage
                    ? 'border-[#e7e1d6] bg-[#faf7f1]/86'
                    : 'border-surface-200 bg-white/90'
            }`}
        >
            <div className="max-w-page mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <Link
                        href={`/${locale}`}
                        className={`flex items-center gap-2 text-lg font-semibold transition-colors ${
                            isAboutPage
                                ? 'text-[#23344a] hover:text-[#305780]'
                                : 'text-surface-900 hover:text-primary-600'
                        }`}
                    >
                        <svg
                            className={`h-8 w-8 ${isAboutPage ? 'text-[#5e85b2]' : 'text-primary-600'}`}
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                        <span className="hidden sm:inline">NAS</span>
                    </Link>

                    <nav className="hidden items-center gap-1 md:flex">
                        {navItems.map((item) => {
                            const active = isActive(item.href);

                            return (
                                <Link
                                    key={item.key}
                                    href={`/${locale}${item.href}`}
                                    className={`relative rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                                        active
                                            ? isAboutPage
                                                ? 'text-[#285987]'
                                                : 'text-primary-600'
                                            : isAboutPage
                                                ? 'text-[#5e6d81] hover:bg-white/70 hover:text-[#23344a]'
                                                : 'text-surface-600 hover:bg-surface-50 hover:text-surface-900'
                                    }`}
                                >
                                    {active && (
                                        <motion.div
                                            layoutId="nav-indicator"
                                            className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                                                isAboutPage ? 'bg-[#77a7d7]' : 'bg-primary-600'
                                            }`}
                                            initial={false}
                                            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                                        />
                                    )}
                                    {getNavLabel(item.key)}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="flex items-center gap-2">
                        <LanguageSwitcher />

                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className={`rounded-google p-2 md:hidden ${
                                isAboutPage
                                    ? 'text-[#58697d] hover:bg-white/70'
                                    : 'text-surface-600 hover:bg-surface-100'
                            }`}
                            aria-label="Toggle menu"
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                {mobileMenuOpen ? (
                                    <motion.svg
                                        key="close"
                                        initial={{ rotate: -90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: 90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </motion.svg>
                                ) : (
                                    <motion.svg
                                        key="menu"
                                        initial={{ rotate: 90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: -90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                    </motion.svg>
                                )}
                            </AnimatePresence>
                        </button>
                    </div>
                </div>

                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.nav
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className={`overflow-hidden border-t md:hidden ${
                                isAboutPage
                                    ? 'border-[#ece5d8] bg-[#faf7f1]/98'
                                    : 'border-surface-200'
                            }`}
                        >
                            <div className="flex flex-col gap-1 py-4">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.key}
                                        href={`/${locale}${item.href}`}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`nav-link ${
                                            isAboutPage
                                                ? isActive(item.href)
                                                    ? 'bg-white/90 text-[#285987]'
                                                    : 'text-[#5e6d81] hover:bg-white/75 hover:text-[#23344a]'
                                                : isActive(item.href)
                                                    ? 'nav-link-active'
                                                    : ''
                                        }`}
                                    >
                                        {getNavLabel(item.key)}
                                    </Link>
                                ))}
                            </div>
                        </motion.nav>
                    )}
                </AnimatePresence>
            </div>
        </header>
    );
}

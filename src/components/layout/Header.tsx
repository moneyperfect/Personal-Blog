'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { LanguageSwitcher } from './LanguageSwitcher';

const navItems = [
    { key: 'blog', href: '/blog' },
    { key: 'projects', href: '/projects' },
    { key: 'about', href: '/about' },
];

export function Header() {
    const t = useTranslations('nav');
    const locale = useLocale();
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const isActive = (href: string) => {
        const localePath = `/${locale}${href}`;
        return pathname.startsWith(localePath);
    };

    return (
        <header className="sticky top-0 z-50 border-b border-surface-300 bg-surface-100/90 backdrop-blur-md">
            <div className="max-w-page mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <Link
                        href={`/${locale}`}
                        className="flex items-center gap-2 text-lg font-semibold text-surface-900 hover:text-accent transition-colors"
                    >
                        <svg
                            className="h-8 w-8 text-surface-900"
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
                                            ? 'text-accent'
                                            : 'text-surface-600 hover:bg-surface-200 hover:text-surface-900'
                                    }`}
                                >
                                    {active && (
                                        <motion.div
                                            layoutId="nav-indicator"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                                            initial={false}
                                            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                                        />
                                    )}
                                    {t(item.key)}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="flex items-center gap-2">
                        <LanguageSwitcher />

                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="rounded-google p-2 text-surface-600 hover:bg-surface-200 md:hidden"
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
                            className="overflow-hidden border-t border-surface-300 md:hidden"
                        >
                            <div className="flex flex-col gap-1 py-4">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.key}
                                        href={`/${locale}${item.href}`}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`nav-link ${
                                            isActive(item.href) ? 'nav-link-active' : ''
                                        }`}
                                    >
                                        {t(item.key)}
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

'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useTransition } from 'react';

const locales = [
    { code: 'zh', label: '中文' },
    { code: 'ja', label: '日本語' },
];

export function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    const handleChange = (newLocale: string) => {
        // Replace current locale in path with new locale
        const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
        startTransition(() => {
            router.push(newPath);
        });
    };

    return (
        <div className="relative">
            <select
                value={locale}
                onChange={(e) => handleChange(e.target.value)}
                disabled={isPending}
                className="select pr-8 cursor-pointer disabled:opacity-50"
            >
                {locales.map((loc) => (
                    <option key={loc.code} value={loc.code}>
                        {loc.label}
                    </option>
                ))}
            </select>
            <svg
                className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500 pointer-events-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
        </div>
    );
}

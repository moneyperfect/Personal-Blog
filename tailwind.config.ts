import type { Config } from "tailwindcss";

export default {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Google Safety Settings inspired palette
                app: '#f6f7f9',
                primary: {
                    50: '#e8f0fe',
                    100: '#d2e3fc',
                    200: '#aecbfa',
                    300: '#8ab4f8',
                    400: '#669df6',
                    500: '#4285f4',
                    600: '#1a73e8',
                    700: '#1967d2',
                    800: '#185abc',
                    900: '#174ea6',
                },
                surface: {
                    50: '#ffffff',
                    100: '#f8f9fa',
                    200: '#f1f3f4',
                    300: '#e3e6ea',
                    400: '#dadce0',
                    500: '#c7c9cc',
                    600: '#9aa0a6',
                    700: '#80868b',
                    800: '#5f6368',
                    900: '#3c4043',
                },
                accent: {
                    green: '#34a853',
                    yellow: '#fbbc04',
                    red: '#ea4335',
                    blue: '#4285f4',
                },
            },
            fontFamily: {
                sans: ['var(--font-noto-sans)', 'system-ui', 'sans-serif'],
                display: ['var(--font-noto-sans)', 'system-ui', 'sans-serif'],
            },
            boxShadow: {
                'elevated-1': '0 1px 2px rgba(60, 64, 67, 0.16), 0 1px 3px 1px rgba(60, 64, 67, 0.08)',
                'elevated-2': '0 1px 2px rgba(60, 64, 67, 0.18), 0 2px 6px 2px rgba(60, 64, 67, 0.10)',
                'elevated-3': '0 1px 3px rgba(60, 64, 67, 0.2), 0 4px 8px 3px rgba(60, 64, 67, 0.12)',
                'elevated-4': '0 2px 3px rgba(60, 64, 67, 0.24), 0 6px 10px 4px rgba(60, 64, 67, 0.14)',
                card: '0 1px 2px rgba(60, 64, 67, 0.12), 0 1px 3px 1px rgba(60, 64, 67, 0.08)',
                'card-hover': '0 2px 4px rgba(60, 64, 67, 0.16), 0 4px 8px 3px rgba(60, 64, 67, 0.10)',
            },
            borderRadius: {
                'google': '12px',
                'google-lg': '16px',
                'google-xl': '20px',
                'pill': '999px',
            },
            maxWidth: {
                page: '1200px',
                content: '880px',
                reading: '740px',
            },
        },
    },
    plugins: [],
} satisfies Config;

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
                app: '#FAF7F1',
                surface: {
                    50: '#FFFFFF',
                    100: '#FAF7F1',
                    200: '#F3EFE8',
                    300: '#E5E0D8',
                    400: '#D4CFC7',
                    500: '#9B9B9F',
                    600: '#6B6B6F',
                    700: '#4A4A4E',
                    800: '#2D2D31',
                    900: '#1D1D1F',
                },
                accent: '#C46849',
            },
            fontFamily: {
                sans: ['var(--font-noto-sans)', 'system-ui', 'sans-serif'],
                display: ['var(--font-playfair)', 'Georgia', 'serif'],
            },
            boxShadow: {
                card: 'none',
                'card-hover': 'none',
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
                reading: '780px',
            },
        },
    },
    plugins: [],
} satisfies Config;

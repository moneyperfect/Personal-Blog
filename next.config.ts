import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');
const remotePatterns: NonNullable<NextConfig['images']>['remotePatterns'] = [];

if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
  try {
    const url = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL);
    remotePatterns.push({
      protocol: url.protocol.replace(':', '') as 'http' | 'https',
      hostname: url.hostname,
      port: url.port,
    });
  } catch {
    console.warn('Invalid NEXT_PUBLIC_SUPABASE_URL, skipping remote image pattern registration.');
  }
}

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  images: remotePatterns.length > 0 ? { remotePatterns } : undefined,
  turbopack: {
    root: __dirname,
  },
};

export default withNextIntl(nextConfig);

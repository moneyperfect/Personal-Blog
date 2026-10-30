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
  async headers() {
    return [
      {
        source: '/assets/runtime/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/assets/runtime/models/:path*',
        headers: [
          { key: 'Content-Encoding', value: 'br' },
          { key: 'Content-Type', value: 'model/gltf-binary' },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);

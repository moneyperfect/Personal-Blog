import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { GoogleAnalytics } from "@/lib/analytics";
import { PwaRegister } from "@/components/PwaRegister";
import { getSiteUrl } from "@/lib/seo";
import { WebVitalsReporter } from "@/components/analytics/WebVitalsReporter";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "NAS Digital Products",
    template: "%s | NAS Digital Products",
  },
  description: "High-quality digital products and resources to help you launch faster",
  keywords: ["digital products", "templates", "resources", "SaaS", "playbooks"],
  authors: [{ name: "NAS Digital Products" }],
  creator: "NAS Digital Products",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "NAS Digital Products",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    locale: "zh_CN",
    alternateLocale: "ja_JP",
    siteName: "NAS Digital Products",
    images: [
      {
        url: "/icons/icon-512.png",
        width: 512,
        height: 512,
        alt: "NAS Digital Products",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@nas",
    images: ["/icons/icon-512.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#1a73e8",
};

// AdSense configuration
const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
const enableAdsense = process.env.NEXT_PUBLIC_ENABLE_ADSENSE === 'true';
const isProduction = process.env.NODE_ENV === 'production';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body className="antialiased">
        <GoogleAnalytics />
        <WebVitalsReporter />
        <PwaRegister />

        {/* Google AdSense - 仅在生产环境且启用时加载 */}
        {isProduction && enableAdsense && adsenseClient && (
          <Script
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            strategy="afterInteractive"
            crossOrigin="anonymous"
          />
        )}

        {children}
      </body>
    </html>
  );
}

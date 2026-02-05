import type { Metadata, Viewport } from "next";
import "./globals.css";
import { GoogleAnalytics } from "@/lib/analytics";
import { PwaRegister } from "@/components/PwaRegister";

export const metadata: Metadata = {
  title: {
    default: "Digital Product Studio",
    template: "%s | Digital Product Studio",
  },
  description: "High-quality digital products and resources to help you launch faster",
  keywords: ["digital products", "templates", "resources", "SaaS", "playbooks"],
  authors: [{ name: "Digital Product Studio" }],
  creator: "Digital Product Studio",
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
    title: "Digital Product Studio",
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    alternateLocale: "ja_JP",
    siteName: "Digital Product Studio",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#1a73e8",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body className="antialiased">
        <GoogleAnalytics />
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}

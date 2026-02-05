import type { Metadata } from "next";
import "./globals.css";
import { GoogleAnalytics } from "@/lib/analytics";

export const metadata: Metadata = {
  title: {
    default: "Digital Product Studio",
    template: "%s | Digital Product Studio",
  },
  description: "High-quality digital products and resources to help you launch faster",
  keywords: ["digital products", "templates", "resources", "SaaS", "playbooks"],
  authors: [{ name: "Digital Product Studio" }],
  creator: "Digital Product Studio",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body className="bg-white text-surface-900 antialiased">
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}

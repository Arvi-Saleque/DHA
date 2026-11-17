import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteShell from "@/components/common/site-shell";
import { SCHOOL, SCHOOL_JSON_LD, SITE_DESCRIPTION, SITE_URL } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const DEFAULT_TITLE = "দারুল হিকমাহ একাডেমি, খুলনা | হিফজ ও জেনারেল শিক্ষা";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: DEFAULT_TITLE, template: `%s | ${SCHOOL.nameBn}` },
  description: SITE_DESCRIPTION,
  keywords: [
    "দারুল হিকমাহ একাডেমি খুলনা",
    "Darul Hikmah Academy Khulna",
    "খুলনা হিফজ মাদ্রাসা",
    "খুলনা ইসলামিক স্কুল",
    "হিফজ ও জেনারেল সমন্বিত",
    "বালিকা মাদ্রাসা খুলনা",
    "Islamic school Khulna",
    "Hifz madrasa Khulna",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SCHOOL.nameBn,
    locale: "bn_BD",
    title: DEFAULT_TITLE,
    description: SITE_DESCRIPTION,
    url: "/",
    images: ["/images/cover.png"],
  },
  icons: {
    icon: [
      { url: "/images/favicon.ico" },
      { url: "/images/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/images/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/images/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/images/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: { url: "/images/apple-touch-icon.png", sizes: "180x180" },
  },
};

export const viewport = { themeColor: "#0891b2" };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHOOL_JSON_LD) }}
        />
        <SiteShell>{children}</SiteShell>
        <GoogleAnalytics gaId="G-E7772SZ5HK" />
      </body>
    </html>
  );
}

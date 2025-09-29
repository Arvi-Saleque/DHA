import "./globals.css";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = { 
  title: "Excellence in Islamic Education | Madrasa Management System",
  description: "Nurturing young minds with traditional Islamic values and modern educational excellence. Join our community of learners dedicated to academic achievement and spiritual growth.",
  keywords: "madrasa, Islamic education, traditional learning, academic excellence, spiritual growth",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-white text-gray-900 antialiased">{children}</body>
    </html>
  );
}

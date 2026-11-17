import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Admin Dashboard - Madrasa Management" },
  description: "Admin panel for madrasa management system",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}

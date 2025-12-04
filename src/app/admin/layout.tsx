import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard - Madrasa Management",
  description: "Admin panel for madrasa management system",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}

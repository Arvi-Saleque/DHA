"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/common/navbar";
import Footer from "@/components/common/footer";
import LoadingScreen from "@/components/common/loading-screen";

/** Public pages get the navbar and footer; admin pages render alone. */
export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return (
      <>
        <LoadingScreen />
        {children}
      </>
    );
  }

  return (
    <>
      <LoadingScreen />
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}

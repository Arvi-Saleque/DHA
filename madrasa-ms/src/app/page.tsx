import { prisma } from "@/lib/db";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const settings = await prisma.siteSetting.findUnique({ where: { id: 1 } });

  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <AboutSection />
    </main>
  );
}

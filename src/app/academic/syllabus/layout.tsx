import { pageMeta } from "@/lib/site";

export const metadata = pageMeta("সিলেবাস", "দারুল হিকমাহ একাডেমি, খুলনার শ্রেণিভিত্তিক সিলেবাস।", "/academic/syllabus");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

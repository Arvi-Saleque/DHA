import { pageMeta } from "@/lib/site";

export const metadata = pageMeta("আজকের হোমওয়ার্ক", "দারুল হিকমাহ একাডেমি, খুলনার শ্রেণিভিত্তিক দৈনিক হোমওয়ার্ক।", "/academic/assignments");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

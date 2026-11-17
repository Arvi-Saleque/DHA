import { pageMeta } from "@/lib/site";

export const metadata = pageMeta("একাডেমিক ক্যালেন্ডার", "দারুল হিকমাহ একাডেমি, খুলনার বছরের ছুটি, পরীক্ষা ও অনুষ্ঠানের ক্যালেন্ডার।", "/academic/calendar");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

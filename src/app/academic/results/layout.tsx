import { pageMeta } from "@/lib/site";

export const metadata = pageMeta("পরীক্ষার ফলাফল", "দারুল হিকমাহ একাডেমি, খুলনার পরীক্ষার ফলাফল।", "/academic/results");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

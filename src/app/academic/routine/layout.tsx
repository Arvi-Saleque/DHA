import { pageMeta } from "@/lib/site";

export const metadata = pageMeta("ক্লাস রুটিন", "দারুল হিকমাহ একাডেমি, খুলনার ক্লাস রুটিন।", "/academic/routine");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

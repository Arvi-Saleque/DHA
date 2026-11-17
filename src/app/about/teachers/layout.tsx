import { pageMeta } from "@/lib/site";

export const metadata = pageMeta("শিক্ষকমণ্ডলী", "দারুল হিকমাহ একাডেমি, খুলনার হিফজ ও জেনারেল বিভাগের শিক্ষক-শিক্ষিকাদের পরিচিতি।", "/about/teachers");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

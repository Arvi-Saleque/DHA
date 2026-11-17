import { pageMeta } from "@/lib/site";

export const metadata = pageMeta("ছবির গ্যালারি", "দারুল হিকমাহ একাডেমি, খুলনার শিক্ষার্থী, ক্লাস ও অনুষ্ঠানের ছবি।", "/gallery");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

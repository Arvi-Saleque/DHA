import { pageMeta } from "@/lib/site";

export const metadata = pageMeta("খবর ও ইভেন্ট", "দারুল হিকমাহ একাডেমি, খুলনার সর্বশেষ খবর, নোটিশ, অনুষ্ঠান ও অর্জন।", "/news-events");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

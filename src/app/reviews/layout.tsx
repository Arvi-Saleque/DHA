import { pageMeta } from "@/lib/site";

export const metadata = pageMeta("অভিভাবকদের মতামত", "দারুল হিকমাহ একাডেমি, খুলনা সম্পর্কে অভিভাবক ও শিক্ষার্থীদের মতামত।", "/reviews");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

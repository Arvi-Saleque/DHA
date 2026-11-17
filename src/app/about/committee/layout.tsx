import { pageMeta } from "@/lib/site";

export const metadata = pageMeta("পরিচালনা কমিটি", "দারুল হিকমাহ একাডেমি, খুলনার পরিচালনা কমিটির সদস্যদের পরিচিতি।", "/about/committee");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

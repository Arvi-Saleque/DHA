import { pageMeta } from "@/lib/site";

export const metadata = pageMeta("ভর্তি ও মাসিক ফি", "দারুল হিকমাহ একাডেমি, খুলনার ভর্তি ফি ও মাসিক বেতনের তালিকা।", "/academic/admission-fee");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

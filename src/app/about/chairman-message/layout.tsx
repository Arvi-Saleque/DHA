import { pageMeta } from "@/lib/site";

export const metadata = pageMeta("চেয়ারম্যানের বাণী", "দারুল হিকমাহ একাডেমি, খুলনার চেয়ারম্যানের বাণী।", "/about/chairman-message");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

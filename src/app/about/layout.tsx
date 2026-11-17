import { pageMeta } from "@/lib/site";

export const metadata = pageMeta("আমাদের সম্পর্কে", "দারুল হিকমাহ একাডেমি, খুলনা: ২০২১ সাল থেকে খুলনা বিশ্ববিদ্যালয়ের সামনে বালক ও বালিকাদের জন্য হিফজুল কুরআন ও জাতীয় কারিকুলামের সমন্বিত ইসলামিক শিক্ষা।", "/about");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

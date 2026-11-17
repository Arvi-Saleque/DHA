import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export const revalidate = 86400;

const PAGES = [
  ["", 1],
  ["/about", 0.9],
  ["/admission", 0.9],
  ["/academic/curriculum", 0.9],
  ["/academic/admission-fee", 0.8],
  ["/contact", 0.8],
  ["/about/teachers", 0.7],
  ["/about/mission-vission", 0.6],
  ["/about/chairman-message", 0.5],
  ["/about/committee", 0.5],
  ["/academic/scholarship", 0.6],
  ["/news-events", 0.7],
  ["/gallery", 0.6],
  ["/reviews", 0.6],
  ["/academic/calendar", 0.4],
  ["/academic/syllabus", 0.4],
  ["/academic/routine", 0.3],
  ["/academic/exams", 0.3],
  ["/academic/results", 0.3],
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages: MetadataRoute.Sitemap = PAGES.map(([path, priority]) => ({
    url: `${SITE_URL}${path}`,
    priority,
  }));

  try {
    const { default: connectDB } = await import("@/lib/mongodb");
    const { default: NewsEvent } = await import("@/models/NewsEvent");
    await connectDB();
    const news = await NewsEvent.find({ slug: { $ne: null } }, "slug updatedAt").lean<
      { slug: string; updatedAt?: Date }[]
    >();
    for (const n of news) {
      pages.push({ url: `${SITE_URL}/news-events/${n.slug}`, lastModified: n.updatedAt, priority: 0.5 });
    }
  } catch {
    // DB unreachable: the static pages still go out.
  }

  return pages;
}

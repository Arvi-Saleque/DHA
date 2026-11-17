import type { Metadata } from "next";
import { pageMeta } from "@/lib/site";

type Props = { params: Promise<{ slug: string }>; children: React.ReactNode };

export async function generateMetadata({ params }: { params: Props["params"] }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { default: connectDB } = await import("@/lib/mongodb");
    const { default: NewsEvent } = await import("@/models/NewsEvent");
    await connectDB();
    const item = await NewsEvent.findOne({ slug }, "title excerpt imageUrl").lean<{
      title: string;
      excerpt: string;
      imageUrl?: string;
    }>();
    if (!item) return { title: "খবর ও ইভেন্ট" };
    const meta = pageMeta(item.title, item.excerpt, `/news-events/${slug}`);
    return item.imageUrl
      ? { ...meta, openGraph: { ...meta.openGraph, type: "article", images: [item.imageUrl] } }
      : meta;
  } catch {
    return { title: "খবর ও ইভেন্ট" };
  }
}

export default function Layout({ children }: Props) {
  return children;
}

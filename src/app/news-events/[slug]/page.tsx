"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  ArrowLeft,
  Eye,
  User,
  Share2,
  Newspaper,
  PartyPopper,
  Trophy,
  BookOpen,
  LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  news: Newspaper,
  event: PartyPopper,
  achievement: Trophy,
  announcement: BookOpen,
};

interface NewsEvent {
  _id: string;
  title: string;
  slug: string;
  category: "news" | "event" | "achievement" | "announcement";
  date: string;
  time?: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  author: string;
  tags: string[];
  views: number;
  createdAt: string;
  updatedAt: string;
}

// Helper functions for Google Drive images
const isGoogleDriveUrl = (url: string) => {
  return url.includes("drive.google.com");
};

const getImageUrl = (url: string) => {
  if (isGoogleDriveUrl(url)) {
    const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (fileIdMatch) {
      return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
    }
  }
  return url;
};

export default function NewsEventDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [newsEvent, setNewsEvent] = useState<NewsEvent | null>(null);
  const [relatedNews, setRelatedNews] = useState<NewsEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchNewsEvent();
      fetchRelatedNews();
    }
  }, [slug]);

  const fetchNewsEvent = async () => {
    try {
      const res = await fetch(`/api/news-events/${slug}`);
      if (res.ok) {
        const data = await res.json();
        setNewsEvent(data);
      }
    } catch (error) {
      console.error("Error fetching news/event:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedNews = async () => {
    try {
      const res = await fetch("/api/news-events");
      if (res.ok) {
        const data = await res.json();
        // Get 3 random related items excluding current
        const related = data
          .filter((item: NewsEvent) => item.slug !== slug)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);
        setRelatedNews(related);
      }
    } catch (error) {
      console.error("Error fetching related news:", error);
    }
  };

  const getCategoryStyle = (
    category: NewsEvent["category"]
  ): { bg: string; text: string } => {
    const styles = {
      news: { bg: "bg-blue-100", text: "text-blue-700" },
      event: { bg: "bg-purple-100", text: "text-purple-700" },
      achievement: { bg: "bg-amber-100", text: "text-amber-700" },
      announcement: { bg: "bg-rose-100", text: "text-rose-700" },
    };
    return styles[category];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!newsEvent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">News/Event Not Found</h1>
          <Link href="/news-events">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to News & Events
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const categoryStyle = getCategoryStyle(newsEvent.category);
  const CategoryIcon = iconMap[newsEvent.category];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-cyan-600 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>

        <div className="relative container mx-auto px-4 py-12">
          <Link href="/news-events">
            <Button
              variant="ghost"
              className="mb-6 text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to News & Events
            </Button>
          </Link>

          <div className="max-w-4xl">
            <Badge
              className={`${categoryStyle.bg} ${categoryStyle.text} border-0 mb-4`}
            >
              <CategoryIcon className="w-3 h-3 mr-1" />
              {newsEvent.category.charAt(0).toUpperCase() +
                newsEvent.category.slice(1)}
            </Badge>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-lg">
              {newsEvent.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(newsEvent.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              {newsEvent.time && (
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {newsEvent.time}
                </span>
              )}
              <span className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {newsEvent.author}
              </span>
              <span className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                {newsEvent.views} views
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="border-none shadow-lg mb-8">
              <CardContent className="p-0">
                {/* Featured Image */}
                <div className="relative w-full h-[400px] overflow-hidden rounded-t-lg">
                  {isGoogleDriveUrl(newsEvent.imageUrl) ? (
                    <iframe
                      src={getImageUrl(newsEvent.imageUrl)}
                      className="w-full h-full border-0 pointer-events-none"
                      allow="autoplay"
                    />
                  ) : (
                    <img
                      src={newsEvent.imageUrl}
                      alt={newsEvent.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                {/* Content */}
                <div className="p-8">
                  <div className="prose prose-slate max-w-none">
                    <p className="text-lg text-slate-700 font-medium mb-6">
                      {newsEvent.excerpt}
                    </p>
                    <div className="text-slate-600 whitespace-pre-line leading-relaxed">
                      {newsEvent.content}
                    </div>
                  </div>

                  {/* Tags */}
                  {newsEvent.tags.length > 0 && (
                    <div className="mt-8 pt-6 border-t">
                      <h3 className="text-sm font-semibold text-slate-900 mb-3">
                        Tags
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {newsEvent.tags.map((tag, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="bg-slate-50"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Share */}
                  <div className="mt-6 pt-6 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-900">
                        Share this article
                      </span>
                      <Button variant="outline" size="sm">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Related News */}
            {relatedNews.length > 0 && (
              <Card className="border-none shadow-lg sticky top-4">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">
                    Related News & Events
                  </h3>
                  <div className="space-y-4">
                    {relatedNews.map((item) => {
                      const relatedCategoryStyle = getCategoryStyle(
                        item.category
                      );
                      const RelatedIcon = iconMap[item.category];

                      return (
                        <Link
                          key={item._id}
                          href={`/news-events/${item.slug}`}
                          className="block group"
                        >
                          <Card className="border hover:border-cyan-300 transition-all hover:shadow-md">
                            <CardContent className="p-4">
                              <Badge
                                className={`${relatedCategoryStyle.bg} ${relatedCategoryStyle.text} border-0 mb-2`}
                              >
                                <RelatedIcon className="w-3 h-3 mr-1" />
                                {item.category}
                              </Badge>
                              <h4 className="font-semibold text-slate-900 mb-2 line-clamp-2 group-hover:text-cyan-600 transition-colors">
                                {item.title}
                              </h4>
                              <p className="text-xs text-slate-500 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(item.date).toLocaleDateString()}
                              </p>
                            </CardContent>
                          </Card>
                        </Link>
                      );
                    })}
                  </div>

                  <Link href="/news-events">
                    <Button variant="outline" className="w-full mt-4">
                      View All News & Events
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

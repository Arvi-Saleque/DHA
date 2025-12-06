"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/admin/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Save, Eye, RefreshCw, Calendar, Tag } from "lucide-react";
import Image from "next/image";

interface NewsEvent {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  isActive: boolean;
}

export default function AdminHomepageNews() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [allNews, setAllNews] = useState<NewsEvent[]>([]);
  const [selectedNewsIds, setSelectedNewsIds] = useState<string[]>([]);
  const [maxItems, setMaxItems] = useState(3);
  const [selectionId, setSelectionId] = useState<string | null>(null);
  const [isCustomSelection, setIsCustomSelection] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([fetchAllNews(), fetchCurrentSelection()]);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const fetchAllNews = async () => {
    try {
      const response = await fetch("/api/news-events");
      if (response.ok) {
        const data = await response.json();
        // API returns array directly, not wrapped in object
        setAllNews(Array.isArray(data) ? data : (data.newsEvents || []));
      } else {
        console.error("Failed to fetch news:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  const fetchCurrentSelection = async () => {
    try {
      const response = await fetch("/api/homepage-news");
      if (response.ok) {
        const data = await response.json();
        if (data.isCustomSelection && data.newsEvents) {
          setSelectedNewsIds(data.newsEvents.map((n: NewsEvent) => n._id));
          setMaxItems(data.maxItems || 3);
          setSelectionId(data._id || null);
          setIsCustomSelection(true);
        } else {
          // No custom selection, show latest 3
          setMaxItems(3);
          setIsCustomSelection(false);
        }
      } else {
        console.error("Failed to fetch selection:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching current selection:", error);
    }
  };

  const toggleNewsSelection = (newsId: string) => {
    setSelectedNewsIds(prev => {
      if (prev.includes(newsId)) {
        return prev.filter(id => id !== newsId);
      } else {
        return [...prev, newsId];
      }
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      if (selectedNewsIds.length === 0) {
        alert("Please select at least one news item");
        setSaving(false);
        return;
      }

      const method = selectionId ? "PUT" : "POST";
      const body: any = {
        newsEventIds: selectedNewsIds,
        maxItems
      };

      if (selectionId) {
        body._id = selectionId;
      }

      const response = await fetch("/api/homepage-news", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const data = await response.json();
        setSelectionId(data._id);
        setIsCustomSelection(true);
        alert("Homepage news selection updated successfully!");
      } else {
        throw new Error("Failed to update");
      }
    } catch (error) {
      console.error("Error saving selection:", error);
      alert("Failed to save: " + (error as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!confirm("Reset to automatic (latest 3 news)? This will remove your custom selection.")) {
      return;
    }

    try {
      await fetch("/api/homepage-news", { method: "DELETE" });
      setSelectedNewsIds([]);
      setSelectionId(null);
      setIsCustomSelection(false);
      alert("Reset to automatic selection");
    } catch (error) {
      console.error("Error resetting:", error);
      alert("Failed to reset");
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Academic": "bg-blue-100 text-blue-700",
      "Event": "bg-purple-100 text-purple-700",
      "Achievement": "bg-green-100 text-green-700",
      "Announcement": "bg-amber-100 text-amber-700",
      "Holiday": "bg-pink-100 text-pink-700",
    };
    return colors[category] || "bg-gray-100 text-gray-700";
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Homepage News Selection</h1>
            <p className="text-slate-600 mt-1">
              Choose which news items appear on the homepage (displays {maxItems} items)
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleReset}
              variant="outline"
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Reset to Auto
            </Button>
            <Button
              onClick={() => window.open("/", "_blank")}
              variant="outline"
              className="gap-2"
            >
              <Eye className="w-4 h-4" />
              Preview
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-cyan-600 hover:bg-cyan-700 gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save Selection"}
            </Button>
          </div>
        </div>

        {/* Status Card */}
        <Card>
          <CardHeader>
            <CardTitle>Selection Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div>
                <p className="text-sm text-slate-600">Current Mode:</p>
                <Badge className={isCustomSelection ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}>
                  {isCustomSelection ? "Custom Selection" : "Automatic (Latest 3)"}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-slate-600">Selected Items:</p>
                <p className="text-2xl font-bold text-slate-900">{selectedNewsIds.length}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Display Limit:</p>
                <select
                  value={maxItems}
                  onChange={(e) => setMaxItems(Number(e.target.value))}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value={3}>3 items</option>
                  <option value={4}>4 items</option>
                  <option value={6}>6 items</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* News Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select News Items</CardTitle>
            <CardDescription>
              Check the news items you want to display on the homepage. They will appear in the order you select them.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {allNews.length === 0 ? (
              <p className="text-center py-8 text-slate-500">
                No news items available. Create some news first.
              </p>
            ) : (
              <div className="grid gap-4">
                {allNews.map((news) => {
                  const isSelected = selectedNewsIds.includes(news._id);
                  const selectionOrder = selectedNewsIds.indexOf(news._id) + 1;

                  return (
                    <div
                      key={news._id}
                      className={`border rounded-lg p-4 transition-all ${
                        isSelected ? "border-cyan-500 bg-cyan-50" : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleNewsSelection(news._id)}
                          className="mt-1"
                        />
                        
                        {news.image && (
                          <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                            <Image
                              src={news.image}
                              alt={news.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="font-semibold text-slate-900 line-clamp-2">
                              {news.title}
                            </h3>
                            {isSelected && (
                              <Badge className="bg-cyan-600 text-white flex-shrink-0">
                                #{selectionOrder}
                              </Badge>
                            )}
                          </div>
                          
                          <p className="text-sm text-slate-600 line-clamp-2 mb-2">
                            {news.excerpt}
                          </p>

                          <div className="flex items-center gap-3 text-xs text-slate-500">
                            <Badge className={getCategoryColor(news.category)} variant="outline">
                              <Tag className="w-3 h-3 mr-1" />
                              {news.category}
                            </Badge>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(news.date).toLocaleDateString()}
                            </span>
                            {!news.isActive && (
                              <Badge variant="outline" className="bg-red-100 text-red-700">
                                Inactive
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Selection Summary */}
        {allNews.length > 0 && (
          <Card className={selectedNewsIds.length === 0 ? "border-amber-300 bg-amber-50" : "border-green-300 bg-green-50"}>
            <CardContent className="pt-6">
              {selectedNewsIds.length === 0 ? (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">⚠️</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-amber-900 mb-1">No Items Selected</h3>
                    <p className="text-sm text-amber-700">
                      Please select at least one news item to display on the homepage, or the homepage will show the latest {maxItems} news automatically.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-900 mb-1">Ready to Save</h3>
                    <p className="text-sm text-green-700">
                      You have selected {selectedNewsIds.length} news item{selectedNewsIds.length !== 1 ? 's' : ''}. Click "Save Selection" to apply changes to the homepage.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Save Button at Bottom */}
        <div className="flex justify-end gap-2">
          <Button
            onClick={handleReset}
            variant="outline"
            disabled={saving}
          >
            Reset to Auto
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || selectedNewsIds.length === 0}
            className="bg-cyan-600 hover:bg-cyan-700 gap-2"
            size="lg"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Selection"}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}

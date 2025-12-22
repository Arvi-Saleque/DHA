"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/admin/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Save, Edit, X, Calendar, Eye } from "lucide-react";
import ImageUploader from "@/components/common/ImageUploader";

interface NewsEvent {
  _id?: string;
  title: string;
  slug?: string;
  category: "news" | "event" | "achievement" | "announcement";
  date: string;
  time?: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  author: string;
  tags: string[];
  views?: number;
}

export default function NewsEventsAdminPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [newsEvents, setNewsEvents] = useState<NewsEvent[]>([]);
  const [editingItem, setEditingItem] = useState<NewsEvent | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const emptyNewsEvent: NewsEvent = {
    title: "",
    category: "news",
    date: new Date().toISOString().split("T")[0],
    time: "",
    excerpt: "",
    content: "",
    imageUrl: "",
    author: "",
    tags: [],
  };

  useEffect(() => {
    fetchNewsEvents();
  }, []);

  const fetchNewsEvents = async () => {
    try {
      const res = await fetch("/api/news-events");
      if (res.ok) {
        const data = await res.json();
        setNewsEvents(data);
      }
    } catch (error) {
      console.error("Error fetching news/events:", error);
    }
  };

  const handleSubmit = async () => {
    if (!editingItem) return;

    // Validation
    if (!editingItem.title.trim()) {
      setMessage("Error: Title is required");
      return;
    }
    if (!editingItem.author.trim()) {
      setMessage("Error: Author is required");
      return;
    }
    if (!editingItem.excerpt.trim()) {
      setMessage("Error: Excerpt is required");
      return;
    }
    if (!editingItem.content.trim()) {
      setMessage("Error: Full content is required");
      return;
    }
    if (!editingItem.imageUrl.trim()) {
      setMessage("Error: Image URL is required");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const method = editingItem._id ? "PUT" : "POST";

      console.log("Submitting:", editingItem);

      const res = await fetch("/api/news-events", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingItem),
      });

      const data = await res.json();
      console.log("Response:", data);

      if (res.ok) {
        setMessage(
          editingItem._id
            ? "News/Event updated successfully!"
            : "News/Event created successfully!"
        );
        fetchNewsEvents();
        setEditingItem(null);
        setIsCreating(false);
      } else {
        setMessage(`Error: ${data.message || data.error || "Unknown error"}`);
      }
    } catch (error: any) {
      setMessage(`Failed to save: ${error.message}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this news/event?")) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/news-events?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setMessage("News/Event deleted successfully!");
        fetchNewsEvents();
      } else {
        setMessage("Failed to delete news/event");
      }
    } catch (error) {
      setMessage("Failed to delete news/event");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => {
    if (!editingItem || !tagInput.trim()) return;
    if (!editingItem.tags.includes(tagInput.trim())) {
      setEditingItem({
        ...editingItem,
        tags: [...editingItem.tags, tagInput.trim()],
      });
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    if (!editingItem) return;
    setEditingItem({
      ...editingItem,
      tags: editingItem.tags.filter((t) => t !== tag),
    });
  };

  const getCategoryBadge = (category: string) => {
    const styles = {
      news: "bg-blue-100 text-blue-700",
      event: "bg-purple-100 text-purple-700",
      achievement: "bg-amber-100 text-amber-700",
      announcement: "bg-rose-100 text-rose-700",
    };
    return styles[category as keyof typeof styles] || styles.news;
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">News & Events Management</h1>
          <p className="text-slate-600">
            Create and manage news articles, events, and announcements
          </p>
        </div>
        {!isCreating && !editingItem && (
          <Button
            onClick={() => {
              setIsCreating(true);
              setEditingItem(emptyNewsEvent);
            }}
            size="lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New
          </Button>
        )}
      </div>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.includes("Error")
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {message}
        </div>
      )}

      {(isCreating || editingItem) && (
        <Card className="mb-8 border-2 border-cyan-200">
          <CardContent className="pt-6 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                {editingItem?._id ? "Edit" : "Create New"} News/Event
              </h2>
              <Button
                variant="ghost"
                onClick={() => {
                  setEditingItem(null);
                  setIsCreating(false);
                  setMessage("");
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>Title *</Label>
                <Input
                  value={editingItem?.title || ""}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem!, title: e.target.value })
                  }
                  placeholder="Enter title"
                />
              </div>

              <div>
                <Label>Category *</Label>
                <Select
                  value={editingItem?.category}
                  onValueChange={(value: any) =>
                    setEditingItem({ ...editingItem!, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="news">News</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                    <SelectItem value="achievement">Achievement</SelectItem>
                    <SelectItem value="announcement">Announcement</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Author *</Label>
                <Input
                  value={editingItem?.author || ""}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem!, author: e.target.value })
                  }
                  placeholder="Author name"
                />
              </div>

              <div>
                <Label>Date *</Label>
                <Input
                  type="date"
                  value={editingItem?.date || ""}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem!, date: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Time (Optional)</Label>
                <Input
                  type="time"
                  value={editingItem?.time || ""}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem!, time: e.target.value })
                  }
                />
              </div>

              <div className="col-span-2">
                <ImageUploader
                  label="News/Event Image"
                  value={editingItem?.imageUrl || ""}
                  onChange={(url) =>
                    setEditingItem({ ...editingItem!, imageUrl: url })
                  }
                  folder="news-events"
                />
              </div>

              <div className="col-span-2">
                <Label>Excerpt (Short Description) *</Label>
                <Textarea
                  value={editingItem?.excerpt || ""}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem!, excerpt: e.target.value })
                  }
                  placeholder="Brief summary for the card view"
                  rows={2}
                />
              </div>

              <div className="col-span-2">
                <Label>Full Content *</Label>
                <Textarea
                  value={editingItem?.content || ""}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem!, content: e.target.value })
                  }
                  placeholder="Full detailed content"
                  rows={8}
                />
              </div>

              <div className="col-span-2">
                <Label>Tags</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                    placeholder="Add tag and press Enter"
                  />
                  <Button onClick={addTag} variant="outline" type="button">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {editingItem?.tags.map((tag, idx) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => removeTag(tag)}
                    >
                      {tag} <X className="w-3 h-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-end pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setEditingItem(null);
                  setIsCreating(false);
                  setMessage("");
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={loading}>
                <Save className="w-4 h-4 mr-2" />
                {loading ? "Saving..." : "Save"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* List of News/Events */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">All News & Events</h2>
        {newsEvents.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-slate-500">
                No news or events yet. Create your first one!
              </p>
            </CardContent>
          </Card>
        ) : (
          newsEvents.map((item) => (
            <Card key={item._id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                        <div className="flex items-center gap-3 text-sm text-slate-600 mb-2">
                          <Badge className={getCategoryBadge(item.category)}>
                            {item.category}
                          </Badge>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(item.date).toLocaleDateString()}
                          </span>
                          {item.time && <span>{item.time}</span>}
                          <span>By {item.author}</span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {item.views || 0} views
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 line-clamp-2 mb-2">
                          {item.excerpt}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {item.tags.map((tag, idx) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingItem(item);
                        setIsCreating(false);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(item._id!)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      </div>
    </DashboardLayout>
  );
}

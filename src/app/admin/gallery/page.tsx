"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/admin/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Save, Edit, X, Calendar, MapPin, Image as ImageIcon } from "lucide-react";

interface GalleryImage {
  _id?: string;
  title: string;
  category: string;
  imageUrl: string;
  date: string;
  location: string;
  description: string;
  order: number;
}

const CATEGORIES = [
  "Academic Events",
  "Sports & Activities",
  "Cultural Programs",
  "Campus Life",
  "Community Service",
];

export default function GalleryAdminPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [editingItem, setEditingItem] = useState<GalleryImage | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const emptyImage: GalleryImage = {
    title: "",
    category: "Academic Events",
    imageUrl: "",
    date: new Date().toISOString().split("T")[0],
    location: "",
    description: "",
    order: 0,
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await fetch("/api/gallery");
      if (res.ok) {
        const data = await res.json();
        setImages(data);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const handleSubmit = async () => {
    if (!editingItem) return;

    // Validation
    if (!editingItem.title.trim()) {
      setMessage("Error: Title is required");
      return;
    }
    if (!editingItem.imageUrl.trim()) {
      setMessage("Error: Image URL is required");
      return;
    }
    if (!editingItem.location.trim()) {
      setMessage("Error: Location is required");
      return;
    }
    if (!editingItem.description.trim()) {
      setMessage("Error: Description is required");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const method = editingItem._id ? "PUT" : "POST";

      console.log("Submitting:", editingItem);

      const res = await fetch("/api/gallery", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingItem),
      });

      const data = await res.json();
      console.log("Response:", data);

      if (res.ok) {
        setMessage(
          editingItem._id
            ? "Gallery image updated successfully!"
            : "Gallery image created successfully!"
        );
        fetchImages();
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
    if (!confirm("Are you sure you want to delete this image?")) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/gallery?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setMessage("Gallery image deleted successfully!");
        fetchImages();
      } else {
        setMessage("Failed to delete image");
      }
    } catch (error) {
      setMessage("Failed to delete image");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryBadge = (category: string) => {
    const styles: { [key: string]: string } = {
      "Academic Events": "bg-blue-100 text-blue-700",
      "Sports & Activities": "bg-green-100 text-green-700",
      "Cultural Programs": "bg-purple-100 text-purple-700",
      "Campus Life": "bg-amber-100 text-amber-700",
      "Community Service": "bg-rose-100 text-rose-700",
    };
    return styles[category] || "bg-slate-100 text-slate-700";
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gallery Management</h1>
          <p className="text-slate-600">
            Upload and manage gallery images
          </p>
        </div>
        {!isCreating && !editingItem && (
          <Button
            onClick={() => {
              setIsCreating(true);
              setEditingItem(emptyImage);
            }}
            size="lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Image
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
                {editingItem?._id ? "Edit" : "Add New"} Gallery Image
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
                  placeholder="Enter image title"
                />
              </div>

              <div>
                <Label>Category *</Label>
                <select
                  value={editingItem?.category}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem!, category: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
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

              <div className="col-span-2">
                <Label>Image URL (Google Drive or Direct Link) *</Label>
                <Input
                  value={editingItem?.imageUrl || ""}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem!, imageUrl: e.target.value })
                  }
                  placeholder="Image URL"
                />
              </div>

              <div className="col-span-2">
                <Label>Location *</Label>
                <Input
                  value={editingItem?.location || ""}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem!, location: e.target.value })
                  }
                  placeholder="Location where photo was taken"
                />
              </div>

              <div className="col-span-2">
                <Label>Description *</Label>
                <Textarea
                  value={editingItem?.description || ""}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem!, description: e.target.value })
                  }
                  placeholder="Brief description of the image"
                  rows={3}
                />
              </div>

              <div>
                <Label>Display Order</Label>
                <Input
                  type="number"
                  value={editingItem?.order || 0}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem!, order: parseInt(e.target.value) || 0 })
                  }
                  placeholder="0"
                />
                <p className="text-xs text-slate-500 mt-1">Lower numbers appear first</p>
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

      {/* List of Images */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">All Gallery Images ({images.length})</h2>
        {images.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-slate-500">
                No images yet. Add your first one!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((item) => (
              <Card key={item._id} className="hover:shadow-lg transition-shadow overflow-hidden">
                <div className="relative h-48">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <Badge className={`absolute top-2 left-2 ${getCategoryBadge(item.category)}`}>
                    {item.category}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold mb-2 line-clamp-1">{item.title}</h3>
                  <div className="space-y-1 text-sm text-slate-600 mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      {new Date(item.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3" />
                      {item.location}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                    {item.description}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        setEditingItem(item);
                        setIsCreating(false);
                      }}
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(item._id!)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      </div>
    </DashboardLayout>
  );
}

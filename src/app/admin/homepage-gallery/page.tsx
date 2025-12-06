"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/admin/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Save, Eye, RefreshCw, Tag } from "lucide-react";
import Image from "next/image";

interface GalleryImage {
  _id: string;
  title: string;
  image: string;
  category: string;
  order: number;
  isActive: boolean;
}

export default function AdminHomepageGallery() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [allImages, setAllImages] = useState<GalleryImage[]>([]);
  const [selectedImageIds, setSelectedImageIds] = useState<string[]>([]);
  const [maxItems, setMaxItems] = useState(6);
  const [selectionId, setSelectionId] = useState<string | null>(null);
  const [isCustomSelection, setIsCustomSelection] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([fetchAllImages(), fetchCurrentSelection()]);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const fetchAllImages = async () => {
    try {
      const response = await fetch("/api/gallery");
      if (response.ok) {
        const data = await response.json();
        // API returns array directly, not wrapped in object
        setAllImages(Array.isArray(data) ? data : (data.images || []));
      } else {
        console.error("Failed to fetch gallery:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching gallery:", error);
    }
  };

  const fetchCurrentSelection = async () => {
    try {
      const response = await fetch("/api/homepage-gallery");
      if (response.ok) {
        const data = await response.json();
        if (data.isCustomSelection && data.images) {
          setSelectedImageIds(data.images.map((img: GalleryImage) => img._id));
          setMaxItems(data.maxItems || 6);
          setSelectionId(data._id || null);
          setIsCustomSelection(true);
        } else {
          // No custom selection, show latest 6
          setMaxItems(6);
          setIsCustomSelection(false);
        }
      } else {
        console.error("Failed to fetch selection:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching current selection:", error);
    }
  };

  const toggleImageSelection = (imageId: string) => {
    setSelectedImageIds(prev => {
      if (prev.includes(imageId)) {
        return prev.filter(id => id !== imageId);
      } else {
        return [...prev, imageId];
      }
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      if (selectedImageIds.length === 0) {
        alert("Please select at least one gallery image");
        setSaving(false);
        return;
      }

      const method = selectionId ? "PUT" : "POST";
      const body: any = {
        galleryImageIds: selectedImageIds,
        maxItems
      };

      if (selectionId) {
        body._id = selectionId;
      }

      const response = await fetch("/api/homepage-gallery", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const data = await response.json();
        setSelectionId(data._id);
        setIsCustomSelection(true);
        alert("Homepage gallery selection updated successfully!");
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
    if (!confirm("Reset to automatic (latest 6 images)? This will remove your custom selection.")) {
      return;
    }

    try {
      await fetch("/api/homepage-gallery", { method: "DELETE" });
      setSelectedImageIds([]);
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
      "Campus": "bg-blue-100 text-blue-700",
      "Events": "bg-purple-100 text-purple-700",
      "Students": "bg-green-100 text-green-700",
      "Activities": "bg-amber-100 text-amber-700",
      "Facilities": "bg-pink-100 text-pink-700",
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
            <h1 className="text-3xl font-bold text-slate-900">Homepage Gallery Selection</h1>
            <p className="text-slate-600 mt-1">
              Choose which gallery images appear on the homepage (displays {maxItems} images)
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
                  {isCustomSelection ? "Custom Selection" : "Automatic (Latest 6)"}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-slate-600">Selected Items:</p>
                <p className="text-2xl font-bold text-slate-900">{selectedImageIds.length}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Display Limit:</p>
                <select
                  value={maxItems}
                  onChange={(e) => setMaxItems(Number(e.target.value))}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value={3}>3 images</option>
                  <option value={6}>6 images</option>
                  <option value={9}>9 images</option>
                  <option value={12}>12 images</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gallery Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Gallery Images</CardTitle>
            <CardDescription>
              Check the images you want to display on the homepage. They will appear in the order you select them.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {allImages.length === 0 ? (
              <p className="text-center py-8 text-slate-500">
                No gallery images available. Upload some images first.
              </p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {allImages.map((img) => {
                  const isSelected = selectedImageIds.includes(img._id);
                  const selectionOrder = selectedImageIds.indexOf(img._id) + 1;

                  return (
                    <div
                      key={img._id}
                      className={`relative border rounded-lg overflow-hidden transition-all ${
                        isSelected ? "border-cyan-500 ring-2 ring-cyan-200" : "border-gray-200"
                      }`}
                    >
                      {/* Selection Badge */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 z-10">
                          <Badge className="bg-cyan-600 text-white">
                            #{selectionOrder}
                          </Badge>
                        </div>
                      )}

                      {/* Checkbox */}
                      <div className="absolute top-2 left-2 z-10">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleImageSelection(img._id)}
                          className="bg-white shadow-md"
                        />
                      </div>

                      {/* Image */}
                      <div className="relative w-full h-48">
                        <Image
                          src={img.imageUrl}
                          alt={img.title}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Info */}
                      <div className="p-3 bg-white">
                        <h3 className="font-semibold text-sm text-slate-900 line-clamp-1 mb-2">
                          {img.title}
                        </h3>
                        <div className="flex items-center justify-between text-xs">
                          <Badge className={getCategoryColor(img.category)} variant="outline">
                            <Tag className="w-3 h-3 mr-1" />
                            {img.category}
                          </Badge>
                          {!img.isActive && (
                            <Badge variant="outline" className="bg-red-100 text-red-700">
                              Inactive
                            </Badge>
                          )}
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
        {allImages.length > 0 && (
          <Card className={selectedImageIds.length === 0 ? "border-amber-300 bg-amber-50" : "border-green-300 bg-green-50"}>
            <CardContent className="pt-6">
              {selectedImageIds.length === 0 ? (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">⚠️</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-amber-900 mb-1">No Images Selected</h3>
                    <p className="text-sm text-amber-700">
                      Please select at least one gallery image to display on the homepage, or the homepage will show the latest {maxItems} images automatically.
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
                      You have selected {selectedImageIds.length} image{selectedImageIds.length !== 1 ? 's' : ''}. Click "Save Selection" to apply changes to the homepage.
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
            disabled={saving || selectedImageIds.length === 0}
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

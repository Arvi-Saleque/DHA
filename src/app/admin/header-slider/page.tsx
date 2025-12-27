"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/admin/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Save, Plus, Trash2, GripVertical, Image as ImageIcon } from "lucide-react";
import ImageUploader from "@/components/common/ImageUploader";

interface Slide {
  _id?: string;
  image: string;
  title: string;
  subtitle: string;
  description: string;
  primaryButton: string;
  primaryButtonUrl: string;
  secondaryButton: string;
  secondaryButtonUrl: string;
  order: number;
  isActive: boolean;
}

export default function HeaderSliderAdminPage() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSlide, setEditingSlide] = useState<Slide | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const res = await fetch("/api/header-slides");
      if (res.ok) {
        const data = await res.json();
        setSlides(data);
      }
    } catch (error) {
      console.error("Error fetching slides:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editingSlide) return;

    try {
      const url = "/api/header-slides";
      const method = editingSlide._id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingSlide),
      });

      if (res.ok) {
        alert("Slide saved successfully!");
        setIsModalOpen(false);
        setEditingSlide(null);
        fetchSlides();
      } else {
        alert("Failed to save slide");
      }
    } catch (error) {
      console.error("Error saving slide:", error);
      alert("Error saving slide");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this slide?")) return;

    try {
      const res = await fetch(`/api/header-slides?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Slide deleted successfully!");
        fetchSlides();
      } else {
        alert("Failed to delete slide");
      }
    } catch (error) {
      console.error("Error deleting slide:", error);
      alert("Error deleting slide");
    }
  };

  const openAddModal = () => {
    setEditingSlide({
      image: "",
      title: "",
      subtitle: "",
      description: "",
      primaryButton: "Enroll Now",
      primaryButtonUrl: "/admission",
      secondaryButton: "Learn More",
      secondaryButtonUrl: "/about",
      order: slides.length + 1,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (slide: Slide) => {
    setEditingSlide({ ...slide });
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div>
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">Loading...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Header Slider Management</h1>
          <p className="text-gray-600 mt-2">
            Manage homepage slider images and content
          </p>
        </div>
        <Button onClick={openAddModal}>
          <Plus className="w-4 h-4 mr-2" />
          Add Slide
        </Button>
      </div>

      {/* Slides List */}
      <div className="grid grid-cols-1 gap-6">
        {slides.map((slide) => (
          <Card key={slide._id} className="border-2">
            <CardContent className="p-6">
              <div className="flex items-start gap-6">
                <div className="flex items-center gap-2 text-gray-400">
                  <GripVertical className="w-5 h-5" />
                  <Badge variant="outline">{slide.order}</Badge>
                </div>

                {/* Preview Image */}
                <div className="w-48 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {slide.image ? (
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Slide Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {slide.title}
                      </h3>
                      <p className="text-sm text-cyan-600 mb-2">{slide.subtitle}</p>
                      <p className="text-gray-600 text-sm">{slide.description}</p>
                    </div>
                    <Badge variant={slide.isActive ? "default" : "secondary"}>
                      {slide.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>
                      Primary Button: <strong>{slide.primaryButton}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Secondary Button: <strong>{slide.secondaryButton}</strong>
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    onClick={() => openEditModal(slide)}
                    variant="outline"
                    size="sm"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => slide._id && handleDelete(slide._id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {slides.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No slides added yet. Click "Add Slide" to create one.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit/Add Modal */}
      {isModalOpen && editingSlide && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>
                {editingSlide._id ? "Edit Slide" : "Add New Slide"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <ImageUploader
                  label="Slider Image"
                  value={editingSlide.image}
                  onChange={(url) =>
                    setEditingSlide({ ...editingSlide, image: url })
                  }
                  folder="header-slider"
                />
              </div>

              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={editingSlide.title}
                  onChange={(e) =>
                    setEditingSlide({ ...editingSlide, title: e.target.value })
                  }
                  placeholder="Welcome to Our Madrasa"
                />
              </div>

              <div>
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input
                  id="subtitle"
                  value={editingSlide.subtitle}
                  onChange={(e) =>
                    setEditingSlide({ ...editingSlide, subtitle: e.target.value })
                  }
                  placeholder="Building Knowledge, Nurturing Faith"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editingSlide.description}
                  onChange={(e) =>
                    setEditingSlide({
                      ...editingSlide,
                      description: e.target.value,
                    })
                  }
                  placeholder="Excellence in Islamic education..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="primaryButton">Primary Button Text</Label>
                  <Input
                    id="primaryButton"
                    value={editingSlide.primaryButton}
                    onChange={(e) =>
                      setEditingSlide({
                        ...editingSlide,
                        primaryButton: e.target.value,
                      })
                    }
                    placeholder="Enroll Now"
                  />
                </div>
                <div>
                  <Label htmlFor="primaryButtonUrl">Primary Button URL</Label>
                  <Input
                    id="primaryButtonUrl"
                    value={editingSlide.primaryButtonUrl}
                    onChange={(e) =>
                      setEditingSlide({
                        ...editingSlide,
                        primaryButtonUrl: e.target.value,
                      })
                    }
                    placeholder="/admission"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="secondaryButton">Secondary Button Text</Label>
                  <Input
                    id="secondaryButton"
                    value={editingSlide.secondaryButton}
                    onChange={(e) =>
                      setEditingSlide({
                        ...editingSlide,
                        secondaryButton: e.target.value,
                      })
                    }
                    placeholder="Learn More"
                  />
                </div>
                <div>
                  <Label htmlFor="secondaryButtonUrl">Secondary Button URL</Label>
                  <Input
                    id="secondaryButtonUrl"
                    value={editingSlide.secondaryButtonUrl}
                    onChange={(e) =>
                      setEditingSlide({
                        ...editingSlide,
                        secondaryButtonUrl: e.target.value,
                      })
                    }
                    placeholder="/about"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="order">Display Order</Label>
                  <Input
                    id="order"
                    type="number"
                    value={editingSlide.order}
                    onChange={(e) =>
                      setEditingSlide({
                        ...editingSlide,
                        order: parseInt(e.target.value),
                      })
                    }
                    min="1"
                  />
                </div>
                <div className="flex items-center gap-2 space-x-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={editingSlide.isActive}
                    onChange={(e) =>
                      setEditingSlide({ ...editingSlide, isActive: e.target.checked })
                    }
                    className="w-4 h-4"
                  />
                  <Label htmlFor="isActive">Active</Label>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleSave} className="flex-1">
                  <Save className="w-4 h-4 mr-2" />
                  Save Slide
                </Button>
                <Button
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingSlide(null);
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      </div>
    </DashboardLayout>
  );
}

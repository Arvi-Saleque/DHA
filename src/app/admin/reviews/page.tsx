"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/admin/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { GripVertical, Plus, Trash2, Eye, EyeOff, UserCircle2 } from "lucide-react";
import ImageUploader from "@/components/common/ImageUploader";

interface Review {
  _id?: string;
  name: string;
  relation: string;
  image: string;
  gender?: string;
  rating: number;
  review: string;
  order: number;
  isActive: boolean;
}

interface ReviewSettings {
  _id?: string;
  trustedByText: string;
  familiesCount: string;
  averageRatingText: string;
  averageRatingValue: string;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [settings, setSettings] = useState<ReviewSettings>({
    trustedByText: "Trusted by",
    familiesCount: "500+ Families",
    averageRatingText: "Average Rating",
    averageRatingValue: "5.0/5.0",
  });
  const [loadingSettings, setLoadingSettings] = useState(true);

  useEffect(() => {
    fetchReviews();
    fetchSettings();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch("/api/reviews?admin=true");
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews || []);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/review-settings");
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoadingSettings(false);
    }
  };

  const saveSettings = async () => {
    try {
      const response = await fetch("/api/review-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        alert("Settings saved successfully!");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings");
    }
  };

  const handleSave = async () => {
    if (!editingReview) return;

    try {
      const method = editingReview._id ? "PUT" : "POST";
      const response = await fetch("/api/reviews", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingReview),
      });

      if (response.ok) {
        fetchReviews();
        setIsModalOpen(false);
        setEditingReview(null);
        alert("Review saved successfully!");
      }
    } catch (error) {
      console.error("Error saving review:", error);
      alert("Failed to save review");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      const response = await fetch(`/api/reviews?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchReviews();
        alert("Review deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("Failed to delete review");
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm("Are you sure you want to delete ALL reviews? This action cannot be undone!")) return;
    if (!confirm("This will permanently delete all reviews. Are you absolutely sure?")) return;

    try {
      const response = await fetch("/api/reviews?deleteAll=true", {
        method: "DELETE",
      });

      if (response.ok) {
        fetchReviews();
        alert("All reviews deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting all reviews:", error);
      alert("Failed to delete all reviews");
    }
  };

  const toggleActive = async (review: Review) => {
    try {
      const response = await fetch("/api/reviews", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...review, isActive: !review.isActive }),
      });

      if (response.ok) {
        fetchReviews();
        alert(review.isActive ? "Review deactivated" : "Review approved and activated!");
      }
    } catch (error) {
      console.error("Error toggling review status:", error);
      alert("Failed to update review status");
    }
  };

  const openAddModal = () => {
    setEditingReview({
      name: "",
      relation: "",
      image: "",
      rating: 5,
      review: "",
      order: reviews.length + 1,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (review: Review) => {
    setEditingReview(review);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Reviews Management</h1>
          <p className="text-gray-600 mt-1">Manage parent and guardian testimonials</p>
          {reviews.filter(r => !r.isActive).length > 0 && (
            <Badge className="mt-2 bg-amber-500">
              {reviews.filter(r => !r.isActive).length} Pending Approval
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleDeleteAll} 
            variant="destructive"
            disabled={reviews.length === 0}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete All
          </Button>
          <Button onClick={openAddModal} className="bg-cyan-600 hover:bg-cyan-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Review
          </Button>
        </div>
      </div>

      {/* Settings Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Review Section Settings</CardTitle>
          <CardDescription>
            Customize the text displayed in the trust badges below the reviews
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingSettings ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Trusted By Text</label>
                  <Input
                    value={settings.trustedByText}
                    onChange={(e) =>
                      setSettings({ ...settings, trustedByText: e.target.value })
                    }
                    placeholder="Trusted by"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Families Count</label>
                  <Input
                    value={settings.familiesCount}
                    onChange={(e) =>
                      setSettings({ ...settings, familiesCount: e.target.value })
                    }
                    placeholder="500+ Families"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Average Rating Text</label>
                  <Input
                    value={settings.averageRatingText}
                    onChange={(e) =>
                      setSettings({ ...settings, averageRatingText: e.target.value })
                    }
                    placeholder="Average Rating"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Average Rating Value</label>
                  <Input
                    value={settings.averageRatingValue}
                    onChange={(e) =>
                      setSettings({ ...settings, averageRatingValue: e.target.value })
                    }
                    placeholder="5.0/5.0"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={saveSettings} className="bg-cyan-600 hover:bg-cyan-700">
                  Save Settings
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4">
        {reviews.map((review) => (
          <Card key={review._id} className={`p-4 ${!review.isActive ? 'border-2 border-amber-300 bg-amber-50' : ''}`}>
            <div className="flex items-start gap-4">
              <GripVertical className="w-5 h-5 text-gray-400 mt-2 cursor-move" />
              
              <div className="flex-shrink-0">
                {review.image ? (
                  <img
                    src={review.image}
                    alt={review.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                  />
                ) : (
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 border-gray-200 ${
                    review.gender === "female" ? "bg-pink-100" : "bg-blue-100"
                  }`}>
                    <UserCircle2 className={`w-12 h-12 ${
                      review.gender === "female" ? "text-pink-400" : "text-blue-400"
                    }`} />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-lg">{review.name}</h3>
                    <p className="text-sm text-gray-600">{review.relation}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline">Order: {review.order}</Badge>
                    <Badge variant={review.isActive ? "default" : "secondary"}>
                      {review.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-1 mb-2">
                  {[...Array(review.rating)].map((_, i) => (
                    <span key={i} className="text-amber-400">★</span>
                  ))}
                </div>

                <p className="text-sm text-gray-700 line-clamp-2">{review.review}</p>

                <div className="flex gap-2 mt-3">
                  {!review.isActive && (
                    <Button 
                      onClick={() => toggleActive(review)} 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                  )}
                  {review.isActive && (
                    <Button 
                      onClick={() => toggleActive(review)} 
                      size="sm" 
                      variant="outline"
                    >
                      <EyeOff className="w-4 h-4 mr-1" />
                      Deactivate
                    </Button>
                  )}
                  <Button onClick={() => openEditModal(review)} size="sm" variant="outline">
                    Edit
                  </Button>
                  <Button
                    onClick={() => review._id && handleDelete(review._id)}
                    size="sm"
                    variant="destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && editingReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>{editingReview._id ? "Edit Review" : "Add New Review"}</CardTitle>
              <CardDescription>Manage testimonial details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name *</label>
                  <Input
                    value={editingReview.name}
                    onChange={(e) =>
                      setEditingReview({ ...editingReview, name: e.target.value })
                    }
                    placeholder="Reviewer name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Relation *</label>
                  <Input
                    value={editingReview.relation}
                    onChange={(e) =>
                      setEditingReview({ ...editingReview, relation: e.target.value })
                    }
                    placeholder="e.g., Mother of Grade 9 Student"
                  />
                </div>
              </div>

              <div>
                <ImageUploader
                  label="Reviewer Image *"
                  value={editingReview.image}
                  onChange={(url) => setEditingReview({ ...editingReview, image: url })}
                  folder="reviews"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Rating (1-5) *</label>
                  <Input
                    type="number"
                    min="1"
                    max="5"
                    value={editingReview.rating}
                    onChange={(e) =>
                      setEditingReview({
                        ...editingReview,
                        rating: parseInt(e.target.value) || 5,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Order *</label>
                  <Input
                    type="number"
                    value={editingReview.order}
                    onChange={(e) =>
                      setEditingReview({
                        ...editingReview,
                        order: parseInt(e.target.value) || 1,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      checked={editingReview.isActive}
                      onChange={(e) =>
                        setEditingReview({ ...editingReview, isActive: e.target.checked })
                      }
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Active</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Review Text *</label>
                <Textarea
                  value={editingReview.review}
                  onChange={(e) =>
                    setEditingReview({ ...editingReview, review: e.target.value })
                  }
                  placeholder="Enter the testimonial text..."
                  rows={4}
                />
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <Button
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingReview(null);
                  }}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button onClick={handleSave} className="bg-cyan-600 hover:bg-cyan-700">
                  Save Review
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

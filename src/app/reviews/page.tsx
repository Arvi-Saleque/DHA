"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import {
  ArrowLeft,
  Star,
  MessageSquare,
  User,
  Upload,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import ImageUploader from "@/components/common/ImageUploader";

export default function ReviewSubmissionPage() {
  const [formData, setFormData] = useState({
    name: "",
    relation: "",
    image: "",
    gender: "male",
    rating: 5,
    review: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Get the highest order number
      const reviewsResponse = await fetch("/api/reviews");
      const reviewsData = await reviewsResponse.json();
      const maxOrder = reviewsData.reviews?.length > 0 
        ? Math.max(...reviewsData.reviews.map((r: any) => r.order || 0))
        : 0;

      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          order: maxOrder + 1,
          isActive: false, // Set to false by default, admin can approve
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setFormData({
          name: "",
          relation: "",
          image: "",
          gender: "male",
          rating: 5,
          review: "",
        });
        setTimeout(() => setIsSubmitted(false), 5000);
      } else {
        alert("Failed to submit review. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (interactive = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && setFormData({ ...formData, rating: star })}
            onMouseEnter={() => interactive && setHoveredRating(star)}
            onMouseLeave={() => interactive && setHoveredRating(0)}
            className={`${interactive ? 'cursor-pointer' : 'cursor-default'} transition-transform ${interactive ? 'hover:scale-110' : ''}`}
            disabled={!interactive}
          >
            <Star
              className={`w-8 h-8 ${
                star <= (hoveredRating || formData.rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative h-[300px] sm:h-[350px] md:h-[400px] bg-cyan-600 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
        
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-white text-center">
          <Link href="/">
            <Button
              variant="ghost"
              className="absolute top-4 left-4 sm:top-6 sm:left-6 text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Back to Home</span>
              <span className="sm:hidden">Back</span>
            </Button>
          </Link>

          <Badge
            variant="secondary"
            className="mb-4 bg-white/20 backdrop-blur-sm text-white border-white/30"
          >
            <MessageSquare className="w-3 h-3 mr-1" />
            Share Your Experience
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 drop-shadow-lg">
            Submit Your Review
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-cyan-50 max-w-2xl drop-shadow-md">
            Help others by sharing your experience with our institution
          </p>
        </div>
      </section>

      {/* Review Form */}
      <section className="container mx-auto px-4 -mt-16 relative z-10 pb-20">
        <Card className="max-w-2xl mx-auto border-none shadow-2xl">
          <CardHeader className="border-b bg-slate-50/50">
            <CardTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-500" />
              Write Your Review
            </CardTitle>
            <CardDescription className="mt-2">
              Your review will be reviewed by our team before being published
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 sm:p-8">
            {isSubmitted && (
              <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-lg flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-green-900 mb-1">
                    Review Submitted Successfully!
                  </h4>
                  <p className="text-sm text-green-700">
                    Thank you for your feedback. Your review will be published after admin approval.
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2 text-base">
                  <User className="w-4 h-4 text-slate-500" />
                  Your Name <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="border-slate-300"
                />
              </div>

              {/* Relation */}
              <div className="space-y-2">
                <Label htmlFor="relation" className="flex items-center gap-2 text-base">
                  Your Relation <span className="text-rose-500">*</span>
                </Label>
                <Select
                  value={formData.relation}
                  onValueChange={(value) =>
                    setFormData({ ...formData, relation: value })
                  }
                  required
                >
                  <SelectTrigger className="border-slate-300">
                    <SelectValue placeholder="Select your relation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Student">Student</SelectItem>
                    <SelectItem value="Parent">Parent</SelectItem>
                    <SelectItem value="Alumni">Alumni</SelectItem>
                    <SelectItem value="Guardian">Guardian</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <Label htmlFor="gender" className="flex items-center gap-2 text-base">
                  Gender <span className="text-rose-500">*</span>
                </Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) =>
                    setFormData({ ...formData, gender: value })
                  }
                  required
                >
                  <SelectTrigger className="border-slate-300">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-slate-500">
                  This will be used for default avatar if you don't upload a photo
                </p>
              </div>

              {/* Rating */}
              <div className="space-y-2">
                <Label className="text-base">
                  Your Rating <span className="text-rose-500">*</span>
                </Label>
                <div className="flex items-center gap-4">
                  {renderStars(true)}
                  <span className="text-lg font-semibold text-slate-700">
                    {formData.rating} / 5
                  </span>
                </div>
                <p className="text-sm text-slate-500">
                  Click on the stars to rate your experience
                </p>
              </div>

              {/* Photo Upload */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-base">
                  <Upload className="w-4 h-4 text-slate-500" />
                  Your Photo (Optional)
                </Label>
                <ImageUploader
                  currentImage={formData.image}
                  onImageUpload={(url) =>
                    setFormData({ ...formData, image: url })
                  }
                  folder="reviews"
                />
                <p className="text-sm text-slate-500">
                  Upload a clear photo of yourself (Max 5MB). If not provided, a default avatar will be used.
                </p>
              </div>

              {/* Review Text */}
              <div className="space-y-2">
                <Label htmlFor="review" className="flex items-center gap-2 text-base">
                  <MessageSquare className="w-4 h-4 text-slate-500" />
                  Your Review <span className="text-rose-500">*</span>
                </Label>
                <Textarea
                  id="review"
                  placeholder="Share your experience with our institution..."
                  value={formData.review}
                  onChange={(e) =>
                    setFormData({ ...formData, review: e.target.value })
                  }
                  required
                  rows={6}
                  className="border-slate-300 resize-none"
                />
                <p className="text-sm text-slate-500">
                  Minimum 50 characters ({formData.review.length}/50)
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting || formData.review.length < 50}
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-6 text-lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Star className="w-5 h-5 mr-2" />
                    Submit Review
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="max-w-2xl mx-auto mt-8 border-2 border-cyan-200 bg-cyan-50/50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">
                  Review Guidelines
                </h3>
                <div className="space-y-2 text-slate-700">
                  <p className="flex items-start gap-2">
                    <span className="font-bold text-cyan-600 mt-0.5">•</span>
                    <span>Be honest and constructive in your feedback</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="font-bold text-cyan-600 mt-0.5">•</span>
                    <span>Reviews are moderated and may take 24-48 hours to appear</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="font-bold text-cyan-600 mt-0.5">•</span>
                    <span>Inappropriate content will not be published</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="font-bold text-cyan-600 mt-0.5">•</span>
                    <span>Your photo and name will be publicly visible once approved</span>
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

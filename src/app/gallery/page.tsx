"use client";

import { useState, useEffect } from "react";
import { Camera, Calendar, MapPin, Share2, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface GalleryImage {
  _id: string;
  title: string;
  category: string;
  imageUrl: string;
  date: Date;
  location: string;
  description: string;
  order: number;
}

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

export default function GalleryPage() {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await fetch("/api/gallery");
      if (res.ok) {
        const data = await res.json();
        setGalleryImages(data);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  };

  // Dynamic categories from fetched data
  const uniqueCategories = Array.from(
    new Set(galleryImages.map((img) => img.category))
  );
  const categories = [
    { id: "all", label: "All Photos", count: galleryImages.length },
    ...uniqueCategories.map((cat) => ({
      id: cat.toLowerCase().replace(/\s+/g, "-"),
      label: cat,
      count: galleryImages.filter((img) => img.category === cat).length,
    })),
  ];

  const getFilteredImages = () => {
    if (selectedCategory === "all") return galleryImages;
    const selectedCat = categories.find((c) => c.id === selectedCategory);
    return galleryImages.filter((img) => img.category === selectedCat?.label);
  };

  const handleShare = (image: GalleryImage) => {
    if (navigator.share) {
      navigator
        .share({
          title: image.title,
          text: image.description,
          url: window.location.href,
        })
        .catch((error) => console.log("Error sharing:", error));
    } else {
      alert("Share functionality not supported on this browser");
    }
  };

  const handleDownload = (image: GalleryImage) => {
    const link = document.createElement("a");
    link.href = image.imageUrl;
    link.download = `${image.title}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative h-[300px] sm:h-[350px] md:h-[400px] bg-cyan-600 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>

        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-white text-center">
          <Badge
            variant="secondary"
            className="mb-4 bg-white/20 backdrop-blur-sm text-white border-white/30"
          >
            <Camera className="w-3 h-3 mr-1" />
            Gallery
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 drop-shadow-lg">
            Photo Gallery
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-cyan-50 max-w-3xl drop-shadow-md">
            Capturing memorable moments and achievements of our students and
            institution
          </p>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="text-lg text-gray-600 mt-4">Loading gallery...</p>
            </div>
          ) : (
            <>
              <Tabs
                defaultValue="all"
                className="w-full"
                onValueChange={setSelectedCategory}
              >
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 mb-8">
                  {categories.map((category) => (
                    <TabsTrigger
                      key={category.id}
                      value={category.id}
                      className="text-sm"
                    >
                      {category.label}
                      <span className="ml-2 bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs">
                        {category.count}
                      </span>
                    </TabsTrigger>
                  ))}
                </TabsList>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getFilteredImages().map((image) => (
                    <Card
                      key={image._id}
                      className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300"
                      onClick={() => setSelectedImage(image)}
                    >
                      <div className="relative h-64">
                        {isGoogleDriveUrl(image.imageUrl) ? (
                          <iframe
                            src={getImageUrl(image.imageUrl)}
                            className="w-full h-full"
                            allow="autoplay"
                            title={image.title}
                          />
                        ) : (
                          <img
                            src={image.imageUrl}
                            alt={image.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-white/90 text-gray-800">
                            {image.category}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-2">
                          {image.title}
                        </h3>
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <Calendar className="w-4 h-4 mr-2" />
                          {new Date(image.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-2" />
                          {image.location}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {getFilteredImages().length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-lg text-gray-600">
                      No images available in this category.
                    </p>
                  </div>
                )}
              </Tabs>
            </>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      <Dialog
        open={selectedImage !== null}
        onOpenChange={() => setSelectedImage(null)}
      >
        <DialogContent className="max-w-4xl">
          {selectedImage && (
            <div className="space-y-4">
              <div className="relative h-96">
                {isGoogleDriveUrl(selectedImage.imageUrl) ? (
                  <iframe
                    src={getImageUrl(selectedImage.imageUrl)}
                    className="w-full h-full"
                    allow="autoplay"
                    title={selectedImage.title}
                  />
                ) : (
                  <img
                    src={selectedImage.imageUrl}
                    alt={selectedImage.title}
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">
                  {selectedImage.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {selectedImage.description}
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(selectedImage.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    {selectedImage.location}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleShare(selectedImage)}
                  variant="outline"
                  className="flex-1"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button
                  onClick={() => handleDownload(selectedImage)}
                  variant="outline"
                  className="flex-1"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

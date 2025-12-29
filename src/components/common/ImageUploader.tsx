"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CloudinaryImage {
  url: string;
  publicId: string;
  thumbnail: string;
  createdAt: string;
}

interface ImageUploaderProps {
  label?: string;
  value?: string;
  currentImage?: string; // Alias for value
  onChange?: (url: string) => void;
  onImageUpload?: (url: string) => void; // Alias for onChange
  folder?: string;
  accept?: string;
  maxSizeMB?: number;
  preview?: boolean;
}

export default function ImageUploader({
  label = "Upload Image",
  value = "",
  currentImage,
  onChange,
  onImageUpload,
  folder = "dha-uploads",
  accept = "image/*",
  maxSizeMB = 5,
  preview = true,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [showGallery, setShowGallery] = useState(false);
  const [cloudinaryImages, setCloudinaryImages] = useState<CloudinaryImage[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Support both prop names
  const imageUrl = currentImage || value;
  const handleImageChange = onImageUpload || onChange || (() => {});

  const fetchCloudinaryImages = async () => {
    setLoadingGallery(true);
    try {
      const res = await fetch(`/api/cloudinary-images?folder=${folder}`);
      const data = await res.json();
      if (data.success) {
        setCloudinaryImages(data.images);
      }
    } catch (error) {
      console.error("Failed to fetch Cloudinary images:", error);
    } finally {
      setLoadingGallery(false);
    }
  };

  const handleOpenGallery = () => {
    setShowGallery(true);
    fetchCloudinaryImages();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    setError("");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        handleImageChange(data.url);
      } else {
        // Show detailed error message from server
        const errorMessage = data.message || data.error || "Upload failed";
        setError(errorMessage);
        console.error("Upload failed:", data);
      }
    } catch (error: any) {
      const errorMessage = error?.message || "Upload failed. Please try again.";
      setError(errorMessage);
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    handleImageChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSelectImage = (url: string) => {
    handleImageChange(url);
    setShowGallery(false);
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      
      <div className="flex flex-col gap-3">
        {preview && imageUrl && (
          <div className="relative w-full max-w-md">
            <img
              src={imageUrl}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg border"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={handleRemove}
              disabled={uploading}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}

        <div className="flex gap-2 flex-wrap">
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
            id="file-upload"
          />
          
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload New
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleOpenGallery}
            disabled={uploading}
          >
            <ImageIcon className="w-4 h-4 mr-2" />
            Select Existing
          </Button>

          {value && !uploading && (
            <Button
              type="button"
              variant="ghost"
              onClick={handleRemove}
            >
              Clear
            </Button>
          )}
        </div>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        {!value && !error && (
          <p className="text-sm text-gray-500">
            Maximum file size: {maxSizeMB}MB. Supported formats: JPG, PNG, WebP
          </p>
        )}
      </div>

      {/* Cloudinary Image Gallery Dialog */}
      <Dialog open={showGallery} onOpenChange={setShowGallery}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Select from Uploaded Images</DialogTitle>
          </DialogHeader>
          
          {loadingGallery ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-cyan-600" />
            </div>
          ) : cloudinaryImages.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No images found. Upload a new image to get started.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {cloudinaryImages.map((img) => (
                <div
                  key={img.publicId}
                  className="relative group cursor-pointer rounded-lg overflow-hidden border-2 border-transparent hover:border-cyan-500 transition-all"
                  onClick={() => handleSelectImage(img.url)}
                >
                  <img
                    src={img.thumbnail}
                    alt={img.publicId}
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      Select
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

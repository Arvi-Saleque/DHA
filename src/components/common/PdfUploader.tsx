"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X, Loader2, FileText } from "lucide-react";

interface PdfUploaderProps {
  label?: string;
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  maxSizeMB?: number;
}

export default function PdfUploader({
  label = "Upload PDF",
  value = "",
  onChange,
  folder = "dha-uploads",
  maxSizeMB = 10,
}: PdfUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type !== "application/pdf") {
      setError("Please select a PDF file");
      return;
    }

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
        onChange(data.url);
      } else {
        setError(data.error || "Upload failed");
      }
    } catch (error) {
      setError("Upload failed. Please try again.");
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getFileName = (url: string) => {
    try {
      const parts = url.split("/");
      const lastPart = parts[parts.length - 1];
      return decodeURIComponent(lastPart.split(".")[0]);
    } catch {
      return "Document";
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      
      <div className="flex flex-col gap-3">
        {value && (
          <div className="flex items-center gap-3 p-3 bg-slate-50 border rounded-lg">
            <FileText className="w-8 h-8 text-red-600 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{getFileName(value)}</p>
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline"
              >
                View PDF
              </a>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              disabled={uploading}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}

        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
            id="pdf-upload"
          />
          
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full sm:w-auto"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                {value ? "Change PDF" : "Upload PDF"}
              </>
            )}
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
            Maximum file size: {maxSizeMB}MB. PDF format only.
          </p>
        )}
      </div>
    </div>
  );
}

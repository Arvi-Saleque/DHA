import { NextRequest, NextResponse } from "next/server";
import cloudinary, { validateCloudinaryConfig } from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
  try {
    // Validate Cloudinary configuration first
    validateCloudinaryConfig();
    
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = formData.get("folder") as string || "dha-uploads";

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const dataURI = `data:${file.type};base64,${base64}`;

    // Determine resource type based on file type
    const isPDF = file.type === "application/pdf";
    // CRITICAL: Use 'auto' for PDFs so Cloudinary treats them as images, enabling page transformation
    const resourceType = isPDF ? "auto" : "image";

    // Upload to Cloudinary with appropriate settings
    const uploadOptions: any = {
      folder: folder,
      resource_type: resourceType,
      access_mode: "public",
      type: "upload",
    };

    // For PDFs, Cloudinary will automatically detect and allow page extraction
    if (isPDF) {
      uploadOptions.format = "pdf";
    }

    const result = await cloudinary.uploader.upload(dataURI, uploadOptions);

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      resourceType: resourceType,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed", message: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const publicId = searchParams.get("publicId");
    const resourceType = searchParams.get("resourceType") || "image";

    if (!publicId) {
      return NextResponse.json(
        { error: "No public ID provided" },
        { status: 400 }
      );
    }

    // Delete from Cloudinary with proper resource type
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType as "image" | "video" | "raw",
    });

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error: any) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Delete failed", message: error.message },
      { status: 500 }
    );
  }
}

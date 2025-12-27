import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get("folder") || "gallery";
    
    // Fetch images from Cloudinary folder
    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: folder,
      max_results: 500,
      resource_type: "image",
    });

    const images = result.resources.map((resource: any) => ({
      url: resource.secure_url,
      publicId: resource.public_id,
      thumbnail: resource.secure_url.replace("/upload/", "/upload/c_thumb,w_200,h_200/"),
      createdAt: resource.created_at,
    }));

    return NextResponse.json({
      success: true,
      images,
    });
  } catch (error: any) {
    console.error("Cloudinary fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch images", message: error.message },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import GalleryImage from "@/models/GalleryImage";

// GET: Fetch all gallery images
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    let query: any = {};

    if (category && category !== "all") {
      query.category = category;
    }

    const images = await GalleryImage.find(query).sort({ order: 1, date: -1 });

    return NextResponse.json(images);
  } catch (error: any) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { message: "Failed to fetch gallery images", error: error.message },
      { status: 500 }
    );
  }
}

// POST: Create new gallery image
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    console.log("POST body:", body);

    const image = await GalleryImage.create(body);
    console.log("Created:", image);

    return NextResponse.json(
      { message: "Gallery image created successfully", image },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST Error:", error);
    return NextResponse.json(
      { message: "Failed to create gallery image", error: error.message },
      { status: 500 }
    );
  }
}

// PUT: Update existing gallery image
export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { _id, ...updateData } = body;

    if (!_id) {
      return NextResponse.json(
        { message: "Gallery image ID is required" },
        { status: 400 }
      );
    }

    const image = await GalleryImage.findByIdAndUpdate(_id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!image) {
      return NextResponse.json(
        { message: "Gallery image not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Gallery image updated successfully",
      image,
    });
  } catch (error: any) {
    console.error("PUT Error:", error);
    return NextResponse.json(
      { message: "Failed to update gallery image", error: error.message },
      { status: 500 }
    );
  }
}

// DELETE: Delete gallery image
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const deleteAll = searchParams.get("deleteAll");

    // Delete all gallery images
    if (deleteAll === "true") {
      await GalleryImage.deleteMany({});
      return NextResponse.json({
        message: "All gallery images deleted successfully",
      });
    }

    // Delete single gallery image
    if (!id) {
      return NextResponse.json(
        { message: "Gallery image ID is required" },
        { status: 400 }
      );
    }

    const image = await GalleryImage.findByIdAndDelete(id);

    if (!image) {
      return NextResponse.json(
        { message: "Gallery image not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Gallery image deleted successfully",
    });
  } catch (error: any) {
    console.error("DELETE Error:", error);
    return NextResponse.json(
      { message: "Failed to delete gallery image", error: error.message },
      { status: 500 }
    );
  }
}

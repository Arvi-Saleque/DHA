import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import HomepageGallery from "@/models/HomepageGallery";
import GalleryImage from "@/models/GalleryImage";

// GET - Get selected gallery images for homepage
export async function GET() {
  try {
    await dbConnect();
    
    const homepageGallery = await HomepageGallery.findOne({ isActive: true })
      .populate({
        path: 'galleryImageIds',
        options: { sort: { order: 1 } }
      });
    
    if (!homepageGallery || !homepageGallery.galleryImageIds || homepageGallery.galleryImageIds.length === 0) {
      // Fallback: return latest images if no selection exists
      const latestImages = await GalleryImage.find({})
        .sort({ order: 1 })
        .limit(6);
      
      return NextResponse.json({
        images: latestImages,
        maxItems: 6,
        isCustomSelection: false
      });
    }
    
    return NextResponse.json({
      images: homepageGallery.galleryImageIds.slice(0, homepageGallery.maxItems),
      maxItems: homepageGallery.maxItems,
      isCustomSelection: true,
      _id: homepageGallery._id
    });
  } catch (error) {
    console.error("Error fetching homepage gallery:", error);
    return NextResponse.json(
      { message: "Failed to fetch homepage gallery" },
      { status: 500 }
    );
  }
}

// POST - Create or update homepage gallery selection
export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { galleryImageIds, maxItems } = body;

    // Validation
    if (!galleryImageIds || !Array.isArray(galleryImageIds) || galleryImageIds.length === 0) {
      return NextResponse.json(
        { message: "Please select at least one gallery image" },
        { status: 400 }
      );
    }

    // Deactivate existing selections
    await HomepageGallery.updateMany({}, { isActive: false });

    // Create new selection
    const homepageGallery = await HomepageGallery.create({
      galleryImageIds,
      maxItems: maxItems || 6,
      isActive: true
    });

    const populated = await HomepageGallery.findById(homepageGallery._id)
      .populate('galleryImageIds');

    return NextResponse.json(populated, { status: 201 });
  } catch (error) {
    console.error("Error creating homepage gallery:", error);
    return NextResponse.json(
      { message: "Failed to create homepage gallery selection" },
      { status: 500 }
    );
  }
}

// PUT - Update existing homepage gallery selection
export async function PUT(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { galleryImageIds, maxItems, _id } = body;

    // Validation
    if (!galleryImageIds || !Array.isArray(galleryImageIds) || galleryImageIds.length === 0) {
      return NextResponse.json(
        { message: "Please select at least one gallery image" },
        { status: 400 }
      );
    }

    let homepageGallery;
    
    if (_id) {
      // Update existing
      homepageGallery = await HomepageGallery.findByIdAndUpdate(
        _id,
        { galleryImageIds, maxItems: maxItems || 6 },
        { new: true }
      ).populate('galleryImageIds');
    } else {
      // Create new if doesn't exist
      await HomepageGallery.updateMany({}, { isActive: false });
      homepageGallery = await HomepageGallery.create({
        galleryImageIds,
        maxItems: maxItems || 6,
        isActive: true
      });
      homepageGallery = await HomepageGallery.findById(homepageGallery._id)
        .populate('galleryImageIds');
    }

    return NextResponse.json(homepageGallery);
  } catch (error) {
    console.error("Error updating homepage gallery:", error);
    return NextResponse.json(
      { message: "Failed to update homepage gallery selection" },
      { status: 500 }
    );
  }
}

// DELETE - Remove homepage gallery selection
export async function DELETE() {
  try {
    await dbConnect();
    await HomepageGallery.updateMany({}, { isActive: false });
    
    return NextResponse.json({ message: "Homepage gallery selection removed" });
  } catch (error) {
    console.error("Error deleting homepage gallery:", error);
    return NextResponse.json(
      { message: "Failed to delete homepage gallery selection" },
      { status: 500 }
    );
  }
}

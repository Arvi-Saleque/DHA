import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import HomepageNews from "@/models/HomepageNews";
import NewsEvent from "@/models/NewsEvent";

// GET - Get selected news for homepage
export async function GET() {
  try {
    await dbConnect();
    
    const homepageNews = await HomepageNews.findOne({ isActive: true })
      .populate({
        path: 'newsEventIds',
        options: { sort: { date: -1 } }
      });
    
    if (!homepageNews || !homepageNews.newsEventIds || homepageNews.newsEventIds.length === 0) {
      // Fallback: return latest news if no selection exists
      const latestNews = await NewsEvent.find({})
        .sort({ date: -1 })
        .limit(3);
      
      return NextResponse.json({
        newsEvents: latestNews,
        maxItems: 3,
        isCustomSelection: false
      });
    }
    
    return NextResponse.json({
      newsEvents: homepageNews.newsEventIds.slice(0, homepageNews.maxItems),
      maxItems: homepageNews.maxItems,
      isCustomSelection: true,
      _id: homepageNews._id
    });
  } catch (error) {
    console.error("Error fetching homepage news:", error);
    return NextResponse.json(
      { message: "Failed to fetch homepage news" },
      { status: 500 }
    );
  }
}

// POST - Create or update homepage news selection
export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { newsEventIds, maxItems } = body;

    // Validation
    if (!newsEventIds || !Array.isArray(newsEventIds) || newsEventIds.length === 0) {
      return NextResponse.json(
        { message: "Please select at least one news item" },
        { status: 400 }
      );
    }

    // Deactivate existing selections
    await HomepageNews.updateMany({}, { isActive: false });

    // Create new selection
    const homepageNews = await HomepageNews.create({
      newsEventIds,
      maxItems: maxItems || 3,
      isActive: true
    });

    const populated = await HomepageNews.findById(homepageNews._id)
      .populate('newsEventIds');

    return NextResponse.json(populated, { status: 201 });
  } catch (error) {
    console.error("Error creating homepage news:", error);
    return NextResponse.json(
      { message: "Failed to create homepage news selection" },
      { status: 500 }
    );
  }
}

// PUT - Update existing homepage news selection
export async function PUT(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { newsEventIds, maxItems, _id } = body;

    // Validation
    if (!newsEventIds || !Array.isArray(newsEventIds) || newsEventIds.length === 0) {
      return NextResponse.json(
        { message: "Please select at least one news item" },
        { status: 400 }
      );
    }

    let homepageNews;
    
    if (_id) {
      // Update existing
      homepageNews = await HomepageNews.findByIdAndUpdate(
        _id,
        { newsEventIds, maxItems: maxItems || 3 },
        { new: true }
      ).populate('newsEventIds');
    } else {
      // Create new if doesn't exist
      await HomepageNews.updateMany({}, { isActive: false });
      homepageNews = await HomepageNews.create({
        newsEventIds,
        maxItems: maxItems || 3,
        isActive: true
      });
      homepageNews = await HomepageNews.findById(homepageNews._id)
        .populate('newsEventIds');
    }

    return NextResponse.json(homepageNews);
  } catch (error) {
    console.error("Error updating homepage news:", error);
    return NextResponse.json(
      { message: "Failed to update homepage news selection" },
      { status: 500 }
    );
  }
}

// DELETE - Remove homepage news selection
export async function DELETE() {
  try {
    await dbConnect();
    await HomepageNews.updateMany({}, { isActive: false });
    
    return NextResponse.json({ message: "Homepage news selection removed" });
  } catch (error) {
    console.error("Error deleting homepage news:", error);
    return NextResponse.json(
      { message: "Failed to delete homepage news selection" },
      { status: 500 }
    );
  }
}

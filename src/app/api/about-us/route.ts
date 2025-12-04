import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import AboutUs from '@/models/AboutUs';

// GET about us content
export async function GET() {
  try {
    await connectDB();
    const about = await AboutUs.findOne({ isActive: true }).sort({ createdAt: -1 });
    return NextResponse.json(about);
  } catch (error) {
    console.error('Error fetching about us:', error);
    return NextResponse.json(
      { error: 'Failed to fetch about us content' },
      { status: 500 }
    );
  }
}

// POST new about us content
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    
    const { title, subtitle, description, imageUrl, establishedYear, features, coreValues, faqs } = body;
    
    if (!title || !subtitle || !description || !imageUrl || !establishedYear) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    const about = await AboutUs.create({
      title,
      subtitle,
      description,
      imageUrl,
      establishedYear,
      features: features || [],
      coreValues: coreValues || [],
      faqs: faqs || [],
      isActive: true
    });

    return NextResponse.json(about, { status: 201 });
  } catch (error) {
    console.error('Error creating about us:', error);
    return NextResponse.json(
      { error: 'Failed to create about us content' },
      { status: 500 }
    );
  }
}

// PUT update about us content
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    
    const { id, title, subtitle, description, imageUrl, establishedYear, features, coreValues, faqs } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Content ID is required' },
        { status: 400 }
      );
    }

    const about = await AboutUs.findByIdAndUpdate(
      id,
      { title, subtitle, description, imageUrl, establishedYear, features, coreValues, faqs },
      { new: true, runValidators: true }
    );

    if (!about) {
      return NextResponse.json(
        { error: 'About us content not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(about);
  } catch (error) {
    console.error('Error updating about us:', error);
    return NextResponse.json(
      { error: 'Failed to update about us content' },
      { status: 500 }
    );
  }
}

// DELETE about us content
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Content ID is required' },
        { status: 400 }
      );
    }

    const about = await AboutUs.findByIdAndDelete(id);

    if (!about) {
      return NextResponse.json(
        { error: 'About us content not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'About us content deleted successfully' });
  } catch (error) {
    console.error('Error deleting about us:', error);
    return NextResponse.json(
      { error: 'Failed to delete about us content' },
      { status: 500 }
    );
  }
}

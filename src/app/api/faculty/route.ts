import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Faculty from '@/models/Faculty';

// GET - Fetch faculty data
export async function GET() {
  try {
    await connectDB();
    const faculty = await Faculty.findOne({ isActive: true }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: faculty,
    });
  } catch (error) {
    console.error('Error fetching faculty:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch faculty data' },
      { status: 500 }
    );
  }
}

// POST - Create new faculty data
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const {
      pageTitle,
      pageSubtitle,
      sectionTitle,
      sectionDescription,
      categories,
      teachers,
      quote,
      quoteAuthor
    } = body;

    // Validate required fields
    if (!pageTitle || !sectionTitle) {
      return NextResponse.json(
        { success: false, error: 'Page title and section title are required' },
        { status: 400 }
      );
    }

    // Deactivate all existing records
    await Faculty.updateMany({}, { isActive: false });

    const faculty = await Faculty.create({
      pageTitle,
      pageSubtitle: pageSubtitle || '',
      sectionTitle,
      sectionDescription: sectionDescription || '',
      categories: categories || [],
      teachers: teachers || [],
      quote: quote || '',
      quoteAuthor: quoteAuthor || '',
      isActive: true,
    });

    return NextResponse.json({
      success: true,
      data: faculty,
    });
  } catch (error: any) {
    console.error('Error creating faculty:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create faculty data' },
      { status: 500 }
    );
  }
}

// PUT - Update faculty data
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { _id, ...updateData } = body;

    if (!_id) {
      return NextResponse.json(
        { success: false, error: 'Faculty ID is required' },
        { status: 400 }
      );
    }

    // Ensure arrays are provided with defaults
    const dataToUpdate = {
      ...updateData,
      categories: updateData.categories || [],
      teachers: updateData.teachers || [],
      isActive: true,
    };

    const faculty = await Faculty.findByIdAndUpdate(
      _id,
      dataToUpdate,
      { new: true, runValidators: true }
    );

    if (!faculty) {
      return NextResponse.json(
        { success: false, error: 'Faculty not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: faculty,
    });
  } catch (error: any) {
    console.error('Error updating faculty:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update faculty data' },
      { status: 500 }
    );
  }
}

// DELETE - Delete faculty data
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Faculty ID is required' },
        { status: 400 }
      );
    }

    const faculty = await Faculty.findByIdAndDelete(id);

    if (!faculty) {
      return NextResponse.json(
        { success: false, error: 'Faculty not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Faculty deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting faculty:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete faculty data' },
      { status: 500 }
    );
  }
}

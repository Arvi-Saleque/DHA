import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import TodaysAbsence from '@/models/TodaysAbsence';
import { sendAutomaticNotification } from '@/lib/newsletter';

// GET - Fetch all active absences
export async function GET() {
  try {
    await connectDB();
    const absences = await TodaysAbsence.find({ isActive: true })
      .sort({ date: -1, createdAt: -1 });
    
    return NextResponse.json({ absences }, { status: 200 });
  } catch (error) {
    console.error('Error fetching absences:', error);
    return NextResponse.json(
      { error: 'Failed to fetch absences' },
      { status: 500 }
    );
  }
}

// POST - Create new absence
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { className, section, title, imageUrl } = body;

    if (!className || !section || !title || !imageUrl) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const absence = await TodaysAbsence.create({
      className,
      section,
      title,
      imageUrl,
    });
    
    // Send automatic notification to subscribers
    await sendAutomaticNotification(
      'Absence Report Published',
      `${title} - Absence report for ${className} ${section}.`,
      `/absences`
    );

    return NextResponse.json(
      { message: 'Absence created successfully', absence },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating absence:', error);
    return NextResponse.json(
      { error: 'Failed to create absence' },
      { status: 500 }
    );
  }
}

// PUT - Update absence
export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { id, className, section, title, imageUrl } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Absence ID is required' },
        { status: 400 }
      );
    }

    const absence = await TodaysAbsence.findByIdAndUpdate(
      id,
      { className, section, title, imageUrl },
      { new: true }
    );

    if (!absence) {
      return NextResponse.json(
        { error: 'Absence not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Absence updated successfully', absence },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating absence:', error);
    return NextResponse.json(
      { error: 'Failed to update absence' },
      { status: 500 }
    );
  }
}

// DELETE - Permanently delete absence
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Absence ID is required' },
        { status: 400 }
      );
    }

    const absence = await TodaysAbsence.findByIdAndDelete(id);

    if (!absence) {
      return NextResponse.json(
        { error: 'Absence not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Absence deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting absence:', error);
    return NextResponse.json(
      { error: 'Failed to delete absence' },
      { status: 500 }
    );
  }
}

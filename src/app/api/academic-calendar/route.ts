import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import AcademicCalendar from '@/models/AcademicCalendar';
import { sendAutomaticNotification } from '@/lib/newsletter';

// GET - Fetch all academic calendars
export async function GET() {
  try {
    await connectDB();
    const calendars = await AcademicCalendar.find({ isActive: true }).sort({ createdAt: 1 });
    return NextResponse.json(calendars);
  } catch (error) {
    console.error('Error fetching academic calendars:', error);
    return NextResponse.json({ error: 'Failed to fetch academic calendars' }, { status: 500 });
  }
}

// POST - Create new academic calendar
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { month, pdfUrl } = body;

    if (!month || !pdfUrl) {
      return NextResponse.json(
        { error: 'Month and PDF URL are required' },
        { status: 400 }
      );
    }

    const calendar = await AcademicCalendar.create({
      month,
      pdfUrl,
      isActive: true,
    });
    
    // Send automatic notification to subscribers
    await sendAutomaticNotification(
      'New Academic Calendar Published',
      `Academic calendar for ${month} has been published.`,
      `/academic/calendar`
    );

    return NextResponse.json(calendar, { status: 201 });
  } catch (error) {
    console.error('Error creating academic calendar:', error);
    return NextResponse.json({ error: 'Failed to create academic calendar' }, { status: 500 });
  }
}

// PUT - Update academic calendar
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { _id, month, pdfUrl } = body;

    if (!_id) {
      return NextResponse.json({ error: 'Calendar ID is required' }, { status: 400 });
    }

    const calendar = await AcademicCalendar.findByIdAndUpdate(
      _id,
      { month, pdfUrl },
      { new: true }
    );

    if (!calendar) {
      return NextResponse.json({ error: 'Calendar not found' }, { status: 404 });
    }

    return NextResponse.json(calendar);
  } catch (error) {
    console.error('Error updating academic calendar:', error);
    return NextResponse.json({ error: 'Failed to update academic calendar' }, { status: 500 });
  }
}

// DELETE - Delete academic calendar
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Calendar ID is required' }, { status: 400 });
    }

    const calendar = await AcademicCalendar.findByIdAndDelete(id);

    if (!calendar) {
      return NextResponse.json({ error: 'Calendar not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Calendar deleted successfully' });
  } catch (error) {
    console.error('Error deleting academic calendar:', error);
    return NextResponse.json({ error: 'Failed to delete academic calendar' }, { status: 500 });
  }
}

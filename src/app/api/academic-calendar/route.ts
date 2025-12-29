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
    const { month, pdfUrl, totalPages } = body;

    console.log("POST request body:", body);
    console.log("totalPages value:", totalPages);

    if (!month || !pdfUrl) {
      return NextResponse.json(
        { error: 'Month and PDF URL are required' },
        { status: 400 }
      );
    }

    const calendarData = {
      month,
      pdfUrl,
      totalPages: totalPages || 15,
      isActive: true,
    };

    console.log("Creating calendar with data:", calendarData);

    const calendar = await AcademicCalendar.create(calendarData) as any;
    
    console.log("Created calendar:", calendar);
    
    // Send automatic notification to subscribers
    await sendAutomaticNotification({
      type: 'academic',
      title: 'New Academic Calendar Published',
      message: `Academic calendar for ${month} has been published.`,
      link: `/academic/calendar`
    });

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
    const { _id, month, pdfUrl, totalPages } = body;

    if (!_id) {
      return NextResponse.json({ error: 'Calendar ID is required' }, { status: 400 });
    }

    const calendar = await AcademicCalendar.findByIdAndUpdate(
      _id,
      { month, pdfUrl, totalPages: totalPages || 15 },
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
    
    // Check if this is a delete all request
    const body = await request.json().catch(() => null);
    if (body?.deleteAll) {
      await AcademicCalendar.deleteMany({});
      return NextResponse.json({ message: 'All calendars deleted successfully' });
    }
    
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

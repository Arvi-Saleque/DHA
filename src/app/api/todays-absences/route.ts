import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import TodaysAbsence from '@/models/TodaysAbsence';
import { sendAutomaticNotification } from '@/lib/newsletter';

// GET - Fetch all active absences with optional filters
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');
    const className = searchParams.get('class');

    // Build query
    const query: any = { isActive: true };
    
    if (date) {
      // Parse date and create range for that day
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      query.date = { $gte: startDate, $lte: endDate };
    }
    
    if (className && className !== 'all') {
      query.className = className;
    }

    const absences = await TodaysAbsence.find(query)
      .sort({ date: -1, className: 1 });
    
    // Get unique dates for filter dropdown
    const allDates = await TodaysAbsence.distinct('date', { isActive: true });
    const uniqueDates = allDates
      .map((d: Date) => d.toISOString().split('T')[0])
      .filter((v: string, i: number, a: string[]) => a.indexOf(v) === i)
      .sort((a: string, b: string) => new Date(b).getTime() - new Date(a).getTime());

    return NextResponse.json({ absences, availableDates: uniqueDates }, { status: 200 });
  } catch (error) {
    console.error('Error fetching absences:', error);
    return NextResponse.json(
      { error: 'Failed to fetch absences' },
      { status: 500 }
    );
  }
}

// POST - Create new absence record
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { date, className, students } = body;

    if (!date || !className || !students || students.length === 0) {
      return NextResponse.json(
        { error: 'Date, class, and at least one student are required' },
        { status: 400 }
      );
    }

    // Check if absence record already exists for this date and class
    const existingRecord = await TodaysAbsence.findOne({
      date: new Date(date),
      className,
    });

    if (existingRecord) {
      // Update existing record by adding new students
      existingRecord.students = students;
      existingRecord.totalAbsent = students.length;
      await existingRecord.save();
      
      return NextResponse.json(
        { message: 'Absence record updated successfully', absence: existingRecord },
        { status: 200 }
      );
    }

    const absence = await TodaysAbsence.create({
      date: new Date(date),
      className,
      students,
      totalAbsent: students.length,
    });
    
    // Send automatic notification to subscribers
    await sendAutomaticNotification({
      type: 'academic',
      title: 'Absence Report Published',
      message: `Absence report for ${className} on ${new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} has been published.`,
      link: `/absences`
    });

    return NextResponse.json(
      { message: 'Absence created successfully', absence },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating absence:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create absence' },
      { status: 500 }
    );
  }
}

// PUT - Update absence
export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { id, date, className, students } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Absence ID is required' },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (date) updateData.date = new Date(date);
    if (className) updateData.className = className;
    if (students) {
      updateData.students = students;
      updateData.totalAbsent = students.length;
    }

    const absence = await TodaysAbsence.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
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

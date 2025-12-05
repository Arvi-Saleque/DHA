import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Scholarship from '@/models/Scholarship';
import { sendAutomaticNotification } from '@/lib/newsletter';

// GET - Fetch all scholarships
export async function GET() {
  try {
    await connectDB();
    const scholarships = await Scholarship.find({ isActive: true }).sort({ className: 1, date: -1 });
    return NextResponse.json(scholarships);
  } catch (error) {
    console.error('Error fetching scholarships:', error);
    return NextResponse.json({ error: 'Failed to fetch scholarships' }, { status: 500 });
  }
}

// POST - Create new scholarship
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { className, studentId, studentName, benefactorId, benefactorName, amount, date } = body;

    if (!className || !studentId || !studentName || !benefactorId || !benefactorName || !amount || !date) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const scholarship = await Scholarship.create({
      className,
      studentId,
      studentName,
      benefactorId,
      benefactorName,
      amount,
      date,
      isActive: true,
    });

    // Auto-notify subscribers
    await sendAutomaticNotification({
      type: 'academic',
      title: 'New Scholarship Awarded',
      message: `A scholarship of ${amount} BDT has been awarded to ${studentName} from ${className}. Congratulations!`,
      link: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/academic/scholarship`
    });

    return NextResponse.json(scholarship, { status: 201 });
  } catch (error) {
    console.error('Error creating scholarship:', error);
    return NextResponse.json({ error: 'Failed to create scholarship' }, { status: 500 });
  }
}

// PUT - Update scholarship
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { _id, className, studentId, studentName, benefactorId, benefactorName, amount, date } = body;

    if (!_id) {
      return NextResponse.json({ error: 'Scholarship ID is required' }, { status: 400 });
    }

    const scholarship = await Scholarship.findByIdAndUpdate(
      _id,
      { className, studentId, studentName, benefactorId, benefactorName, amount, date },
      { new: true }
    );

    if (!scholarship) {
      return NextResponse.json({ error: 'Scholarship not found' }, { status: 404 });
    }

    return NextResponse.json(scholarship);
  } catch (error) {
    console.error('Error updating scholarship:', error);
    return NextResponse.json({ error: 'Failed to update scholarship' }, { status: 500 });
  }
}

// DELETE - Delete scholarship
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    
    // Check if this is a delete all request
    const body = await request.json().catch(() => null);
    if (body && body.deleteAll === true) {
      const result = await Scholarship.deleteMany({});
      return NextResponse.json({ 
        message: 'All scholarships deleted successfully',
        deletedCount: result.deletedCount 
      });
    }
    
    // Otherwise, handle single delete
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Scholarship ID is required' }, { status: 400 });
    }

    const scholarship = await Scholarship.findByIdAndDelete(id);

    if (!scholarship) {
      return NextResponse.json({ error: 'Scholarship not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Scholarship deleted successfully' });
  } catch (error) {
    console.error('Error deleting scholarship:', error);
    return NextResponse.json({ error: 'Failed to delete scholarship' }, { status: 500 });
  }
}

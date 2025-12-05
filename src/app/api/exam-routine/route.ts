import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ExamRoutine from '@/models/ExamRoutine';
import { sendAutomaticNotification } from '@/lib/newsletter';

export async function GET() {
  try {
    await connectDB();
    const examRoutines = await ExamRoutine.find({ isActive: true }).sort({ className: 1, examName: 1 });
    return NextResponse.json(examRoutines);
  } catch (error) {
    console.error('Error fetching exam routines:', error);
    return NextResponse.json({ error: 'Failed to fetch exam routines' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const examRoutine = await ExamRoutine.create(body);
    
    // Auto-send notification to subscribers
    await sendAutomaticNotification({
      type: 'academic',
      title: 'New Exam Routine Added',
      message: `A new exam routine has been added for ${body.className} - ${body.examName}. Check the website for complete details.`,
      link: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/academic/exams`
    });
    
    return NextResponse.json(examRoutine, { status: 201 });
  } catch (error) {
    console.error('Error creating exam routine:', error);
    return NextResponse.json({ error: 'Failed to create exam routine' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { _id, ...updateData } = body;
    
    const examRoutine = await ExamRoutine.findByIdAndUpdate(
      _id,
      updateData,
      { new: true }
    );
    
    if (!examRoutine) {
      return NextResponse.json({ error: 'Exam routine not found' }, { status: 404 });
    }
    
    // Auto-send notification to subscribers
    await sendAutomaticNotification({
      type: 'academic',
      title: 'Exam Routine Updated',
      message: `The exam routine for ${examRoutine.className} - ${examRoutine.examName} has been updated. Please check the latest schedule.`,
      link: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/academic/exams`
    });
    
    return NextResponse.json(examRoutine);
  } catch (error) {
    console.error('Error updating exam routine:', error);
    return NextResponse.json({ error: 'Failed to update exam routine' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    
    await ExamRoutine.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Exam routine deleted successfully' });
  } catch (error) {
    console.error('Error deleting exam routine:', error);
    return NextResponse.json({ error: 'Failed to delete exam routine' }, { status: 500 });
  }
}

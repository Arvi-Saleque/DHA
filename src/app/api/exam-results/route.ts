import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ExamResult from '@/models/ExamResult';
import { sendAutomaticNotification } from '@/lib/newsletter';

// GET all exam results
export async function GET() {
  try {
    await connectDB();
    const results = await ExamResult.find({ isActive: true })
      .sort({ publishedDate: -1, className: 1 });
    return NextResponse.json(results);
  } catch (error) {
    console.error('Error fetching exam results:', error);
    return NextResponse.json(
      { error: 'Failed to fetch exam results' },
      { status: 500 }
    );
  }
}

// POST new exam result
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    
    const { className, examName, examType, publishedDate, pdfUrl, passPercentage } = body;
    
    if (!className || !examName || !examType || !publishedDate || !pdfUrl || passPercentage === undefined) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (passPercentage < 0 || passPercentage > 100) {
      return NextResponse.json(
        { error: 'Pass percentage must be between 0 and 100' },
        { status: 400 }
      );
    }

    const result = await ExamResult.create({
      className,
      examName,
      examType,
      publishedDate,
      pdfUrl,
      passPercentage,
      isActive: true
    });

    // Auto-notify subscribers
    await sendAutomaticNotification({
      type: 'academic',
      title: 'Exam Results Published',
      message: `${examName} results for ${className} have been published. Pass rate: ${passPercentage}%. View the complete results now.`,
      link: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/academic/results`
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error creating exam result:', error);
    return NextResponse.json(
      { error: 'Failed to create exam result' },
      { status: 500 }
    );
  }
}

// PUT update exam result
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    
    const { id, className, examName, examType, publishedDate, pdfUrl, passPercentage } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Result ID is required' },
        { status: 400 }
      );
    }

    if (passPercentage !== undefined && (passPercentage < 0 || passPercentage > 100)) {
      return NextResponse.json(
        { error: 'Pass percentage must be between 0 and 100' },
        { status: 400 }
      );
    }

    const result = await ExamResult.findByIdAndUpdate(
      id,
      { className, examName, examType, publishedDate, pdfUrl, passPercentage },
      { new: true, runValidators: true }
    );

    if (!result) {
      return NextResponse.json(
        { error: 'Exam result not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating exam result:', error);
    return NextResponse.json(
      { error: 'Failed to update exam result' },
      { status: 500 }
    );
  }
}

// DELETE exam result
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Result ID is required' },
        { status: 400 }
      );
    }

    const result = await ExamResult.findByIdAndDelete(id);

    if (!result) {
      return NextResponse.json(
        { error: 'Exam result not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Exam result deleted successfully' });
  } catch (error) {
    console.error('Error deleting exam result:', error);
    return NextResponse.json(
      { error: 'Failed to delete exam result' },
      { status: 500 }
    );
  }
}

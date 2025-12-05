import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import AdmissionFee from '@/models/AdmissionFee';
import { sendAutomaticNotification } from '@/lib/newsletter';

// GET - Fetch all admission fees
export async function GET() {
  try {
    await connectDB();
    const fees = await AdmissionFee.find({ isActive: true }).sort({ className: 1 });
    return NextResponse.json(fees);
  } catch (error) {
    console.error('Error fetching admission fees:', error);
    return NextResponse.json({ error: 'Failed to fetch admission fees' }, { status: 500 });
  }
}

// POST - Create new admission fee
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { className, admissionFee, tuitionFee, examFee, otherFees } = body;

    if (!className || !admissionFee || !tuitionFee || !examFee) {
      return NextResponse.json(
        { error: 'Class name, admission fee, tuition fee, and exam fee are required' },
        { status: 400 }
      );
    }

    const fee = await AdmissionFee.create({
      className,
      admissionFee,
      tuitionFee,
      examFee,
      otherFees: otherFees || 0,
      isActive: true,
    }) as any;
    
    // Send automatic notification to subscribers
    await sendAutomaticNotification({
      type: 'academic',
      title: 'New Admission Fee Structure',
      message: `Admission fee structure for ${className} has been updated.`,
      link: `/academic/admission-fee?class=${encodeURIComponent(className)}`
    });

    return NextResponse.json(fee, { status: 201 });
  } catch (error) {
    console.error('Error creating admission fee:', error);
    return NextResponse.json({ error: 'Failed to create admission fee' }, { status: 500 });
  }
}

// PUT - Update admission fee
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { _id, className, admissionFee, tuitionFee, examFee, otherFees } = body;

    if (!_id) {
      return NextResponse.json({ error: 'Fee ID is required' }, { status: 400 });
    }

    const fee = await AdmissionFee.findByIdAndUpdate(
      _id,
      { className, admissionFee, tuitionFee, examFee, otherFees },
      { new: true }
    );

    if (!fee) {
      return NextResponse.json({ error: 'Fee record not found' }, { status: 404 });
    }

    return NextResponse.json(fee);
  } catch (error) {
    console.error('Error updating admission fee:', error);
    return NextResponse.json({ error: 'Failed to update admission fee' }, { status: 500 });
  }
}

// DELETE - Delete admission fee
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Fee ID is required' }, { status: 400 });
    }

    const fee = await AdmissionFee.findByIdAndDelete(id);

    if (!fee) {
      return NextResponse.json({ error: 'Fee record not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Fee record deleted successfully' });
  } catch (error) {
    console.error('Error deleting admission fee:', error);
    return NextResponse.json({ error: 'Failed to delete admission fee' }, { status: 500 });
  }
}

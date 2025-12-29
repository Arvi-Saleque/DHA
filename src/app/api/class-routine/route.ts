import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ClassRoutine from '@/models/ClassRoutine';
import { sendAutomaticNotification } from '@/lib/newsletter';

export async function GET() {
  try {
    await connectDB();
    const classRoutines = await ClassRoutine.find({ isActive: true }).sort({ className: 1, routineName: 1 });
    return NextResponse.json(classRoutines);
  } catch (error) {
    console.error('Error fetching class routines:', error);
    return NextResponse.json({ error: 'Failed to fetch class routines' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const classRoutine = await ClassRoutine.create(body);
    
    // Auto-notify subscribers
    await sendAutomaticNotification({
      type: 'academic',
      title: 'New Class Routine Available',
      message: `The class routine for ${body.className} - ${body.routineName} is now available. Check the updated schedule on our website.`,
      link: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/academic/routine`
    });
    
    return NextResponse.json(classRoutine, { status: 201 });
  } catch (error) {
    console.error('Error creating class routine:', error);
    return NextResponse.json({ error: 'Failed to create class routine' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { _id, ...updateData } = body;
    
    const classRoutine = await ClassRoutine.findByIdAndUpdate(
      _id,
      updateData,
      { new: true }
    );
    
    if (!classRoutine) {
      return NextResponse.json({ error: 'Class routine not found' }, { status: 404 });
    }
    
    return NextResponse.json(classRoutine);
  } catch (error) {
    console.error('Error updating class routine:', error);
    return NextResponse.json({ error: 'Failed to update class routine' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    
    // Check if it's a delete all request
    const body = await request.json().catch(() => null);
    
    if (body?.deleteAll === true) {
      await ClassRoutine.deleteMany({});
      return NextResponse.json({ message: 'All class routines deleted successfully' });
    }
    
    // Otherwise, delete single item by ID
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    
    await ClassRoutine.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Class routine deleted successfully' });
  } catch (error) {
    console.error('Error deleting class routine:', error);
    return NextResponse.json({ error: 'Failed to delete class routine' }, { status: 500 });
  }
}

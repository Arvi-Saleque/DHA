import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ClassRoutine from '@/models/ClassRoutine';

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

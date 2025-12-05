import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Curriculum from '@/models/Curriculum';
import { sendAutomaticNotification } from '@/lib/newsletter';

export async function GET() {
  try {
    await connectDB();
    const curriculums = await Curriculum.find({ isActive: true }).sort({ className: 1 });
    return NextResponse.json(curriculums);
  } catch (error) {
    console.error('Error fetching curriculums:', error);
    return NextResponse.json({ error: 'Failed to fetch curriculums' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const curriculum = await Curriculum.create(body);
    
    // Send automatic notification to subscribers
    await sendAutomaticNotification(
      'New Curriculum Published',
      `New curriculum has been published for ${curriculum.className}.`,
      `/academic/curriculum?class=${encodeURIComponent(curriculum.className)}`
    );
    
    return NextResponse.json(curriculum, { status: 201 });
  } catch (error) {
    console.error('Error creating curriculum:', error);
    return NextResponse.json({ error: 'Failed to create curriculum' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { _id, ...updateData } = body;
    
    const curriculum = await Curriculum.findByIdAndUpdate(
      _id,
      updateData,
      { new: true }
    );
    
    if (!curriculum) {
      return NextResponse.json({ error: 'Curriculum not found' }, { status: 404 });
    }
    
    return NextResponse.json(curriculum);
  } catch (error) {
    console.error('Error updating curriculum:', error);
    return NextResponse.json({ error: 'Failed to update curriculum' }, { status: 500 });
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
    
    await Curriculum.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Curriculum deleted successfully' });
  } catch (error) {
    console.error('Error deleting curriculum:', error);
    return NextResponse.json({ error: 'Failed to delete curriculum' }, { status: 500 });
  }
}

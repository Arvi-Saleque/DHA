import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Syllabus from '@/models/Syllabus';
import { sendAutomaticNotification } from '@/lib/newsletter';

export async function GET() {
  try {
    await connectDB();
    const syllabuses = await Syllabus.find({ isActive: true }).sort({ className: 1, subject: 1 });
    return NextResponse.json(syllabuses);
  } catch (error) {
    console.error('Error fetching syllabuses:', error);
    return NextResponse.json({ error: 'Failed to fetch syllabuses' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const syllabus = await Syllabus.create(body);
    
    // Send automatic notification to subscribers
    await sendAutomaticNotification(
      'New Syllabus Published',
      `New syllabus for ${syllabus.subject} has been published for ${syllabus.className}.`,
      `/academic/syllabus?class=${encodeURIComponent(syllabus.className)}`
    );
    
    return NextResponse.json(syllabus, { status: 201 });
  } catch (error) {
    console.error('Error creating syllabus:', error);
    return NextResponse.json({ error: 'Failed to create syllabus' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { _id, ...updateData } = body;
    
    const syllabus = await Syllabus.findByIdAndUpdate(
      _id,
      updateData,
      { new: true }
    );
    
    if (!syllabus) {
      return NextResponse.json({ error: 'Syllabus not found' }, { status: 404 });
    }
    
    return NextResponse.json(syllabus);
  } catch (error) {
    console.error('Error updating syllabus:', error);
    return NextResponse.json({ error: 'Failed to update syllabus' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    
    // Check if this is a delete all request
    const body = await request.json().catch(() => null);
    if (body && body.deleteAll === true) {
      const result = await Syllabus.deleteMany({});
      return NextResponse.json({ 
        message: 'All syllabuses deleted successfully',
        deletedCount: result.deletedCount 
      });
    }
    
    // Otherwise, handle single delete
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    
    await Syllabus.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Syllabus deleted successfully' });
  } catch (error) {
    console.error('Error deleting syllabus:', error);
    return NextResponse.json({ error: 'Failed to delete syllabus' }, { status: 500 });
  }
}

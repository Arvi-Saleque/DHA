import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ExamResult from '@/models/ExamResult';

export async function DELETE() {
  try {
    await dbConnect();
    await ExamResult.deleteMany({});
    return NextResponse.json({ message: 'All exam results deleted successfully' });
  } catch (error) {
    console.error('Error deleting all exam results:', error);
    return NextResponse.json(
      { error: 'Failed to delete exam results' },
      { status: 500 }
    );
  }
}

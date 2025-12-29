import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import TodaysAbsence from '@/models/TodaysAbsence';

export async function DELETE() {
  try {
    await connectDB();
    const result = await TodaysAbsence.deleteMany({});
    
    return NextResponse.json({
      success: true,
      message: `Deleted ${result.deletedCount} absence records`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error deleting all absences:', error);
    return NextResponse.json(
      { error: 'Failed to delete all absences' },
      { status: 500 }
    );
  }
}

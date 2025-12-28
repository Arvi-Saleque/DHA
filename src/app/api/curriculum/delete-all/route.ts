import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Curriculum from '@/models/Curriculum';

// API endpoint to delete all curriculum data
// Access via: /api/curriculum/delete-all
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    // Delete all curriculum documents
    const result = await Curriculum.deleteMany({});

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} curriculum documents`,
      deletedCount: result.deletedCount,
    });
  } catch (error: any) {
    console.error('Error deleting curriculum data:', error);
    return NextResponse.json(
      { error: 'Failed to delete curriculum data', message: error.message },
      { status: 500 }
    );
  }
}

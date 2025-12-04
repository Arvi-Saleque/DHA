import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import MissionVision from '@/models/MissionVision';

// GET - Fetch mission vision data
export async function GET() {
  try {
    await connectDB();
    const missionVision = await MissionVision.findOne({ isActive: true }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: missionVision,
    });
  } catch (error) {
    console.error('Error fetching mission vision:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch mission vision data' },
      { status: 500 }
    );
  }
}

// POST - Create new mission vision data
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const { 
      missionTitle, 
      missionDescription, 
      missionImageUrl, 
      missionPoints, 
      visionTitle, 
      visionDescription, 
      visionImageUrl, 
      visionPoints, 
      coreValues 
    } = body;

    // Validate required fields
    if (!missionTitle || !missionDescription || !missionImageUrl) {
      return NextResponse.json(
        { success: false, error: 'Mission title, description, and image are required' },
        { status: 400 }
      );
    }

    if (!visionTitle || !visionDescription || !visionImageUrl) {
      return NextResponse.json(
        { success: false, error: 'Vision title, description, and image are required' },
        { status: 400 }
      );
    }

    // Deactivate all existing records
    await MissionVision.updateMany({}, { isActive: false });

    const missionVision = await MissionVision.create({
      missionTitle,
      missionDescription,
      missionImageUrl,
      missionPoints: missionPoints || [],
      visionTitle,
      visionDescription,
      visionImageUrl,
      visionPoints: visionPoints || [],
      coreValues: coreValues || [],
      isActive: true,
    });

    return NextResponse.json({
      success: true,
      data: missionVision,
    });
  } catch (error: any) {
    console.error('Error creating mission vision:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create mission vision data' },
      { status: 500 }
    );
  }
}

// PUT - Update mission vision data
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { _id, ...updateData } = body;

    if (!_id) {
      return NextResponse.json(
        { success: false, error: 'Mission Vision ID is required' },
        { status: 400 }
      );
    }

    // Ensure arrays are provided with defaults
    const dataToUpdate = {
      ...updateData,
      missionPoints: updateData.missionPoints || [],
      visionPoints: updateData.visionPoints || [],
      coreValues: updateData.coreValues || [],
      isActive: true,
    };

    const missionVision = await MissionVision.findByIdAndUpdate(
      _id,
      dataToUpdate,
      { new: true, runValidators: true }
    );

    if (!missionVision) {
      return NextResponse.json(
        { success: false, error: 'Mission Vision not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: missionVision,
    });
  } catch (error: any) {
    console.error('Error updating mission vision:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update mission vision data' },
      { status: 500 }
    );
  }
}

// DELETE - Delete mission vision data
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Mission Vision ID is required' },
        { status: 400 }
      );
    }

    const missionVision = await MissionVision.findByIdAndDelete(id);

    if (!missionVision) {
      return NextResponse.json(
        { success: false, error: 'Mission Vision not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Mission Vision deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting mission vision:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete mission vision data' },
      { status: 500 }
    );
  }
}

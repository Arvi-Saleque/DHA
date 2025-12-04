import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ChairmanMessage from '@/models/ChairmanMessage';

// GET - Fetch chairman message data
export async function GET() {
  try {
    await connectDB();
    const chairmanMessage = await ChairmanMessage.findOne({ isActive: true }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: chairmanMessage,
    });
  } catch (error) {
    console.error('Error fetching chairman message:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch chairman message data' },
      { status: 500 }
    );
  }
}

// POST - Create new chairman message data
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const { 
      chairmanName,
      chairmanTitle,
      servingSince,
      chairmanImageUrl,
      signatureImageUrl,
      messageTitle,
      messageParagraphs,
      closingMessage,
      closingRegards,
      coreValues,
      achievements,
      inspirationalQuote,
      quoteAuthor
    } = body;

    // Validate required fields
    if (!chairmanName || !chairmanTitle || !servingSince || !chairmanImageUrl) {
      return NextResponse.json(
        { success: false, error: 'Chairman name, title, serving since, and image are required' },
        { status: 400 }
      );
    }

    if (!messageTitle) {
      return NextResponse.json(
        { success: false, error: 'Message title is required' },
        { status: 400 }
      );
    }

    // Deactivate all existing records
    await ChairmanMessage.updateMany({}, { isActive: false });

    const chairmanMessage = await ChairmanMessage.create({
      chairmanName,
      chairmanTitle,
      servingSince,
      chairmanImageUrl,
      signatureImageUrl: signatureImageUrl || '',
      messageTitle,
      messageParagraphs: messageParagraphs || [],
      closingMessage: closingMessage || '',
      closingRegards: closingRegards || 'Warm regards,',
      coreValues: coreValues || [],
      achievements: achievements || [],
      inspirationalQuote: inspirationalQuote || '',
      quoteAuthor: quoteAuthor || '',
      isActive: true,
    });

    return NextResponse.json({
      success: true,
      data: chairmanMessage,
    });
  } catch (error: any) {
    console.error('Error creating chairman message:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create chairman message data' },
      { status: 500 }
    );
  }
}

// PUT - Update chairman message data
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { _id, ...updateData } = body;

    if (!_id) {
      return NextResponse.json(
        { success: false, error: 'Chairman Message ID is required' },
        { status: 400 }
      );
    }

    // Ensure arrays are provided with defaults
    const dataToUpdate = {
      ...updateData,
      messageParagraphs: updateData.messageParagraphs || [],
      coreValues: updateData.coreValues || [],
      achievements: updateData.achievements || [],
      isActive: true,
    };

    const chairmanMessage = await ChairmanMessage.findByIdAndUpdate(
      _id,
      dataToUpdate,
      { new: true, runValidators: true }
    );

    if (!chairmanMessage) {
      return NextResponse.json(
        { success: false, error: 'Chairman Message not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: chairmanMessage,
    });
  } catch (error: any) {
    console.error('Error updating chairman message:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update chairman message data' },
      { status: 500 }
    );
  }
}

// DELETE - Delete chairman message data
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Chairman Message ID is required' },
        { status: 400 }
      );
    }

    const chairmanMessage = await ChairmanMessage.findByIdAndDelete(id);

    if (!chairmanMessage) {
      return NextResponse.json(
        { success: false, error: 'Chairman Message not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Chairman Message deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting chairman message:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete chairman message data' },
      { status: 500 }
    );
  }
}

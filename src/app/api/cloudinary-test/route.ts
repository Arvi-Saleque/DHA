import { NextResponse } from "next/server";

export async function GET() {
  try {
    const config = {
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ? '✓ Set' : '✗ Missing',
      apiKey: process.env.CLOUDINARY_API_KEY ? '✓ Set' : '✗ Missing',
      apiSecret: process.env.CLOUDINARY_API_SECRET ? '✓ Set' : '✗ Missing',
    };

    return NextResponse.json({
      message: "Cloudinary Configuration Status",
      config,
      cloudNameValue: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'NOT SET',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

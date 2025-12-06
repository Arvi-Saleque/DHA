import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import FooterSettings from "@/models/FooterSettings";

export async function GET() {
  try {
    await dbConnect();

    let settings = await FooterSettings.findOne();

    // If no settings exist, create default
    if (!settings) {
      settings = await FooterSettings.create({
        socialMedia: {
          facebook: "https://facebook.com",
          twitter: "https://twitter.com",
          instagram: "https://instagram.com",
          youtube: "https://youtube.com",
        },
        contact: {
          address: "123 Education Street, Dhaka, Bangladesh",
          phone: "+880 1234-567890",
          email: "info@madrasa.edu",
          officeHours: "Sunday - Thursday: 8:00 AM - 5:00 PM",
        },
        bottomLinks: {
          privacyPolicy: "/privacy",
          termsOfService: "/terms",
          sitemap: "/sitemap",
        },
        copyrightText: "All rights reserved.",
        mapEmbedUrl:
          "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.9064863474833!2d90.39166931543427!3d23.750903394653474!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b087026b81%3A0x8fa563bbdd5904c2!2sDhaka%2C%20Bangladesh!5e0!3m2!1sen!2s!4v1633024800000!5m2!1sen!2s",
      });
    }

    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error("Error fetching footer settings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch footer settings" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();

    // Find existing settings or create new
    let settings = await FooterSettings.findOne();

    if (settings) {
      // Update existing
      settings = await FooterSettings.findByIdAndUpdate(
        settings._id,
        { $set: body },
        { new: true, runValidators: true }
      );
    } else {
      // Create new
      settings = await FooterSettings.create(body);
    }

    return NextResponse.json({
      success: true,
      message: "Footer settings updated successfully",
      data: settings,
    });
  } catch (error) {
    console.error("Error updating footer settings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update footer settings" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  return POST(request);
}

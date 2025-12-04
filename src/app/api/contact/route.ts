import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Contact from "@/models/Contact";

export async function GET() {
  try {
    await connectDB();
    const contact = await Contact.findOne();
    
    // If no data exists, create default
    if (!contact) {
      const defaultContact = await Contact.create({
        title: "Contact Us",
        description: "We're here to help. Reach out to us anytime",
        contactInfo: [
          {
            icon: "Phone",
            title: "Phone Number",
            details: ["+880 1234-567890", "+880 1234-567891"],
            order: 1,
          },
          {
            icon: "Mail",
            title: "Email Address",
            details: ["info@madrasa.edu", "admission@madrasa.edu"],
            order: 2,
          },
          {
            icon: "MapPin",
            title: "Location",
            details: ["123 Education Street", "Dhaka, Bangladesh"],
            order: 3,
          },
          {
            icon: "Clock",
            title: "Working Hours",
            details: [
              "Sunday - Thursday: 8:00 AM - 4:00 PM",
              "Friday - Saturday: Closed",
            ],
            order: 4,
          },
        ],
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.9009593164417!2d90.39169831498181!3d23.750891084588743!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b087026b81%3A0x8fa563bbdd5904c2!2sDhaka%2C%20Bangladesh!5e0!3m2!1sen!2s!4v1633384839234!5m2!1sen!2s",
        officeHours: {
          weekdays: "Sunday - Thursday",
          weekdaysTime: "8:00 AM - 4:00 PM",
          weekends: "Friday - Saturday",
          weekendsTime: "Closed",
          additionalInfo: "For urgent matters outside office hours, please email us and we'll respond as soon as possible.",
        },
        quickTips: [
          "Check our FAQ section for common questions",
          "Provide detailed information in your message",
          "We typically respond within 24 hours",
          "For admission queries, visit the Admission page",
        ],
      });
      return NextResponse.json(defaultContact);
    }
    
    return NextResponse.json(contact);
  } catch (error: unknown) {
    console.error("Error fetching contact:", error);
    return NextResponse.json(
      { message: "Failed to fetch contact info", error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    console.log("Updating contact:", body);

    let contact = await Contact.findOne();
    
    if (!contact) {
      contact = await Contact.create(body);
    } else {
      contact = await Contact.findByIdAndUpdate(
        contact._id,
        body,
        { new: true, runValidators: true }
      );
    }

    return NextResponse.json(contact);
  } catch (error: unknown) {
    console.error("Error updating contact:", error);
    return NextResponse.json(
      { message: "Failed to update contact info", error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

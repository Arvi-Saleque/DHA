import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Admission from "@/models/Admission";

export async function GET() {
  try {
    await connectDB();
    const admission = await Admission.findOne();
    
    // If no data exists, create default
    if (!admission) {
      const defaultAdmission = await Admission.create({
        title: "Admission Information",
        description: "Join our institution and embark on a journey of excellence",
        requirements: [
          {
            title: "Age Requirement",
            description: "Students must meet the age criteria for their respective class",
            icon: "Users",
            order: 1,
          },
          {
            title: "Academic Records",
            description: "Previous academic transcripts and certificates required",
            icon: "FileText",
            order: 2,
          },
          {
            title: "Application Form",
            description: "Complete and submit the admission application form",
            icon: "ClipboardList",
            order: 3,
          },
        ],
        documents: [
          {
            title: "Birth Certificate",
            description: "Original and photocopy of birth certificate",
            icon: "FileCheck",
            order: 1,
          },
          {
            title: "Passport Photos",
            description: "4 recent passport-size photographs",
            icon: "Image",
            order: 2,
          },
          {
            title: "Previous Records",
            description: "Academic records from previous institution",
            icon: "Award",
            order: 3,
          },
        ],
        admissionProcess: "Visit our office, submit documents, and complete the registration process.",
        contactInfo: {
          phone: "+880 1234-567890",
          email: "admission@example.com",
          officeHours: "Saturday to Thursday, 9:00 AM - 4:00 PM",
        },
      });
      return NextResponse.json(defaultAdmission);
    }
    
    return NextResponse.json(admission);
  } catch (error: unknown) {
    console.error("Error fetching admission:", error);
    return NextResponse.json(
      { message: "Failed to fetch admission info", error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    console.log("Updating admission:", body);

    let admission = await Admission.findOne();
    
    if (!admission) {
      admission = await Admission.create(body);
    } else {
      admission = await Admission.findByIdAndUpdate(
        admission._id,
        body,
        { new: true, runValidators: true }
      );
    }

    return NextResponse.json(admission);
  } catch (error: unknown) {
    console.error("Error updating admission:", error);
    return NextResponse.json(
      { message: "Failed to update admission info", error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

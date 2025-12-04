import mongoose from "mongoose";

const AdmissionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      default: "Admission Information",
    },
    description: {
      type: String,
      required: true,
      default: "Join our institution and embark on a journey of excellence",
    },
    requirements: [
      {
        title: String,
        description: String,
        icon: String,
        order: Number,
      },
    ],
    documents: [
      {
        title: String,
        description: String,
        icon: String,
        order: Number,
      },
    ],
    admissionProcess: {
      type: String,
      default: "",
    },
    contactInfo: {
      phone: String,
      email: String,
      officeHours: String,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Admission ||
  mongoose.model("Admission", AdmissionSchema);

import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      default: "Contact Us",
    },
    description: {
      type: String,
      required: true,
      default: "We're here to help. Reach out to us anytime",
    },
    contactInfo: [
      {
        icon: String,
        title: String,
        details: [String],
        order: Number,
      },
    ],
    mapUrl: {
      type: String,
      default: "",
    },
    officeHours: {
      weekdays: String,
      weekdaysTime: String,
      weekends: String,
      weekendsTime: String,
      additionalInfo: String,
    },
    quickTips: [String],
  },
  { timestamps: true }
);

export default mongoose.models.Contact ||
  mongoose.model("Contact", ContactSchema);

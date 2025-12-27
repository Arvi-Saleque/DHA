import mongoose from "mongoose";

const ReviewSettingsSchema = new mongoose.Schema(
  {
    trustedByText: {
      type: String,
      required: true,
      default: "Trusted by",
    },
    familiesCount: {
      type: String,
      required: true,
      default: "500+ Families",
    },
    averageRatingText: {
      type: String,
      required: true,
      default: "Average Rating",
    },
    averageRatingValue: {
      type: String,
      required: true,
      default: "5.0/5.0",
    },
  },
  { timestamps: true }
);

export default mongoose.models.ReviewSettings ||
  mongoose.model("ReviewSettings", ReviewSettingsSchema);

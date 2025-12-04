import mongoose from "mongoose";

const HeaderSlideSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    primaryButton: {
      type: String,
      required: true,
    },
    secondaryButton: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      required: true,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.HeaderSlide ||
  mongoose.model("HeaderSlide", HeaderSlideSchema);

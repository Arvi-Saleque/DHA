import mongoose from "mongoose";

const HomePageSchema = new mongoose.Schema(
  {
    // Stats Section
    statsSection: [
      {
        value: String,
        label: String,
        order: Number,
      },
    ],
    // Excellence Section (Why Choose Us)
    excellenceSection: {
      badge: { type: String, default: "Why Choose Us" },
      title: { type: String, default: "Excellence in Education" },
      description: {
        type: String,
        default: "Committed to providing quality education with strong moral values",
      },
      features: [
        {
          icon: String,
          title: String,
          description: String,
          order: Number,
        },
      ],
    },
  },
  { timestamps: true }
);

export default mongoose.models.HomePage ||
  mongoose.model("HomePage", HomePageSchema);

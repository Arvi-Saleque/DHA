import mongoose from "mongoose";

const NewsEventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: String,
    category: {
      type: String,
      enum: ["news", "event", "achievement", "announcement"],
      default: "news",
    },
    date: {
      type: Date,
      default: Date.now,
    },
    time: String,
    excerpt: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate slug from title
NewsEventSchema.pre("save", function () {
  if (!this.slug || this.isModified("title")) {
    const timestamp = Date.now().toString(36);
    this.slug =
      this.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
        .substring(0, 50) +
      "-" +
      timestamp;
  }
});

export default mongoose.models.NewsEvent ||
  mongoose.model("NewsEvent", NewsEventSchema);

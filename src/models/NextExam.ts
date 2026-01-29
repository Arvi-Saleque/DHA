import mongoose from "mongoose";

const NextExamSchema = new mongoose.Schema(
  {
    className: {
      type: String,
      required: true,
    },
    examName: {
      type: String,
      required: true,
    },
    pdfUrl: {
      type: String,
      required: true,
    },
    totalPages: {
      type: Number,
      default: 15,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.NextExam || mongoose.model("NextExam", NextExamSchema);

import mongoose, { Schema, Document } from "mongoose";

export interface INextExam extends Document {
  date: Date;
  subject: string;
  time: string;
  duration: string;
  room: string;
  grade: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NextExamSchema: Schema = new Schema(
  {
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
    },
    time: {
      type: String,
      required: [true, "Time is required"],
      trim: true,
    },
    duration: {
      type: String,
      required: [true, "Duration is required"],
      trim: true,
    },
    room: {
      type: String,
      required: [true, "Room is required"],
      trim: true,
    },
    grade: {
      type: String,
      required: [true, "Grade is required"],
      trim: true,
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

export default mongoose.models.NextExam ||
  mongoose.model<INextExam>("NextExam", NextExamSchema);

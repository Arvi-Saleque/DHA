import mongoose from 'mongoose';

const todaysAbsenceSchema = new mongoose.Schema(
  {
    className: {
      type: String,
      required: true,
      enum: ['Play Group', 'Nursery', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7']
    },
    absenceName: {
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

const TodaysAbsence = mongoose.models.TodaysAbsence || mongoose.model('TodaysAbsence', todaysAbsenceSchema);

export default TodaysAbsence;

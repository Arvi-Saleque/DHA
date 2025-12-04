import mongoose from 'mongoose';

const AcademicCalendarSchema = new mongoose.Schema({
  month: {
    type: String,
    required: true,
  },
  pdfUrl: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.AcademicCalendar || mongoose.model('AcademicCalendar', AcademicCalendarSchema);

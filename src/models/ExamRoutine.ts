import mongoose from 'mongoose';

const ExamRoutineSchema = new mongoose.Schema({
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.ExamRoutine || mongoose.model('ExamRoutine', ExamRoutineSchema);

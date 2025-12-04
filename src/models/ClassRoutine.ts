import mongoose from 'mongoose';

const ClassRoutineSchema = new mongoose.Schema({
  className: {
    type: String,
    required: true,
  },
  routineName: {
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

export default mongoose.models.ClassRoutine || mongoose.model('ClassRoutine', ClassRoutineSchema);

import mongoose from 'mongoose';

const SyllabusSchema = new mongoose.Schema({
  className: {
    type: String,
    required: true,
  },
  subject: {
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

export default mongoose.models.Syllabus || mongoose.model('Syllabus', SyllabusSchema);

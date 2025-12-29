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
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Syllabus || mongoose.model('Syllabus', SyllabusSchema);

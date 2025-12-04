import mongoose from 'mongoose';

const CurriculumSchema = new mongoose.Schema({
  className: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  points: {
    type: [String],
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

export default mongoose.models.Curriculum || mongoose.model('Curriculum', CurriculumSchema);

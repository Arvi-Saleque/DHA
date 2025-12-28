import mongoose from 'mongoose';

const CurriculumSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['Pre Hifz', 'Hifz', 'Post Hifz'],
    unique: true,
  },
  pdfUrl: {
    type: String,
    required: true,
  },
  totalPages: {
    type: Number,
    default: 15,
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

export default mongoose.models.Curriculum || mongoose.model('Curriculum', CurriculumSchema);

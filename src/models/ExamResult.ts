import mongoose from 'mongoose';

const examResultSchema = new mongoose.Schema({
  className: {
    type: String,
    required: true,
    enum: ['Play Group', 'Nursery', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7']
  },
  examName: {
    type: String,
    required: true
  },
  pdfUrl: {
    type: String,
    required: true
  },
  totalPages: {
    type: Number,
    default: 15
  },
  passPercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.models.ExamResult || mongoose.model('ExamResult', examResultSchema);

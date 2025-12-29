import mongoose from 'mongoose';

const AdmissionFeeSchema = new mongoose.Schema({
  className: {
    type: String,
    required: true,
    enum: [
      'Play Group',
      'Nursery',
      'Class 1',
      'Class 2',
      'Class 3',
      'Class 4',
      'Class 5',
      'Class 6',
      'Class 7',
      'Class 8',
      'Class 9',
      'Class 10',
    ],
  },
  admissionFee: {
    type: Number,
    required: true,
  },
  tuitionFee: {
    type: Number,
    required: true,
  },
  dinningFee: {
    type: Number,
    required: true,
  },
  examFee: {
    type: Number,
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

export default mongoose.models.AdmissionFee || mongoose.model('AdmissionFee', AdmissionFeeSchema);

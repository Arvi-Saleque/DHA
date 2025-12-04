import mongoose from 'mongoose';

const AdmissionFeeSchema = new mongoose.Schema({
  className: {
    type: String,
    required: true,
  },
  admissionFee: {
    type: Number,
    required: true,
  },
  tuitionFee: {
    type: Number,
    required: true,
  },
  examFee: {
    type: Number,
    required: true,
  },
  otherFees: {
    type: Number,
    default: 0,
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

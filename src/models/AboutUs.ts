import mongoose from 'mongoose';

const coreValueSchema = new mongoose.Schema({
  icon: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
}, { _id: false });

const faqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  }
}, { _id: false });

const aboutUsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  establishedYear: {
    type: String,
    required: true
  },
  features: {
    type: [String],
    default: []
  },
  coreValues: {
    type: [coreValueSchema],
    default: []
  },
  faqs: {
    type: [faqSchema],
    default: []
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.models.AboutUs || mongoose.model('AboutUs', aboutUsSchema);

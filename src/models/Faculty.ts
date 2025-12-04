import mongoose from 'mongoose';

const teacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  qualification: {
    type: String,
    required: true,
  },
  experience: {
    type: String,
    required: true,
  },
  specialization: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: false,
  },
  phone: {
    type: String,
    required: false,
  },
  category: {
    type: String,
    required: true,
  },
  achievements: [{
    type: String,
  }],
  order: {
    type: Number,
    default: 0,
  },
});

// Schema for category tabs
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    default: 0,
  },
});

const facultySchema = new mongoose.Schema({
  pageTitle: {
    type: String,
    required: true,
    default: 'Our Distinguished Teachers',
  },
  pageSubtitle: {
    type: String,
    required: false,
    default: 'Learn from experienced scholars dedicated to your success',
  },
  sectionTitle: {
    type: String,
    required: true,
    default: 'Faculty Members',
  },
  sectionDescription: {
    type: String,
    required: false,
    default: 'Dedicated educators combining traditional scholarship with modern teaching methods',
  },
  categories: [categorySchema],
  teachers: [teacherSchema],
  quote: {
    type: String,
    required: false,
  },
  quoteAuthor: {
    type: String,
    required: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

const Faculty = mongoose.models.Faculty || mongoose.model('Faculty', facultySchema);

export default Faculty;

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/school-db';

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

const Syllabus = mongoose.models.Syllabus || mongoose.model('Syllabus', SyllabusSchema);

const syllabusData = [
  // Class 1
  { className: 'Class 1', subject: 'Quran', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
  { className: 'Class 1', subject: 'Mathematics', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
  { className: 'Class 1', subject: 'English', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
  { className: 'Class 1', subject: 'Urdu', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
  { className: 'Class 1', subject: 'Islamic Studies', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
  
  // Class 2
  { className: 'Class 2', subject: 'Quran', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
  { className: 'Class 2', subject: 'Mathematics', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
  { className: 'Class 2', subject: 'English', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
  { className: 'Class 2', subject: 'Urdu', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
  { className: 'Class 2', subject: 'Islamic Studies', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
  { className: 'Class 2', subject: 'Science', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
  
  // Class 3
  { className: 'Class 3', subject: 'Quran', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
  { className: 'Class 3', subject: 'Mathematics', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
  { className: 'Class 3', subject: 'English', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
  { className: 'Class 3', subject: 'Urdu', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
  { className: 'Class 3', subject: 'Islamic Studies', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
  { className: 'Class 3', subject: 'Science', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
  { className: 'Class 3', subject: 'Social Studies', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
  
  // Class 4
  { className: 'Class 4', subject: 'Quran', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
  { className: 'Class 4', subject: 'Mathematics', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
  { className: 'Class 4', subject: 'English', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
  { className: 'Class 4', subject: 'Urdu', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
  { className: 'Class 4', subject: 'Islamic Studies', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
  { className: 'Class 4', subject: 'Science', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
  { className: 'Class 4', subject: 'Social Studies', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
  { className: 'Class 4', subject: 'Computer', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
  
  // Class 5
  { className: 'Class 5', subject: 'Quran', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
  { className: 'Class 5', subject: 'Mathematics', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
  { className: 'Class 5', subject: 'English', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
  { className: 'Class 5', subject: 'Urdu', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
  { className: 'Class 5', subject: 'Islamic Studies', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
  { className: 'Class 5', subject: 'Science', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
  { className: 'Class 5', subject: 'Social Studies', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
  { className: 'Class 5', subject: 'Computer', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
  
  // Class 6
  { className: 'Class 6', subject: 'Quran', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
  { className: 'Class 6', subject: 'Mathematics', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
  { className: 'Class 6', subject: 'English', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
  { className: 'Class 6', subject: 'Urdu', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
  { className: 'Class 6', subject: 'Islamic Studies', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
  { className: 'Class 6', subject: 'Physics', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
  { className: 'Class 6', subject: 'Chemistry', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
  { className: 'Class 6', subject: 'Biology', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
  { className: 'Class 6', subject: 'Social Studies', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
  
  // Class 7
  { className: 'Class 7', subject: 'Quran', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
  { className: 'Class 7', subject: 'Mathematics', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
  { className: 'Class 7', subject: 'English', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
  { className: 'Class 7', subject: 'Urdu', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
  { className: 'Class 7', subject: 'Islamic Studies', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
  { className: 'Class 7', subject: 'Physics', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
  { className: 'Class 7', subject: 'Chemistry', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
  { className: 'Class 7', subject: 'Biology', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
  { className: 'Class 7', subject: 'Computer Science', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
  
  // Class 8
  { className: 'Class 8', subject: 'Quran', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
  { className: 'Class 8', subject: 'Mathematics', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
  { className: 'Class 8', subject: 'English', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
  { className: 'Class 8', subject: 'Urdu', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
  { className: 'Class 8', subject: 'Islamic Studies', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
  { className: 'Class 8', subject: 'Physics', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
  { className: 'Class 8', subject: 'Chemistry', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
  { className: 'Class 8', subject: 'Biology', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
  { className: 'Class 8', subject: 'Computer Science', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
];

async function populateSyllabus() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Syllabus.deleteMany({});
    console.log('Cleared existing syllabus data');

    // Insert new data
    const result = await Syllabus.insertMany(syllabusData);
    console.log(`Successfully added ${result.length} syllabus records`);

    console.log('\n✓ Syllabus data populated successfully!');
  } catch (error) {
    console.error('Error populating syllabus:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

populateSyllabus();

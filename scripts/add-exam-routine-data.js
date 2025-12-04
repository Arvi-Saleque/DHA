const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/school-db';

const ExamRoutineSchema = new mongoose.Schema({
  className: {
    type: String,
    required: true,
  },
  examName: {
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

const ExamRoutine = mongoose.models.ExamRoutine || mongoose.model('ExamRoutine', ExamRoutineSchema);

const examRoutineData = [
  // Class 1
  { className: 'Class 1', examName: 'First Terminal Exam 2025', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
  { className: 'Class 1', examName: 'Mid Year Exam 2025', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
  
  // Class 2
  { className: 'Class 2', examName: 'First Terminal Exam 2025', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
  { className: 'Class 2', examName: 'Mid Year Exam 2025', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
  
  // Class 3
  { className: 'Class 3', examName: 'First Terminal Exam 2025', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
  { className: 'Class 3', examName: 'Mid Year Exam 2025', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
  
  // Class 4
  { className: 'Class 4', examName: 'First Terminal Exam 2025', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
  { className: 'Class 4', examName: 'Mid Year Exam 2025', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
  
  // Class 5
  { className: 'Class 5', examName: 'First Terminal Exam 2025', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
  { className: 'Class 5', examName: 'Mid Year Exam 2025', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
  
  // Class 6
  { className: 'Class 6', examName: 'First Terminal Exam 2025', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
  { className: 'Class 6', examName: 'Mid Year Exam 2025', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
  
  // Class 7
  { className: 'Class 7', examName: 'First Terminal Exam 2025', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
  { className: 'Class 7', examName: 'Mid Year Exam 2025', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
  
  // Class 8
  { className: 'Class 8', examName: 'First Terminal Exam 2025', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
  { className: 'Class 8', examName: 'Mid Year Exam 2025', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
];

async function populateExamRoutine() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await ExamRoutine.deleteMany({});
    console.log('Cleared existing exam routine data');

    // Insert new data
    const result = await ExamRoutine.insertMany(examRoutineData);
    console.log(`Successfully added ${result.length} exam routine records`);

    console.log('\n✓ Exam routine data populated successfully!');
  } catch (error) {
    console.error('Error populating exam routine:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

populateExamRoutine();

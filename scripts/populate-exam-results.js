const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

const examResultSchema = new mongoose.Schema({
  className: { type: String, required: true },
  examName: { type: String, required: true },
  examType: { type: String, required: true },
  publishedDate: { type: Date, required: true },
  passPercentage: { type: Number, required: true },
  pdfUrl: { type: String, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const ExamResult = mongoose.models.ExamResult || mongoose.model('ExamResult', examResultSchema);

const examResults = [
  {
    className: 'Class 1',
    examName: 'First Term Examination 2024',
    examType: 'Terminal',
    publishedDate: new Date('2024-04-15'),
    passPercentage: 92,
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    isActive: true
  },
  {
    className: 'Class 2',
    examName: 'Mid Term Examination 2024',
    examType: 'Mid-Term',
    publishedDate: new Date('2024-06-20'),
    passPercentage: 88,
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    isActive: true
  },
  {
    className: 'Class 3',
    examName: 'Annual Examination 2024',
    examType: 'Annual',
    publishedDate: new Date('2024-12-10'),
    passPercentage: 95,
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    isActive: true
  },
  {
    className: 'Class 4',
    examName: 'First Term Examination 2024',
    examType: 'Terminal',
    publishedDate: new Date('2024-04-18'),
    passPercentage: 90,
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    isActive: true
  },
  {
    className: 'Class 5',
    examName: 'Second Term Examination 2024',
    examType: 'Terminal',
    publishedDate: new Date('2024-08-25'),
    passPercentage: 93,
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    isActive: true
  },
  {
    className: 'Class 6',
    examName: 'Mid Term Examination 2024',
    examType: 'Mid-Term',
    publishedDate: new Date('2024-07-05'),
    passPercentage: 87,
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    isActive: true
  },
  {
    className: 'Class 7',
    examName: 'Annual Examination 2024',
    examType: 'Annual',
    publishedDate: new Date('2024-12-15'),
    passPercentage: 91,
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    isActive: true
  },
  {
    className: 'Class 8',
    examName: 'First Term Examination 2024',
    examType: 'Terminal',
    publishedDate: new Date('2024-04-22'),
    passPercentage: 89,
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    isActive: true
  },
  {
    className: 'Class 9',
    examName: 'Second Term Examination 2024',
    examType: 'Terminal',
    publishedDate: new Date('2024-09-10'),
    passPercentage: 94,
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    isActive: true
  },
  {
    className: 'Class 10',
    examName: 'Pre-Board Examination 2024',
    examType: 'Annual',
    publishedDate: new Date('2024-11-20'),
    passPercentage: 96,
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    isActive: true
  }
];

async function populateExamResults() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    await ExamResult.deleteMany({});
    console.log('Cleared existing exam results');

    await ExamResult.insertMany(examResults);
    console.log(`Added ${examResults.length} exam results`);

    console.log('Exam results populated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error populating exam results:', error);
    process.exit(1);
  }
}

populateExamResults();

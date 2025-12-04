const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/school-db';

const ScholarshipSchema = new mongoose.Schema({
  className: { type: String, required: true },
  studentId: { type: String, required: true },
  studentName: { type: String, required: true },
  benefactorId: { type: String, required: true },
  benefactorName: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

const Scholarship = mongoose.models.Scholarship || mongoose.model('Scholarship', ScholarshipSchema);

const scholarshipData = [
  // Class 1
  { className: 'Class 1', studentId: 'STU-2025-101', studentName: 'Ahmed Ali', benefactorId: 'BEN-2025-001', benefactorName: 'Muhammad Hassan', amount: 15000, date: '2025-01-15', isActive: true },
  { className: 'Class 1', studentId: 'STU-2025-102', studentName: 'Fatima Zahra', benefactorId: 'BEN-2025-002', benefactorName: 'Abdul Rahman', amount: 12000, date: '2025-01-20', isActive: true },
  
  // Class 2
  { className: 'Class 2', studentId: 'STU-2025-201', studentName: 'Omar Farooq', benefactorId: 'BEN-2025-003', benefactorName: 'Khalid Ibrahim', amount: 18000, date: '2025-02-05', isActive: true },
  { className: 'Class 2', studentId: 'STU-2025-202', studentName: 'Aisha Khan', benefactorId: 'BEN-2025-004', benefactorName: 'Yusuf Ahmed', amount: 16000, date: '2025-02-10', isActive: true },
  
  // Class 3
  { className: 'Class 3', studentId: 'STU-2025-301', studentName: 'Hassan Malik', benefactorId: 'BEN-2025-005', benefactorName: 'Abdullah Siddiqui', amount: 20000, date: '2025-03-01', isActive: true },
  { className: 'Class 3', studentId: 'STU-2025-302', studentName: 'Maryam Noor', benefactorId: 'BEN-2025-001', benefactorName: 'Muhammad Hassan', amount: 17000, date: '2025-03-08', isActive: true },
  
  // Class 4
  { className: 'Class 4', studentId: 'STU-2025-401', studentName: 'Ibrahim Raza', benefactorId: 'BEN-2025-006', benefactorName: 'Usman Ali', amount: 22000, date: '2025-04-12', isActive: true },
  { className: 'Class 4', studentId: 'STU-2025-402', studentName: 'Zainab Hasan', benefactorId: 'BEN-2025-002', benefactorName: 'Abdul Rahman', amount: 19000, date: '2025-04-18', isActive: true },
  
  // Class 5
  { className: 'Class 5', studentId: 'STU-2025-501', studentName: 'Bilal Hussain', benefactorId: 'BEN-2025-007', benefactorName: 'Tariq Mahmood', amount: 25000, date: '2025-05-05', isActive: true },
  { className: 'Class 5', studentId: 'STU-2025-502', studentName: 'Khadija Bibi', benefactorId: 'BEN-2025-003', benefactorName: 'Khalid Ibrahim', amount: 23000, date: '2025-05-15', isActive: true },
  
  // Class 6
  { className: 'Class 6', studentId: 'STU-2025-601', studentName: 'Umar Abdullah', benefactorId: 'BEN-2025-008', benefactorName: 'Imran Shah', amount: 28000, date: '2025-06-02', isActive: true },
  { className: 'Class 6', studentId: 'STU-2025-602', studentName: 'Hafsa Tahir', benefactorId: 'BEN-2025-004', benefactorName: 'Yusuf Ahmed', amount: 26000, date: '2025-06-10', isActive: true },
  
  // Class 7
  { className: 'Class 7', studentId: 'STU-2025-701', studentName: 'Hamza Saeed', benefactorId: 'BEN-2025-005', benefactorName: 'Abdullah Siddiqui', amount: 30000, date: '2025-07-08', isActive: true },
  { className: 'Class 7', studentId: 'STU-2025-702', studentName: 'Amina Riaz', benefactorId: 'BEN-2025-009', benefactorName: 'Farhan Bashir', amount: 28000, date: '2025-07-20', isActive: true },
  
  // Class 8
  { className: 'Class 8', studentId: 'STU-2025-801', studentName: 'Sulaiman Iqbal', benefactorId: 'BEN-2025-006', benefactorName: 'Usman Ali', amount: 35000, date: '2025-08-05', isActive: true },
  { className: 'Class 8', studentId: 'STU-2025-802', studentName: 'Ruqayyah Malik', benefactorId: 'BEN-2025-007', benefactorName: 'Tariq Mahmood', amount: 32000, date: '2025-08-15', isActive: true },
];

async function populateScholarships() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Scholarship.deleteMany({});
    console.log('Cleared existing scholarship data');

    // Insert new data
    const result = await Scholarship.insertMany(scholarshipData);
    console.log(`Successfully added ${result.length} scholarship records`);

    console.log('\n✓ Scholarship data populated successfully!');
  } catch (error) {
    console.error('Error populating scholarships:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

populateScholarships();

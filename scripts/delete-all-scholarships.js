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

async function deleteAllScholarships() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const result = await Scholarship.deleteMany({});
    console.log(`Deleted ${result.deletedCount} scholarship records`);

    console.log('\n✓ All scholarship data deleted successfully!');
  } catch (error) {
    console.error('Error deleting scholarships:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

deleteAllScholarships();

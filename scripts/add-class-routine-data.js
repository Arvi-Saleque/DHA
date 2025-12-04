const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/school-db';

const ClassRoutineSchema = new mongoose.Schema({
  className: {
    type: String,
    required: true,
  },
  routineName: {
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

const ClassRoutine = mongoose.models.ClassRoutine || mongoose.model('ClassRoutine', ClassRoutineSchema);

const classRoutineData = [
  { className: 'Class 1', routineName: 'Weekly Class Routine', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
  { className: 'Class 2', routineName: 'Weekly Class Routine', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
  { className: 'Class 3', routineName: 'Weekly Class Routine', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
  { className: 'Class 4', routineName: 'Weekly Class Routine', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
  { className: 'Class 5', routineName: 'Weekly Class Routine', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
  { className: 'Class 6', routineName: 'Weekly Class Routine', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
  { className: 'Class 7', routineName: 'Weekly Class Routine', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
  { className: 'Class 8', routineName: 'Weekly Class Routine', pdfUrl: 'https://www.africau.edu/images/default/sample.pdf', isActive: true },
];

async function populateClassRoutine() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await ClassRoutine.deleteMany({});
    console.log('Cleared existing class routine data');

    // Insert new data
    const result = await ClassRoutine.insertMany(classRoutineData);
    console.log(`Successfully added ${result.length} class routine records`);

    console.log('\n✓ Class routine data populated successfully!');
  } catch (error) {
    console.error('Error populating class routine:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

populateClassRoutine();

/**
 * Script to delete all curriculum data
 * Run with: node scripts/delete-curriculum.js
 */

const mongoose = require('mongoose');

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'your_mongodb_uri_here';

async function deleteCurriculumData() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Delete all documents from curriculum collection
    const result = await mongoose.connection.db.collection('curriculums').deleteMany({});
    
    console.log(`✅ Successfully deleted ${result.deletedCount} curriculum documents`);

    await mongoose.connection.close();
    console.log('Connection closed');
  } catch (error) {
    console.error('❌ Error deleting curriculum data:', error);
    process.exit(1);
  }
}

deleteCurriculumData();

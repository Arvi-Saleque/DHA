require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

async function deleteTodaysAbsences() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully');

    // Drop the entire TodaysAbsence collection
    console.log('\nDropping TodaysAbsence collection...');
    await mongoose.connection.db.dropCollection('todaysabsences');
    console.log('✓ TodaysAbsence collection deleted successfully');

    console.log('\n✅ Database cleanup completed!');
  } catch (error) {
    if (error.message.includes('ns not found')) {
      console.log('Collection does not exist or already deleted');
    } else {
      console.error('Error:', error);
    }
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
}

deleteTodaysAbsences();

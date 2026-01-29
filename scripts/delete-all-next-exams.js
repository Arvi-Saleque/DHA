require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

// MongoDB Connection URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ Error: MONGODB_URI is not defined in .env.local file');
  console.log('\n💡 Please create a .env.local file with your MongoDB connection string:');
  console.log('   MONGODB_URI=your_mongodb_connection_string');
  process.exit(1);
}

async function deleteAllNextExams() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully!');

    // Delete all documents from nextexams collection
    const result = await mongoose.connection.db.collection('nextexams').deleteMany({});
    
    console.log(`✅ Successfully deleted ${result.deletedCount} exam routine(s) from the database`);
    
    console.log('\n📊 Database Status:');
    console.log('   - Collection: nextexams');
    console.log(`   - Deleted Records: ${result.deletedCount}`);
    console.log('   - New Schema Ready: className, examName, pdfUrl, totalPages');
    console.log('\n🎉 The next-exam feature has been reset and is ready to use with the new format!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

// Run the script
deleteAllNextExams();

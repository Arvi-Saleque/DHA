// Script to drop and recreate the gallery collection with new schema
// Run this once to remove location and description fields

const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/darul-hikmah';

async function dropGalleryCollection() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    
    // Drop the galleryimages collection
    await db.collection('galleryimages').drop();
    console.log('✓ Gallery collection dropped successfully');
    console.log('✓ New collection will be created automatically with updated schema');
    
  } catch (error) {
    if (error.message.includes('ns not found')) {
      console.log('Collection does not exist, nothing to drop');
    } else {
      console.error('Error:', error);
    }
  } finally {
    await client.close();
    console.log('Database connection closed');
  }
}

dropGalleryCollection();

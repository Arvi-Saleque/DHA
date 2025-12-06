import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const HomepageNewsSchema = new mongoose.Schema({
  newsEventIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'NewsEvent' }],
  maxItems: { type: Number, default: 3 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const HomepageGallerySchema = new mongoose.Schema({
  galleryImageIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'GalleryImage' }],
  maxItems: { type: Number, default: 6 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const NewsEventSchema = new mongoose.Schema({
  title: String,
  slug: String,
  excerpt: String,
  image: String,
  category: String,
  publishedAt: Date,
  isActive: Boolean
});

const GalleryImageSchema = new mongoose.Schema({
  title: String,
  image: String,
  category: String,
  order: Number,
  isActive: Boolean
});

const HomepageNews = mongoose.models.HomepageNews || mongoose.model('HomepageNews', HomepageNewsSchema);
const HomepageGallery = mongoose.models.HomepageGallery || mongoose.model('HomepageGallery', HomepageGallerySchema);
const NewsEvent = mongoose.models.NewsEvent || mongoose.model('NewsEvent', NewsEventSchema);
const GalleryImage = mongoose.models.GalleryImage || mongoose.model('GalleryImage', GalleryImageSchema);

async function setupHomepageSelections() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Setup News Selection
    console.log('\n--- Setting up News Selection ---');
    const latestNews = await NewsEvent.find({ isActive: true })
      .sort({ publishedAt: -1 })
      .limit(3);
    
    if (latestNews.length > 0) {
      const newsIds = latestNews.map(n => n._id);
      
      // Check if selection already exists
      const existingNewsSelection = await HomepageNews.findOne({ isActive: true });
      
      if (existingNewsSelection) {
        console.log('News selection already exists. Updating...');
        await HomepageNews.updateOne(
          { _id: existingNewsSelection._id },
          { newsEventIds: newsIds, maxItems: 3 }
        );
        console.log('Updated news selection with latest 3 news items');
      } else {
        console.log('Creating new news selection...');
        await HomepageNews.create({
          newsEventIds: newsIds,
          maxItems: 3,
          isActive: true
        });
        console.log('Created news selection with latest 3 news items');
      }
      
      console.log('Selected news:');
      latestNews.forEach((news, index) => {
        console.log(`  ${index + 1}. ${news.title}`);
      });
    } else {
      console.log('No news items found in database. Skipping news selection.');
    }

    // Setup Gallery Selection
    console.log('\n--- Setting up Gallery Selection ---');
    const latestImages = await GalleryImage.find({ isActive: true })
      .sort({ order: 1 })
      .limit(6);
    
    if (latestImages.length > 0) {
      const imageIds = latestImages.map(img => img._id);
      
      // Check if selection already exists
      const existingGallerySelection = await HomepageGallery.findOne({ isActive: true });
      
      if (existingGallerySelection) {
        console.log('Gallery selection already exists. Updating...');
        await HomepageGallery.updateOne(
          { _id: existingGallerySelection._id },
          { galleryImageIds: imageIds, maxItems: 6 }
        );
        console.log('Updated gallery selection with latest 6 images');
      } else {
        console.log('Creating new gallery selection...');
        await HomepageGallery.create({
          galleryImageIds: imageIds,
          maxItems: 6,
          isActive: true
        });
        console.log('Created gallery selection with latest 6 images');
      }
      
      console.log('Selected images:');
      latestImages.forEach((img, index) => {
        console.log(`  ${index + 1}. ${img.title} (${img.category})`);
      });
    } else {
      console.log('No gallery images found in database. Skipping gallery selection.');
    }

    console.log('\n✅ Setup complete!');
    console.log('\nYou can now:');
    console.log('1. Visit http://localhost:3001/ to see the homepage');
    console.log('2. Visit http://localhost:3001/admin/homepage-news to customize news selection');
    console.log('3. Visit http://localhost:3001/admin/homepage-gallery to customize gallery selection');
    
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  } catch (error) {
    console.error('Error setting up homepage selections:', error);
    process.exit(1);
  }
}

setupHomepageSelections();

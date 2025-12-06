import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const AboutUsSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  description: String,
  imageUrl: String,
  establishedYear: String,
  features: [String],
  coreValues: [{
    icon: String,
    title: String,
    description: String
  }],
  faqs: [{
    question: String,
    answer: String
  }],
  isActive: Boolean
}, { timestamps: true });

const AboutUs = mongoose.models.AboutUs || mongoose.model('AboutUs', AboutUsSchema);

const sampleData = {
  title: "Welcome to Darul Hikmah Academy",
  subtitle: "Established with a vision to provide quality education rooted in Islamic principles, we strive to develop well-rounded individuals who are prepared to excel in both their spiritual journey and worldly pursuits.",
  description: "Darul Hikmah Academy is a premier Islamic educational institution dedicated to nurturing young minds with a perfect blend of traditional Islamic values and modern academic excellence.",
  imageUrl: "/images/about-us.jpg",
  establishedYear: "2010",
  features: [
    "Islamic Education - Comprehensive Quran & Islamic studies",
    "Modern Curriculum - Updated syllabus with latest standards",
    "Expert Faculty - Qualified & experienced teachers",
    "Excellence Focus - Holistic development approach"
  ],
  coreValues: [
    {
      icon: "Target",
      title: "Our Mission",
      description: "To provide quality Islamic education that nurtures faith, knowledge, and character excellence in our students."
    },
    {
      icon: "Heart",
      title: "Our Vision",
      description: "To be a leading institution producing exemplary Muslims who contribute positively to society."
    },
    {
      icon: "Shield",
      title: "Our Values",
      description: "Faith, Excellence, Integrity, Compassion, and Continuous Learning form the foundation of our institution."
    }
  ],
  faqs: [],
  isActive: true
};

async function setupAboutUsData() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if data already exists
    const existingData = await AboutUs.findOne({ isActive: true });
    
    if (existingData) {
      console.log('About Us data already exists. Updating...');
      await AboutUs.updateOne({ _id: existingData._id }, sampleData);
      console.log('About Us data updated successfully!');
    } else {
      console.log('Creating new About Us data...');
      await AboutUs.create(sampleData);
      console.log('About Us data created successfully!');
    }

    console.log('\nYou can now:');
    console.log('1. Visit http://localhost:3001/ to see the homepage');
    console.log('2. Visit http://localhost:3001/admin/homepage-about to edit the content');
    
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  } catch (error) {
    console.error('Error setting up About Us data:', error);
    process.exit(1);
  }
}

setupAboutUsData();

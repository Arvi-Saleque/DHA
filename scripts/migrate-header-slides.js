const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/darul-hikmah';

async function migrateHeaderSlides() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db();
    const collection = db.collection('headerslides');

    // Drop the existing collection
    console.log('Dropping existing headerslides collection...');
    try {
      await collection.drop();
      console.log('✓ Collection dropped successfully');
    } catch (error) {
      console.log('Collection does not exist or already dropped');
    }

    // Create new collection with updated schema
    console.log('Creating new headerslides collection with URL fields...');
    
    const defaultSlides = [
      {
        image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2070",
        title: "Welcome to Our Madrasa",
        subtitle: "Building Knowledge, Nurturing Faith",
        description: "Excellence in Islamic education with modern teaching methods",
        primaryButton: "Enroll Now",
        primaryButtonUrl: "/admission",
        secondaryButton: "Learn More",
        secondaryButtonUrl: "/about",
        order: 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022",
        title: "Quality Islamic Education",
        subtitle: "Empowering Future Scholars",
        description: "Comprehensive curriculum combining traditional and contemporary learning",
        primaryButton: "View Programs",
        primaryButtonUrl: "/academic",
        secondaryButton: "Contact Us",
        secondaryButtonUrl: "/contact",
        order: 2,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2032",
        title: "Join Our Community",
        subtitle: "Where Learning Meets Purpose",
        description: "Experienced teachers dedicated to your child's spiritual and academic growth",
        primaryButton: "Get Started",
        primaryButtonUrl: "/admission",
        secondaryButton: "Our Faculty",
        secondaryButtonUrl: "/about/teachers",
        order: 3,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const result = await collection.insertMany(defaultSlides);
    console.log(`✓ Inserted ${result.insertedCount} default slides`);

    console.log('\nMigration completed successfully!');
    console.log('Header slides now include URL fields for both buttons.');
    
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

migrateHeaderSlides();

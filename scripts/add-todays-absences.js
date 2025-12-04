const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/school-db';

const todaysAbsenceSchema = new mongoose.Schema(
  {
    className: {
      type: String,
      required: true,
    },
    section: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const TodaysAbsence = mongoose.models.TodaysAbsence || mongoose.model('TodaysAbsence', todaysAbsenceSchema);

const absencesData = [
  {
    className: 'Class 1',
    section: 'A',
    title: 'Class 1 - Section A Absences',
    imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
    isActive: true,
  },
  {
    className: 'Class 1',
    section: 'B',
    title: 'Class 1 - Section B Absences',
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800',
    isActive: true,
  },
  {
    className: 'Class 2',
    section: 'A',
    title: 'Class 2 - Section A Absences',
    imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800',
    isActive: true,
  },
  {
    className: 'Class 2',
    section: 'B',
    title: 'Class 2 - Section B Absences',
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
    isActive: true,
  },
  {
    className: 'Class 3',
    section: 'A',
    title: 'Class 3 - Section A Absences',
    imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800',
    isActive: true,
  },
  {
    className: 'Class 3',
    section: 'B',
    title: 'Class 3 - Section B Absences',
    imageUrl: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=800',
    isActive: true,
  },
  {
    className: 'Class 4',
    section: 'A',
    title: 'Class 4 - Section A Absences',
    imageUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800',
    isActive: true,
  },
  {
    className: 'Class 4',
    section: 'B',
    title: 'Class 4 - Section B Absences',
    imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
    isActive: true,
  },
  {
    className: 'Class 5',
    section: 'A',
    title: 'Class 5 - Section A Absences',
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800',
    isActive: true,
  },
  {
    className: 'Class 5',
    section: 'B',
    title: 'Class 5 - Section B Absences',
    imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800',
    isActive: true,
  },
  {
    className: 'Class 6',
    section: 'A',
    title: 'Class 6 - Section A Absences',
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
    isActive: true,
  },
  {
    className: 'Class 6',
    section: 'B',
    title: 'Class 6 - Section B Absences',
    imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800',
    isActive: true,
  },
  {
    className: 'Class 7',
    section: 'A',
    title: 'Class 7 - Section A Absences',
    imageUrl: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=800',
    isActive: true,
  },
  {
    className: 'Class 7',
    section: 'B',
    title: 'Class 7 - Section B Absences',
    imageUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800',
    isActive: true,
  },
  {
    className: 'Class 8',
    section: 'A',
    title: 'Class 8 - Section A Absences',
    imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
    isActive: true,
  },
  {
    className: 'Class 8',
    section: 'B',
    title: 'Class 8 - Section B Absences',
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800',
    isActive: true,
  },
];

async function populateAbsences() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await TodaysAbsence.deleteMany({});
    console.log('Cleared existing absences');

    // Insert new data
    const result = await TodaysAbsence.insertMany(absencesData);
    console.log(`Successfully added ${result.length} absence records`);

    console.log('\n✓ Todays absences populated successfully!');
  } catch (error) {
    console.error('Error populating absences:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

populateAbsences();

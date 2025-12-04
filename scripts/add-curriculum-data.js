const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/school-db';

const CurriculumSchema = new mongoose.Schema({
  className: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  points: {
    type: [String],
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

const Curriculum = mongoose.models.Curriculum || mongoose.model('Curriculum', CurriculumSchema);

const curriculumData = [
  {
    className: 'Class 1',
    title: 'Class 1 Curriculum Overview',
    points: [
      'Introduction to Arabic alphabet and basic reading',
      'Quran memorization: Selected short Surahs',
      'Islamic studies: Basic beliefs and practices',
      'Mathematics: Numbers 1-100, basic addition and subtraction',
      'English: Letter recognition and simple words',
      'Urdu: Basic vocabulary and sentence formation'
    ],
    pdfUrl: 'https://www.africau.edu/images/default/sample.pdf',
    isActive: true,
  },
  {
    className: 'Class 2',
    title: 'Class 2 Curriculum Overview',
    points: [
      'Quranic reading with Tajweed basics',
      'Memorization: Juz Amma Surahs',
      'Islamic history: Stories of Prophets',
      'Mathematics: Multiplication tables and geometry basics',
      'English: Reading comprehension and grammar',
      'Science: Living and non-living things'
    ],
    pdfUrl: 'https://www.africau.edu/images/default/sample.pdf',
    isActive: true,
  },
  {
    className: 'Class 3',
    title: 'Class 3 Curriculum Overview',
    points: [
      'Quran: Complete reading with proper Tajweed',
      'Hadith studies: 40 Hadith for children',
      'Fiqh: Prayer, fasting, and cleanliness',
      'Mathematics: Division, fractions, and measurements',
      'English: Essay writing and creative composition',
      'Social Studies: Community and environment'
    ],
    pdfUrl: 'https://www.africau.edu/images/default/sample.pdf',
    isActive: true,
  },
  {
    className: 'Class 4',
    title: 'Class 4 Curriculum Overview',
    points: [
      'Quran: Translation and Tafsir basics',
      'Islamic jurisprudence: Detailed study of pillars',
      'Arabic grammar: Verb conjugations and sentence structure',
      'Mathematics: Advanced arithmetic and problem solving',
      'English: Literature and advanced grammar',
      'Computer Studies: Introduction to technology'
    ],
    pdfUrl: 'https://www.africau.edu/images/default/sample.pdf',
    isActive: true,
  },
  {
    className: 'Class 5',
    title: 'Class 5 Curriculum Overview',
    points: [
      'Quran: Memorization of selected Juz',
      'Hadith: Study of Sahih collections',
      'Islamic history: Seerah and Khulafa Rashideen',
      'Mathematics: Algebra and geometry',
      'Science: Physics, chemistry, and biology basics',
      'English: Advanced reading and writing skills'
    ],
    pdfUrl: 'https://www.africau.edu/images/default/sample.pdf',
    isActive: true,
  },
  {
    className: 'Class 6',
    title: 'Class 6 Curriculum Overview',
    points: [
      'Quran: Advanced Tajweed and recitation styles',
      'Aqeedah: Islamic beliefs and theology',
      'Fiqh: Comparative study of Islamic schools',
      'Mathematics: Trigonometry and statistics',
      'Science: Advanced topics in natural sciences',
      'Social Studies: Islamic civilization and history'
    ],
    pdfUrl: 'https://www.africau.edu/images/default/sample.pdf',
    isActive: true,
  },
  {
    className: 'Class 7',
    title: 'Class 7 Curriculum Overview',
    points: [
      'Quran: Tafsir study and interpretation methods',
      'Hadith: Classification and sciences of Hadith',
      'Arabic literature: Classical texts and poetry',
      'Mathematics: Advanced algebra and calculus basics',
      'Science: Physics, chemistry lab work',
      'English: Literary analysis and research skills'
    ],
    pdfUrl: 'https://www.africau.edu/images/default/sample.pdf',
    isActive: true,
  },
  {
    className: 'Class 8',
    title: 'Class 8 Curriculum Overview',
    points: [
      'Quran: Complete Tafsir methodology',
      'Islamic law: Usul al-Fiqh principles',
      'Arabic: Advanced grammar and composition',
      'Mathematics: Pre-calculus and statistics',
      'Science: Advanced biology and chemistry',
      'Research projects and thesis preparation'
    ],
    pdfUrl: 'https://www.africau.edu/images/default/sample.pdf',
    isActive: true,
  },
];

async function populateCurriculum() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Curriculum.deleteMany({});
    console.log('Cleared existing curriculum data');

    // Insert new data
    const result = await Curriculum.insertMany(curriculumData);
    console.log(`Successfully added ${result.length} curriculum records`);

    console.log('\n✓ Curriculum data populated successfully!');
  } catch (error) {
    console.error('Error populating curriculum:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

populateCurriculum();

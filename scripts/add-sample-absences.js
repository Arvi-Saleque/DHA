require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

const todaysAbsenceSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      index: true,
    },
    className: {
      type: String,
      required: true,
      index: true,
    },
    students: [
      {
        studentName: String,
        rollNumber: String,
      },
    ],
    totalAbsent: {
      type: Number,
      default: 0,
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

async function addSampleData() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully\n');

    // Sample absence data
    const sampleAbsences = [
      {
        date: new Date('2026-01-22'),
        className: 'Class 5',
        students: [
          { studentName: 'Ahmad Khan', rollNumber: '05' },
          { studentName: 'Fatima Rahman', rollNumber: '12' },
          { studentName: 'Hassan Ali', rollNumber: '18' },
          { studentName: 'Zainab Ahmed', rollNumber: '25' },
        ],
        totalAbsent: 4,
        isActive: true,
      },
      {
        date: new Date('2026-01-22'),
        className: 'Class 3',
        students: [
          { studentName: 'Aisha Begum', rollNumber: '03' },
          { studentName: 'Omar Farooq', rollNumber: '14' },
        ],
        totalAbsent: 2,
        isActive: true,
      },
      {
        date: new Date('2026-01-21'),
        className: 'Class 5',
        students: [
          { studentName: 'Sarah Ibrahim', rollNumber: '08' },
          { studentName: 'Yusuf Malik', rollNumber: '22' },
          { studentName: 'Mariam Hassan', rollNumber: '30' },
        ],
        totalAbsent: 3,
        isActive: true,
      },
      {
        date: new Date('2026-01-21'),
        className: 'Nursery',
        students: [
          { studentName: 'Ali Ahmed', rollNumber: '01' },
          { studentName: 'Khadija Noor', rollNumber: '09' },
          { studentName: 'Ibrahim Siddique', rollNumber: '15' },
          { studentName: 'Hiba Rahman', rollNumber: '21' },
          { studentName: 'Zayd Hussain', rollNumber: '28' },
        ],
        totalAbsent: 5,
        isActive: true,
      },
      {
        date: new Date('2026-01-20'),
        className: 'Class 8',
        students: [
          { studentName: 'Maryam Khan', rollNumber: '07' },
          { studentName: 'Abdullah Hasan', rollNumber: '19' },
        ],
        totalAbsent: 2,
        isActive: true,
      },
      {
        date: new Date('2026-01-20'),
        className: 'Class 1',
        students: [
          { studentName: 'Amina Begum', rollNumber: '04' },
          { studentName: 'Bilal Ahmed', rollNumber: '11' },
          { studentName: 'Sana Malik', rollNumber: '23' },
          { studentName: 'Tariq Rahman', rollNumber: '29' },
        ],
        totalAbsent: 4,
        isActive: true,
      },
      {
        date: new Date('2026-01-19'),
        className: 'Class 4',
        students: [
          { studentName: 'Hafsa Noor', rollNumber: '06' },
          { studentName: 'Hamza Ali', rollNumber: '13' },
          { studentName: 'Layla Hussein', rollNumber: '20' },
        ],
        totalAbsent: 3,
        isActive: true,
      },
      {
        date: new Date('2026-01-19'),
        className: 'Play Group',
        students: [
          { studentName: 'Noor Ahmed', rollNumber: '02' },
          { studentName: 'Rayyan Khan', rollNumber: '10' },
        ],
        totalAbsent: 2,
        isActive: true,
      },
    ];

    console.log('Deleting existing absence records...');
    await TodaysAbsence.deleteMany({});
    console.log('✓ Cleared existing data\n');

    console.log('Adding sample absence records...');
    for (const absence of sampleAbsences) {
      await TodaysAbsence.create(absence);
      console.log(`✓ Added absence for ${absence.className} on ${absence.date.toLocaleDateString('en-US')} (${absence.totalAbsent} students)`);
    }

    console.log('\n✅ Sample data added successfully!');
    console.log(`\nTotal records created: ${sampleAbsences.length}`);
    console.log('\nView at: http://192.168.10.220:3000/absences');
  } catch (error) {
    console.error('Error adding sample data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
}

addSampleData();

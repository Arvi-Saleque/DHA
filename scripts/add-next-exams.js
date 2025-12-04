const API_BASE_URL = 'http://localhost:3000';

const exams = [
  // Class 5 Exams
  {
    date: new Date('2025-12-15').toISOString(),
    subject: "Quran & Tajweed",
    time: "9:00 AM - 11:00 AM",
    duration: "2 hours",
    room: "Room 101",
    grade: "Class 5",
    isActive: true
  },
  {
    date: new Date('2025-12-16').toISOString(),
    subject: "Mathematics",
    time: "9:00 AM - 11:30 AM",
    duration: "2.5 hours",
    room: "Room 101",
    grade: "Class 5",
    isActive: true
  },
  {
    date: new Date('2025-12-18').toISOString(),
    subject: "English Language",
    time: "10:00 AM - 12:00 PM",
    duration: "2 hours",
    room: "Room 102",
    grade: "Class 5",
    isActive: true
  },
  // Class 6 Exams
  {
    date: new Date('2025-12-15').toISOString(),
    subject: "Arabic Grammar",
    time: "9:00 AM - 11:00 AM",
    duration: "2 hours",
    room: "Room 201",
    grade: "Class 6",
    isActive: true
  },
  {
    date: new Date('2025-12-17').toISOString(),
    subject: "Hadith Studies",
    time: "10:00 AM - 12:00 PM",
    duration: "2 hours",
    room: "Room 202",
    grade: "Class 6",
    isActive: true
  },
  {
    date: new Date('2025-12-19').toISOString(),
    subject: "Islamic History",
    time: "9:00 AM - 11:00 AM",
    duration: "2 hours",
    room: "Room 201",
    grade: "Class 6",
    isActive: true
  },
  {
    date: new Date('2025-12-20').toISOString(),
    subject: "Mathematics",
    time: "10:00 AM - 12:30 PM",
    duration: "2.5 hours",
    room: "Room 202",
    grade: "Class 6",
    isActive: true
  },
  // Class 7 Exams
  {
    date: new Date('2025-12-15').toISOString(),
    subject: "Fiqh",
    time: "9:00 AM - 11:30 AM",
    duration: "2.5 hours",
    room: "Room 301",
    grade: "Class 7",
    isActive: true
  },
  {
    date: new Date('2025-12-17').toISOString(),
    subject: "Aqeedah",
    time: "9:00 AM - 11:00 AM",
    duration: "2 hours",
    room: "Room 302",
    grade: "Class 7",
    isActive: true
  },
  {
    date: new Date('2025-12-19').toISOString(),
    subject: "Science",
    time: "10:00 AM - 12:00 PM",
    duration: "2 hours",
    room: "Room 301",
    grade: "Class 7",
    isActive: true
  },
  // Class 8 Exams
  {
    date: new Date('2025-12-16').toISOString(),
    subject: "Tafseer",
    time: "9:00 AM - 11:30 AM",
    duration: "2.5 hours",
    room: "Room 401",
    grade: "Class 8",
    isActive: true
  },
  {
    date: new Date('2025-12-18').toISOString(),
    subject: "Advanced Fiqh",
    time: "9:00 AM - 11:00 AM",
    duration: "2 hours",
    room: "Room 402",
    grade: "Class 8",
    isActive: true
  },
  {
    date: new Date('2025-12-20').toISOString(),
    subject: "Arabic Literature",
    time: "10:00 AM - 12:00 PM",
    duration: "2 hours",
    room: "Room 401",
    grade: "Class 8",
    isActive: true
  }
];

async function addNextExams() {
  try {
    console.log('Starting to add next exam schedules...\n');

    for (let i = 0; i < exams.length; i++) {
      const exam = exams[i];
      console.log(`Adding exam ${i + 1}/${exams.length}: ${exam.grade} - ${exam.subject}...`);
      
      const response = await fetch(`${API_BASE_URL}/api/next-exams`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(exam),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`✓ Successfully added: ${exam.grade} - ${exam.subject}`);
      } else {
        const error = await response.text();
        console.error(`✗ Failed to add ${exam.grade} - ${exam.subject}: ${error}`);
      }
    }

    console.log('\n✅ All next exam schedules have been added successfully!');
  } catch (error) {
    console.error('Error adding next exams:', error.message);
  }
}

addNextExams();

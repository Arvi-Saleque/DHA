const API_BASE_URL = 'http://localhost:3000';

const assignments = [
  {
    subject: "Quran & Tajweed",
    class: "Class 5",
    title: "Memorize Surah Al-Mulk (Verses 1-10)",
    description: "Memorize the first 10 verses of Surah Al-Mulk with proper tajweed rules. Practice pronunciation and recitation.",
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    teacherName: "Mufti Abdul Rahman",
    isActive: true
  },
  {
    subject: "Arabic Grammar",
    class: "Class 6",
    title: "Complete Nahw Exercises - Chapter 3",
    description: "Complete all exercises from Chapter 3 focusing on Fi'l (Verbs) and their conjugations. Write answers in Arabic.",
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    teacherName: "Sheikh Hassan Ali",
    isActive: true
  },
  {
    subject: "Islamic History",
    class: "Class 7",
    title: "Essay on the Battle of Badr",
    description: "Write a detailed essay (500 words) on the Battle of Badr covering its causes, events, and significance in Islamic history.",
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    teacherName: "Dr. Fatima Ahmed",
    isActive: true
  },
  {
    subject: "Fiqh",
    class: "Class 8",
    title: "Study Rulings on Salah",
    description: "Study and memorize the essential rulings (Ahkam) of Salah including conditions, pillars, and obligations. Prepare for oral test.",
    deadline: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    teacherName: "Maulana Ibrahim Khan",
    isActive: true
  },
  {
    subject: "Hadith Studies",
    class: "Class 6",
    title: "Memorize 10 Hadiths on Good Character",
    description: "Memorize 10 authentic hadiths about good character and manners from Sahih Bukhari. Write their meanings in English.",
    deadline: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
    teacherName: "Sheikh Abdullah Mahmud",
    isActive: true
  },
  {
    subject: "Mathematics",
    class: "Class 5",
    title: "Solve Algebra Problems - Set B",
    description: "Complete all problems from Algebra workbook Set B (pages 45-52). Show all working steps clearly.",
    deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    teacherName: "Ustadh Omar Hassan",
    isActive: true
  },
  {
    subject: "Aqeedah",
    class: "Class 7",
    title: "Research on the Six Pillars of Iman",
    description: "Prepare a presentation on the Six Pillars of Iman with detailed explanations and supporting verses from Quran.",
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    teacherName: "Mufti Yusuf Ibrahim",
    isActive: true
  },
  {
    subject: "Tafseer",
    class: "Class 8",
    title: "Study Tafseer of Surah Al-Kahf",
    description: "Read and summarize the tafseer of Surah Al-Kahf verses 1-20. Focus on lessons and wisdom derived from the story.",
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    teacherName: "Dr. Aisha Rahman",
    isActive: true
  },
  {
    subject: "English Language",
    class: "Class 6",
    title: "Write Essay on 'My Ideal Muslim Role Model'",
    description: "Write a 300-word essay describing your ideal Muslim role model and what makes them inspirational.",
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    teacherName: "Sister Khadija Ahmed",
    isActive: true
  },
  {
    subject: "Science",
    class: "Class 7",
    title: "Biology Lab Report - Plant Cell Structure",
    description: "Complete the lab report on plant cell structure observation. Include diagrams and detailed descriptions of organelles.",
    deadline: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    teacherName: "Ustadh Bilal Mahmood",
    isActive: true
  }
];

async function addAssignments() {
  try {
    console.log('Starting to add assignments...\n');

    for (let i = 0; i < assignments.length; i++) {
      const assignment = assignments[i];
      console.log(`Adding assignment ${i + 1}/${assignments.length}: ${assignment.title}...`);
      
      const response = await fetch(`${API_BASE_URL}/api/assignments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assignment),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`✓ Successfully added: ${assignment.title}`);
      } else {
        const error = await response.text();
        console.error(`✗ Failed to add ${assignment.title}: ${error}`);
      }
    }

    console.log('\n✅ All assignments have been added successfully!');
  } catch (error) {
    console.error('Error adding assignments:', error.message);
  }
}

addAssignments();

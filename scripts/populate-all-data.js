const baseUrl = 'http://localhost:3000';

// About Us Data
const aboutUsData = {
  title: "About DHA School",
  subtitle: "Excellence in Education Since 2009",
  description: "DHA School has been a beacon of quality education, dedicated to nurturing young minds and building character. Our institution stands committed to providing comprehensive education that balances academic excellence with moral and ethical development.",
  imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=80",
  establishedYear: "2009",
  features: [
    "Modern Teaching Facilities",
    "Experienced Faculty Members",
    "Comprehensive Curriculum",
    "Sports and Extra-curricular Activities",
    "Safe and Secure Environment",
    "Digital Learning Resources"
  ],
  coreValues: [
    {
      icon: "BookOpen",
      title: "Academic Excellence",
      description: "We maintain high academic standards and continuously strive for improvement in all areas of learning."
    },
    {
      icon: "Shield",
      title: "Integrity",
      description: "We uphold honesty, transparency, and ethical behavior in all our interactions and decisions."
    },
    {
      icon: "Heart",
      title: "Respect",
      description: "We foster an environment of mutual respect, embracing diversity and promoting inclusivity."
    },
    {
      icon: "Users",
      title: "Community",
      description: "We believe in building strong relationships with parents, students, and the wider community."
    }
  ],
  faqs: [
    {
      question: "What is the admission process?",
      answer: "The admission process includes filling an application form, submitting required documents, appearing for an entrance test, and interview. Admissions are based on merit and availability of seats."
    },
    {
      question: "What are the school timings?",
      answer: "School operates from Monday to Friday, 8:00 AM to 2:00 PM. Different grades may have slightly different timings which will be communicated separately."
    },
    {
      question: "Do you provide transportation?",
      answer: "Yes, we provide safe and reliable school bus service covering major areas of the city. Transport charges are separate and depend on the distance."
    },
    {
      question: "What extra-curricular activities are offered?",
      answer: "We offer a wide range of activities including sports, arts, music, debates, science clubs, and cultural programs throughout the year."
    }
  ]
};

// Mission Vision Data
const missionVisionData = {
  missionTitle: "Our Mission",
  missionDescription: "To provide high-quality education that empowers students with knowledge, skills, and values necessary for success in an ever-changing world. We strive to create a learning environment that encourages curiosity, critical thinking, and lifelong learning while instilling strong moral values and social responsibility.",
  missionImageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80",
  missionPoints: [
    {
      icon: "BookOpen",
      title: "Excellence in Teaching",
      description: "Deliver excellence in teaching and learning through innovative methods"
    },
    {
      icon: "Shield",
      title: "Safe Environment",
      description: "Foster a safe, inclusive, and supportive learning environment"
    },
    {
      icon: "Users",
      title: "Holistic Development",
      description: "Develop well-rounded individuals with strong academic and life skills"
    },
    {
      icon: "Heart",
      title: "Ethical Values",
      description: "Promote ethical values and social responsibility"
    },
    {
      icon: "Globe",
      title: "Community Involvement",
      description: "Encourage parent and community involvement in education"
    }
  ],
  visionTitle: "Our Vision",
  visionDescription: "To be recognized as a leading educational institution that shapes future leaders and responsible citizens. We envision a school where every student discovers their potential, pursues excellence, and develops the character needed to make a positive difference in the world.",
  visionImageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80",
  visionPoints: [
    {
      icon: "Award",
      title: "Educational Excellence",
      description: "Be the school of choice for quality education in the region"
    },
    {
      icon: "TrendingUp",
      title: "Graduate Success",
      description: "Produce graduates who excel academically and contribute to society"
    },
    {
      icon: "Building",
      title: "Modern Facilities",
      description: "Maintain state-of-the-art facilities and resources"
    },
    {
      icon: "Users",
      title: "Strong Community",
      description: "Build a strong community of students, teachers, and parents"
    },
    {
      icon: "Lightbulb",
      title: "Continuous Innovation",
      description: "Continuously innovate and improve our educational programs"
    }
  ],
  coreValues: [
    {
      name: "Academic Excellence",
      color: "blue"
    },
    {
      name: "Integrity",
      color: "green"
    },
    {
      name: "Respect",
      color: "purple"
    },
    {
      name: "Innovation",
      color: "orange"
    },
    {
      name: "Community",
      color: "cyan"
    },
    {
      name: "Responsibility",
      color: "indigo"
    }
  ]
};

// Committee Members Data
const committeeMembers = [
  {
    name: "Dr. Ahmed Hassan",
    position: "Chairman",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
    bio: "With over 25 years in education administration, Dr. Hassan leads our institution with vision and dedication.",
    order: 1,
    isActive: true
  },
  {
    name: "Prof. Sadia Rahman",
    position: "Principal",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
    bio: "A distinguished educator with expertise in curriculum development and student welfare.",
    order: 2,
    isActive: true
  },
  {
    name: "Mr. Khalid Mahmood",
    position: "Vice Principal",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80",
    bio: "Experienced administrator focused on academic excellence and discipline management.",
    order: 3,
    isActive: true
  },
  {
    name: "Mrs. Ayesha Khan",
    position: "Academic Coordinator",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80",
    bio: "Expert in educational planning and teacher training with 15 years of experience.",
    order: 4,
    isActive: true
  },
  {
    name: "Mr. Bilal Ahmed",
    position: "Administrative Officer",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80",
    bio: "Manages day-to-day operations and ensures smooth functioning of all administrative tasks.",
    order: 5,
    isActive: true
  }
];

// Faculty Data
const facultyData = {
  pageTitle: "Our Distinguished Teachers",
  pageSubtitle: "Learn from experienced educators dedicated to your success",
  sectionTitle: "Faculty Members",
  sectionDescription: "Dedicated teachers combining academic excellence with modern teaching methods",
  categories: [
    { name: "All", order: 1 },
    { name: "Senior Teachers", order: 2 },
    { name: "Junior Teachers", order: 3 },
    { name: "Support Staff", order: 4 }
  ],
  teachers: [
    {
      name: "Dr. Farah Naz",
      position: "Senior Teacher - Mathematics",
      qualification: "PhD in Mathematics",
      experience: "15 years",
      specialization: "Advanced Mathematics, Algebra",
      imageUrl: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&q=80",
      category: "Senior Teachers",
      achievements: ["Best Teacher Award 2023", "Published research papers"],
      order: 1
    },
    {
      name: "Prof. Imran Ali",
      position: "Senior Teacher - Science",
      qualification: "MSc Physics, B.Ed",
      experience: "12 years",
      specialization: "Physics, Chemistry",
      imageUrl: "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400&q=80",
      category: "Senior Teachers",
      achievements: ["Science Excellence Award"],
      order: 2
    },
    {
      name: "Ms. Zara Khan",
      position: "Teacher - English",
      qualification: "MA English Literature",
      experience: "10 years",
      specialization: "English Language, Literature",
      imageUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80",
      category: "Senior Teachers",
      achievements: [],
      order: 3
    },
    {
      name: "Mr. Hassan Raza",
      position: "Teacher - Computer Science",
      qualification: "BS Computer Science",
      experience: "8 years",
      specialization: "Programming, Web Development",
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
      category: "Junior Teachers",
      achievements: [],
      order: 4
    },
    {
      name: "Mrs. Nadia Malik",
      position: "Teacher - Urdu",
      qualification: "MA Urdu",
      experience: "14 years",
      specialization: "Urdu Language, Literature",
      imageUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&q=80",
      category: "Senior Teachers",
      achievements: [],
      order: 5
    },
    {
      name: "Mr. Tariq Jamil",
      position: "Teacher - Islamic Studies",
      qualification: "MA Islamic Studies",
      experience: "11 years",
      specialization: "Quran, Hadith, Islamic History",
      imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
      category: "Senior Teachers",
      achievements: [],
      order: 6
    }
  ],
  quote: "Education is the most powerful weapon which you can use to change the world.",
  quoteAuthor: "Nelson Mandela"
};

// News & Events Data
const newsEvents = [
  {
    title: "Annual Sports Day 2024",
    excerpt: "Our annual sports day showcased amazing talent and sportsmanship from all our students.",
    content: "The Annual Sports Day 2024 was a grand success with enthusiastic participation from students across all grades. The event featured various track and field events, team sports, and cultural performances. Parents and guests were treated to an exciting day of competition and celebration. Our students demonstrated exceptional sportsmanship and athletic prowess, making it a memorable event for everyone involved.",
    imageUrl: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80",
    category: "event",
    date: "2024-11-15",
    author: "Admin",
    tags: ["sports", "annual event", "students"]
  },
  {
    title: "Science Fair Winners Announced",
    excerpt: "Congratulations to all participants and winners of our annual science fair competition.",
    content: "The Science Fair 2024 concluded with remarkable projects from our talented students. The fair featured innovative experiments, working models, and research presentations covering various scientific disciplines. Winners were awarded certificates and prizes for their outstanding work. The event highlighted the scientific curiosity and creativity of our students, encouraging them to explore STEM fields further.",
    imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80",
    category: "news",
    date: "2024-11-10",
    author: "Admin",
    tags: ["science", "competition", "awards"]
  },
  {
    title: "Parent-Teacher Meeting",
    excerpt: "Join us for the upcoming parent-teacher meeting to discuss student progress and development.",
    content: "We invite all parents to attend the Parent-Teacher Meeting scheduled for December 2024. This is an excellent opportunity to meet with teachers, discuss your child's academic progress, and learn about upcoming activities. Individual consultation sessions will be arranged to provide detailed feedback on each student's performance. Your participation is crucial for your child's educational success.",
    imageUrl: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&q=80",
    category: "announcement",
    date: "2024-12-05",
    author: "Admin",
    tags: ["parents", "meeting", "academic"]
  },
  {
    title: "Admission Open for 2025",
    excerpt: "Admissions are now open for the academic year 2025. Limited seats available!",
    content: "DHA School is pleased to announce that admissions are now open for the academic year 2025. We are accepting applications for all grades from Nursery to Grade 10. Interested parents can collect admission forms from the school office or download them from our website. Early applications are encouraged as seats are limited. Join our family of excellence in education!",
    imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80",
    category: "announcement",
    date: "2024-12-01",
    author: "Admin",
    tags: ["admission", "enrollment", "2025"]
  }
];

// Gallery Data
const galleryImages = [
  {
    title: "School Building",
    description: "Our modern and spacious school building with state-of-the-art facilities",
    imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80",
    category: "infrastructure",
    location: "Main Campus",
    order: 1
  },
  {
    title: "Science Laboratory",
    description: "Well-equipped science lab for hands-on learning and experiments",
    imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80",
    category: "infrastructure",
    location: "Science Block",
    order: 2
  },
  {
    title: "Computer Lab",
    description: "Modern computer lab with latest technology and internet access",
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
    category: "infrastructure",
    location: "IT Block",
    order: 3
  },
  {
    title: "Annual Sports Day",
    description: "Students participating enthusiastically in sports activities",
    imageUrl: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80",
    category: "events",
    location: "Sports Ground",
    order: 4
  },
  {
    title: "Cultural Program",
    description: "Students showcasing their talents in cultural performances",
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
    category: "events",
    location: "Auditorium",
    order: 5
  },
  {
    title: "Classroom Learning",
    description: "Interactive classroom sessions with modern teaching aids",
    imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
    category: "activities",
    location: "Classroom",
    order: 6
  },
  {
    title: "Library",
    description: "Extensive library with thousands of books and digital resources",
    imageUrl: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&q=80",
    category: "infrastructure",
    location: "Library Block",
    order: 7
  },
  {
    title: "Sports Ground",
    description: "Spacious playground for various outdoor sports and activities",
    imageUrl: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800&q=80",
    category: "infrastructure",
    location: "Sports Complex",
    order: 8
  }
];

// Admission Data
const admissionData = {
  title: "Admission Information 2025",
  description: "Join DHA School and embark on a journey of academic excellence and personal growth",
  requirements: [
    {
      title: "Age Requirement",
      description: "Students must meet the age criteria as per education board guidelines for their respective class",
      icon: "Users",
      order: 1
    },
    {
      title: "Academic Records",
      description: "Previous academic transcripts and report cards are required for admission",
      icon: "FileText",
      order: 2
    },
    {
      title: "Entrance Test",
      description: "Students must appear for and pass the entrance examination",
      icon: "ClipboardList",
      order: 3
    },
    {
      title: "Interview",
      description: "Personal interview with student and parents is mandatory",
      icon: "MessageSquare",
      order: 4
    }
  ],
  documents: [
    {
      title: "Birth Certificate",
      description: "Original and photocopy of valid birth certificate",
      icon: "FileCheck",
      order: 1
    },
    {
      title: "Passport Photos",
      description: "4 recent passport-size color photographs",
      icon: "Image",
      order: 2
    },
    {
      title: "Previous Records",
      description: "Academic records and transfer certificate from previous institution",
      icon: "Award",
      order: 3
    },
    {
      title: "CNIC Copies",
      description: "Photocopies of parents/guardian CNIC",
      icon: "CreditCard",
      order: 4
    }
  ],
  admissionProcess: "Visit our school office to collect the admission form. Fill it completely and attach all required documents. Submit the form with application fee. Appear for the entrance test on the scheduled date. Wait for the admission confirmation and complete the fee payment process.",
  contactInfo: {
    phone: "+92-XXX-XXXXXXX",
    email: "admissions@dhaschool.edu.pk",
    officeHours: "Monday to Friday, 8:00 AM - 2:00 PM"
  }
};

// Contact Messages (for testing - will be sent via contact form)
const contactInfo = {
  address: "DHA School Campus, Defence Housing Authority, Lahore, Pakistan",
  phone: "+92-XXX-XXXXXXX",
  email: "info@dhaschool.edu.pk",
  workingHours: "Monday - Friday: 8:00 AM - 2:00 PM",
  socialMedia: {
    facebook: "https://facebook.com/dhaschool",
    twitter: "https://twitter.com/dhaschool",
    instagram: "https://instagram.com/dhaschool"
  }
};

async function populateAllData() {
  try {
    console.log('🚀 Starting comprehensive data population...\n');

    // 1. About Us
    console.log('📖 Populating About Us...');
    const aboutResponse = await fetch(`${baseUrl}/api/about-us`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(aboutUsData)
    });
    console.log(aboutResponse.ok ? '✅ About Us updated' : '❌ About Us failed');

    // 2. Mission Vision
    console.log('🎯 Populating Mission & Vision...');
    const missionResponse = await fetch(`${baseUrl}/api/mission-vision`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(missionVisionData)
    });
    if (missionResponse.ok) {
      console.log('✅ Mission & Vision updated');
    } else {
      const errorText = await missionResponse.text();
      console.log('❌ Mission & Vision failed:', errorText);
    }

    // 3. Committee Members
    console.log('👥 Populating Committee Members...');
    for (const member of committeeMembers) {
      const response = await fetch(`${baseUrl}/api/committee`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(member)
      });
      console.log(response.ok ? `✅ Added: ${member.name}` : `❌ Failed: ${member.name}`);
    }

    // 4. Faculty Members
    console.log('\n👨‍🏫 Populating Faculty...');
    const facultyResponse = await fetch(`${baseUrl}/api/faculty`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(facultyData)
    });
    console.log(facultyResponse.ok ? '✅ Faculty data updated' : '❌ Faculty failed');

    // 5. News & Events
    console.log('\n📰 Populating News & Events...');
    for (const item of newsEvents) {
      const response = await fetch(`${baseUrl}/api/news-events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      console.log(response.ok ? `✅ Added: ${item.title}` : `❌ Failed: ${item.title}`);
    }

    // 6. Gallery
    console.log('\n🖼️  Populating Gallery...');
    for (const image of galleryImages) {
      const response = await fetch(`${baseUrl}/api/gallery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(image)
      });
      console.log(response.ok ? `✅ Added: ${image.title}` : `❌ Failed: ${image.title}`);
    }

    // 7. Admission
    console.log('\n🎓 Populating Admission Info...');
    const admissionResponse = await fetch(`${baseUrl}/api/admission`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(admissionData)
    });
    console.log(admissionResponse.ok ? '✅ Admission info updated' : '❌ Admission failed');

    console.log('\n🎉 All data population completed!\n');
    console.log('📌 Homepage: http://localhost:3000');
    console.log('📌 About: http://localhost:3000/about');
    console.log('📌 News & Events: http://localhost:3000/news-events');
    console.log('📌 Contact: http://localhost:3000/contact');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

populateAllData();

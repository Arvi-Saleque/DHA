const baseUrl = 'http://localhost:3000';

// Homepage data
const homepageData = {
  statsSection: [
    { value: "500+", label: "Students Enrolled", order: 1 },
    { value: "50+", label: "Expert Teachers", order: 2 },
    { value: "15+", label: "Years of Excellence", order: 3 },
    { value: "95%", label: "Success Rate", order: 4 }
  ],
  excellenceSection: {
    badge: "Our Commitment",
    title: "Why Choose DHA School",
    description: "Dedicated to providing exceptional education with a focus on character building",
    features: [
      {
        icon: "Award",
        title: "Academic Excellence",
        description: "Consistently high performance in board examinations with individualized attention to each student",
        order: 1
      },
      {
        icon: "Users",
        title: "Qualified Staff",
        description: "Highly trained and experienced educators passionate about teaching and student development",
        order: 2
      },
      {
        icon: "BookOpen",
        title: "Modern Curriculum",
        description: "Up-to-date syllabus incorporating the latest educational methodologies and technologies",
        order: 3
      },
      {
        icon: "Heart",
        title: "Safe Environment",
        description: "Secure and nurturing campus with focus on student safety and well-being",
        order: 4
      },
      {
        icon: "Trophy",
        title: "Sports & Activities",
        description: "Well-equipped facilities for sports and extracurricular activities promoting overall development",
        order: 5
      },
      {
        icon: "Globe",
        title: "Global Perspective",
        description: "Exposure to international standards and practices preparing students for global opportunities",
        order: 6
      }
    ]
  }
};

// Header slider data
const headerSliders = [
  {
    title: "Welcome to DHA School",
    subtitle: "Empowering Young Minds for a Brighter Future",
    description: "Quality education with a focus on academic excellence and character development",
    primaryButton: "Explore Programs",
    secondaryButton: "About Us",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&q=80",
    order: 1,
    isActive: true
  },
  {
    title: "Excellence in Education",
    subtitle: "Building Tomorrow's Leaders Today",
    description: "Modern facilities and experienced faculty dedicated to student success",
    primaryButton: "View Programs",
    secondaryButton: "Contact Us",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1920&q=80",
    order: 2,
    isActive: true
  },
  {
    title: "Holistic Development",
    subtitle: "Academic Excellence Meets Character Building",
    description: "Nurturing students through comprehensive educational programs and activities",
    primaryButton: "Get Started",
    secondaryButton: "Our Facilities",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1920&q=80",
    order: 3,
    isActive: true
  }
];

// Reviews data
const reviews = [
  {
    name: "Fatima Ahmed",
    relation: "Mother of Grade 9 Student",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    rating: 5,
    review: "DHA School has been instrumental in my daughter's academic and personal growth. The teachers are caring, the curriculum is excellent, and the environment is very nurturing. I'm extremely satisfied with the quality of education provided.",
    order: 1,
    isActive: true
  },
  {
    name: "Abdul Rahman Khan",
    relation: "Father of Grade 7 Student",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    rating: 5,
    review: "The dedication of the staff at DHA School is remarkable. My son has shown tremendous improvement in his studies and confidence. The school provides an excellent balance of academics and extracurricular activities.",
    order: 2,
    isActive: true
  },
  {
    name: "Aisha Begum",
    relation: "Mother of Grade 10 Student",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
    rating: 5,
    review: "I am thoroughly impressed with the quality of education at DHA School. The teachers go above and beyond to ensure every child succeeds. My daughter loves going to school every day, which speaks volumes about the positive environment.",
    order: 3,
    isActive: true
  },
  {
    name: "Muhammad Hassan",
    relation: "Father of Grade 6 Student",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
    rating: 5,
    review: "DHA School offers excellent facilities and a strong academic program. The communication between teachers and parents is outstanding. I feel confident that my son is receiving the best education possible here.",
    order: 4,
    isActive: true
  },
  {
    name: "Zainab Ibrahim",
    relation: "Guardian of Grade 8 Student",
    image: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&q=80",
    rating: 5,
    review: "The values and ethics taught at DHA School along with quality education make it stand out. My niece has developed strong moral character alongside excellent academic performance. Highly recommended!",
    order: 5,
    isActive: true
  }
];

async function populateData() {
  try {
    console.log('🚀 Starting data population...\n');

    // 1. Populate Homepage Data
    console.log('📄 Populating Homepage Data...');
    const homepageResponse = await fetch(`${baseUrl}/api/homepage`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(homepageData)
    });
    if (homepageResponse.ok) {
      console.log('✅ Homepage data updated successfully\n');
    } else {
      console.log('❌ Failed to update homepage data\n');
    }

    // 2. Populate Header Sliders
    console.log('🖼️  Populating Header Sliders...');
    for (const slider of headerSliders) {
      const sliderResponse = await fetch(`${baseUrl}/api/header-slides`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slider)
      });
      if (sliderResponse.ok) {
        console.log(`✅ Added slider: ${slider.title}`);
      } else {
        console.log(`❌ Failed to add slider: ${slider.title}`);
      }
    }
    console.log('');

    // 3. Populate Reviews
    console.log('⭐ Populating Reviews...');
    for (const review of reviews) {
      const reviewResponse = await fetch(`${baseUrl}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(review)
      });
      if (reviewResponse.ok) {
        console.log(`✅ Added review from: ${review.name}`);
      } else {
        console.log(`❌ Failed to add review from: ${review.name}`);
      }
    }
    console.log('');

    console.log('🎉 Data population completed!\n');
    console.log('📌 You can now view the site at: http://localhost:3000');
    console.log('📌 Admin panel available at: http://localhost:3000/admin/homepage');
    
  } catch (error) {
    console.error('❌ Error populating data:', error.message);
  }
}

// Run the script
populateData();

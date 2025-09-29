import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.heroSection.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      titleLine1: 'Excellence in',
      titleLine2: 'Islamic Education',
      subtitle:
        'Nurturing young minds with traditional Islamic values and modern educational excellence. Join our community of learners dedicated to academic achievement and spiritual growth.',
      bgImageUrl:
        'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      cta1Text: 'Apply Now',
      cta1Href: '/admissions/apply',
      cta2Text: 'Learn More',
      cta2Href: '/about',
      features: [
        { title: 'Quality Education', description: 'Comprehensive Islamic curriculum with modern teaching methods' },
        { title: 'Expert Faculty', description: 'Experienced teachers dedicated to student success and character building' },
        { title: 'Modern Facilities', description: 'State-of-the-art campus with digital learning resources' },
      ],
    },
  });
}

main().finally(async () => {
  await prisma.$disconnect();
});

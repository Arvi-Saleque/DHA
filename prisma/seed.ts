import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Hash password
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@madrasa.edu' },
    update: {},
    create: {
      email: 'admin@madrasa.edu',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
      adminProfile: {
        create: {
          position: 'Principal',
          phone: '+880 1234-567890',
        },
      },
    },
  });

  console.log('Created admin:', admin);

  // Create Teacher
  const teacher = await prisma.user.upsert({
    where: { email: 'teacher@madrasa.edu' },
    update: {},
    create: {
      email: 'teacher@madrasa.edu',
      password: hashedPassword,
      name: 'Teacher User',
      role: 'TEACHER',
      teacherProfile: {
        create: {
          subject: 'Islamic Studies',
          qualification: 'M.A. in Islamic Studies',
          phone: '+880 1234-567891',
        },
      },
    },
  });

  console.log('Created teacher:', teacher);

  // Create Student
  const student = await prisma.user.upsert({
    where: { email: 'student@madrasa.edu' },
    update: {},
    create: {
      email: 'student@madrasa.edu',
      password: hashedPassword,
      name: 'Student User',
      role: 'STUDENT',
      studentProfile: {
        create: {
          rollNumber: 'STD001',
          class: '10',
          section: 'A',
          parentName: 'Parent Name',
          parentPhone: '+880 1234-567892',
        },
      },
    },
  });

  console.log('Created student:', student);

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

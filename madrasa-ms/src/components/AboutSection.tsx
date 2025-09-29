import { prisma } from '@/lib/db';
import { unstable_noStore as noStore } from 'next/cache';

type Statistic = { label: string; value: string; icon?: string };

export default async function AboutSection() {
  noStore(); // prevent caching

  const about = await prisma.aboutSection.findUnique({ where: { id: 1 } });

  const mission = about?.mission ?? 'Our mission is to provide exceptional Islamic education that nurtures both spiritual growth and academic excellence, preparing students to become responsible citizens and leaders in their communities.';
  const vision = about?.vision ?? 'To be a leading institution in Islamic education, recognized for our commitment to excellence, innovation, and the holistic development of our students.';
  const description = about?.description ?? 'Established with a vision to blend traditional Islamic teachings with modern educational methods, our madrasa has been serving the community for years. We pride ourselves on creating an environment where students can grow academically, spiritually, and socially.';
  const yearEstablished = about?.yearEstablished ?? '2010';
  const totalStudents = about?.totalStudents ?? '500+';
  const graduatedStudents = about?.graduatedStudents ?? '1200+';
  const qualifiedTeachers = about?.qualifiedTeachers ?? '25';

  const statistics: Statistic[] = [
    { label: 'Years of Excellence', value: `${new Date().getFullYear() - parseInt(yearEstablished)}+`, icon: 'calendar' },
    { label: 'Current Students', value: totalStudents, icon: 'students' },
    { label: 'Graduates', value: graduatedStudents, icon: 'graduation' },
    { label: 'Qualified Teachers', value: qualifiedTeachers, icon: 'teachers' }
  ];

  const getIcon = (iconType: string) => {
    const iconClasses = "w-8 h-8 text-blue-600";
    switch (iconType) {
      case 'calendar':
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'students':
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
        );
      case 'graduation':
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          </svg>
        );
      case 'teachers':
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      default:
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            About Our <span className="text-blue-600">Madrasa</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {description}
          </p>
        </div>

        {/* Statistics Section */}
        <div className="mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            {statistics.map((stat, index) => (
              <div key={index} className="text-center bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4">
                  {getIcon(stat.icon || '')}
                </div>
                <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
                <div className="text-sm md:text-base text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Mission & Vision Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Mission */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
            </div>
            <p className="text-gray-600 leading-relaxed text-lg">
              {mission}
            </p>
          </div>

          {/* Vision */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 text-white shadow-lg">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold">Our Vision</h3>
            </div>
            <p className="text-blue-100 leading-relaxed text-lg">
              {vision}
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Our Core <span className="text-blue-600">Values</span>
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The fundamental principles that guide our educational approach and community
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Excellence',
                description: 'Striving for the highest standards in Islamic education and character development',
                icon: (
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                )
              },
              {
                title: 'Compassion',
                description: 'Fostering empathy, kindness, and understanding in all our interactions',
                icon: (
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                )
              },
              {
                title: 'Integrity',
                description: 'Upholding honesty, transparency, and moral principles in all our endeavors',
                icon: (
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                )
              }
            ].map((value, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-6 group-hover:bg-blue-100 transition-colors duration-300">
                  {value.icon}
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-4">{value.title}</h4>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
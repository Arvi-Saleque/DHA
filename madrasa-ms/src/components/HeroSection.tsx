import Link from 'next/link';
import { prisma } from '@/lib/db';
import { unstable_noStore as noStore } from 'next/cache';

type Feature = { title: string; description: string; icon?: string };

export default async function HeroSection() {
  noStore(); // prevent caching

  const hero = await prisma.heroSection.findUnique({ where: { id: 1 } });

  const titleLine1 = hero?.titleLine1 ?? 'Excellence in';
  const titleLine2 = hero?.titleLine2 ?? 'Islamic Education';
  const subtitle =
    hero?.subtitle ??
    'Nurturing young minds with traditional Islamic values and modern educational excellence.';
  const bgImageUrl =
    hero?.bgImageUrl ??
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=2070&q=80';
  const cta1Text = hero?.cta1Text ?? 'Apply Now';
  const cta1Href = hero?.cta1Href ?? '/admissions/apply';
  const cta2Text = hero?.cta2Text ?? 'Learn More';
  const cta2Href = hero?.cta2Href ?? '/about';
  const features: Feature[] =
    (hero?.features as Feature[] | null) ?? [
      { title: 'Quality Education', description: 'Comprehensive Islamic curriculum with modern teaching methods' },
      { title: 'Expert Faculty', description: 'Experienced teachers dedicated to student success and character building' },
      { title: 'Modern Facilities', description: 'State-of-the-art campus with digital learning resources' },
    ];

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(30, 58, 138, 0.7), rgba(37, 99, 235, 0.6)), url('${bgImageUrl}')`,
          }}
        />
      </div>

      <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          <span className="block text-white drop-shadow-lg">{titleLine1}</span>
          <span className="block text-blue-200 drop-shadow-lg">{titleLine2}</span>
        </h1>

        <p className="text-lg sm:text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
          {subtitle}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href={cta1Href}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 min-w-[200px]"
          >
            {cta1Text}
          </Link>

          <Link
            href={cta2Href}
            className="border-2 border-white text-white hover:bg-white hover:text-blue-900 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 min-w-{200px}"
          >
            {cta2Text}
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {features.map((f, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
              <p className="text-blue-100">{f.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="animate-bounce">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
}

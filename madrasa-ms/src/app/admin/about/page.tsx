import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import DashboardLayout from '@/components/DashboardLayout';

export const dynamic = 'force-dynamic';

async function updateAbout(formData: FormData) {
  'use server';

  await prisma.aboutSection.upsert({
    where: { id: 1 },
    update: {
      mission: (formData.get('mission') as string) || '',
      vision: (formData.get('vision') as string) || '',
      description: (formData.get('description') as string) || '',
      yearEstablished: (formData.get('yearEstablished') as string) || '2010',
      totalStudents: (formData.get('totalStudents') as string) || '500+',
      graduatedStudents: (formData.get('graduatedStudents') as string) || '1200+',
      qualifiedTeachers: (formData.get('qualifiedTeachers') as string) || '25',
    },
    create: {
      id: 1,
      mission: (formData.get('mission') as string) || '',
      vision: (formData.get('vision') as string) || '',
      description: (formData.get('description') as string) || '',
      yearEstablished: (formData.get('yearEstablished') as string) || '2010',
      totalStudents: (formData.get('totalStudents') as string) || '500+',
      graduatedStudents: (formData.get('graduatedStudents') as string) || '1200+',
      qualifiedTeachers: (formData.get('qualifiedTeachers') as string) || '25',
    },
  });

  // Revalidate homepage and this page so changes show immediately
  revalidatePath('/');
  revalidatePath('/admin/about');
}

export default async function AboutManagementPage() {
  const about = await prisma.aboutSection.findUnique({ where: { id: 1 } });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">About Section Management</h2>
              <p className="text-green-100">
                Manage your institution's mission, vision, statistics, and organizational information.
              </p>
            </div>
            <div className="hidden lg:block">
              <svg className="w-16 h-16 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <form action={updateAbout} className="divide-y divide-gray-200">
            
            {/* Institution Description */}
            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Institution Description</h3>
                  <p className="text-sm text-gray-500">Main introduction that appears at the top of the about section</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  About Description
                </label>
                <textarea 
                  name="description" 
                  defaultValue={about?.description ?? 'Established with a vision to blend traditional Islamic teachings with modern educational methods, our madrasa has been serving the community for years. We pride ourselves on creating an environment where students can grow academically, spiritually, and socially.'} 
                  rows={4}
                  placeholder="Describe your institution's history, background, and general information..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 resize-none placeholder-black"
                />
                <p className="text-xs text-gray-500 mt-1">This text appears at the top of your About section (recommended: 2-4 sentences)</p>
              </div>
            </div>

            {/* Mission & Vision */}
            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Mission & Vision</h3>
                  <p className="text-sm text-gray-500">Define your institution's purpose and future goals</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mission Statement
                  </label>
                  <textarea 
                    name="mission" 
                    defaultValue={about?.mission ?? 'Our mission is to provide exceptional Islamic education that nurtures both spiritual growth and academic excellence, preparing students to become responsible citizens and leaders in their communities.'} 
                    rows={5}
                    placeholder="What is your institution's primary purpose and goals?"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 resize-none placeholder-black"
                  />
                  <p className="text-xs text-gray-500 mt-1">Describe what you aim to achieve (current purpose)</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vision Statement
                  </label>
                  <textarea 
                    name="vision" 
                    defaultValue={about?.vision ?? 'To be a leading institution in Islamic education, recognized for our commitment to excellence, innovation, and the holistic development of our students.'} 
                    rows={5}
                    placeholder="What do you aspire to become in the future?"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 resize-none placeholder-black"
                  />
                  <p className="text-xs text-gray-500 mt-1">Describe your future aspirations (long-term goals)</p>
                </div>
              </div>
            </div>

            {/* Statistics Section */}
            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Institution Statistics</h3>
                  <p className="text-sm text-gray-500">Key numbers that showcase your institution's achievements</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-2">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h4 className="font-medium text-gray-900">Established Year</h4>
                  </div>
                  <input 
                    name="yearEstablished" 
                    defaultValue={about?.yearEstablished ?? '2010'} 
                    placeholder="2010"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 placeholder-black"
                  />
                  <p className="text-xs text-gray-500 mt-1">Year when the institution was founded</p>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-2">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    </div>
                    <h4 className="font-medium text-gray-900">Current Students</h4>
                  </div>
                  <input 
                    name="totalStudents" 
                    defaultValue={about?.totalStudents ?? '500+'} 
                    placeholder="500+"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 placeholder-black"
                  />
                  <p className="text-xs text-gray-500 mt-1">Number of currently enrolled students</p>
                </div>

                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-2">
                      <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                      </svg>
                    </div>
                    <h4 className="font-medium text-gray-900">Graduates</h4>
                  </div>
                  <input 
                    name="graduatedStudents" 
                    defaultValue={about?.graduatedStudents ?? '1200+'} 
                    placeholder="1200+"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-200 placeholder-black"
                  />
                  <p className="text-xs text-gray-500 mt-1">Total number of students who have graduated</p>
                </div>

                <div className="bg-indigo-50 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-2">
                      <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h4 className="font-medium text-gray-900">Teachers</h4>
                  </div>
                  <input 
                    name="qualifiedTeachers" 
                    defaultValue={about?.qualifiedTeachers ?? '25'} 
                    placeholder="25"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 placeholder-black"
                  />
                  <p className="text-xs text-gray-500 mt-1">Number of qualified teaching staff</p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="p-6 bg-gray-50 rounded-b-xl">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Changes will be applied to your live website immediately after saving.
                </div>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Changes
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Preview Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
                <p className="text-sm text-gray-500">See how your changes will look on the website</p>
              </div>
            </div>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View Live Site
            </a>
          </div>
          <p className="text-gray-600">
            To see your About section changes, save the form above and then visit the homepage. 
            All changes are applied immediately to the about section below the hero area.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import DashboardLayout from '@/components/DashboardLayout';

export const dynamic = 'force-dynamic';

async function updateHero(formData: FormData) {
  'use server';

  const features = [
    { title: formData.get('f1_title') as string, description: formData.get('f1_desc') as string },
    { title: formData.get('f2_title') as string, description: formData.get('f2_desc') as string },
    { title: formData.get('f3_title') as string, description: formData.get('f3_desc') as string },
  ];

  await prisma.heroSection.upsert({
    where: { id: 1 },
    update: {
      titleLine1: (formData.get('titleLine1') as string) || '',
      titleLine2: (formData.get('titleLine2') as string) || '',
      subtitle: (formData.get('subtitle') as string) || '',
      bgImageUrl: (formData.get('bgImageUrl') as string) || '',
      cta1Text: (formData.get('cta1Text') as string) || '',
      cta1Href: (formData.get('cta1Href') as string) || '',
      cta2Text: (formData.get('cta2Text') as string) || '',
      cta2Href: (formData.get('cta2Href') as string) || '',
      features,
    },
    create: {
      id: 1,
      titleLine1: (formData.get('titleLine1') as string) || '',
      titleLine2: (formData.get('titleLine2') as string) || '',
      subtitle: (formData.get('subtitle') as string) || '',
      bgImageUrl: (formData.get('bgImageUrl') as string) || '',
      cta1Text: (formData.get('cta1Text') as string) || '',
      cta1Href: (formData.get('cta1Href') as string) || '',
      cta2Text: (formData.get('cta2Text') as string) || '',
      cta2Href: (formData.get('cta2Href') as string) || '',
      features,
    },
  });

  // Revalidate homepage (and this page) so changes show immediately
  revalidatePath('/');
  revalidatePath('/admin/content');
}

export default async function ContentPage() {
  const hero = await prisma.heroSection.findUnique({ where: { id: 1 } });
  const f = (hero?.features as any[]) ?? [
    { title: 'Quality Education', description: 'Comprehensive Islamic curriculum with modern teaching methods' },
    { title: 'Expert Faculty', description: 'Experienced teachers dedicated to student success and character building' },
    { title: 'Modern Facilities', description: 'State-of-the-art campus with digital learning resources' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Hero Section Management</h2>
              <p className="text-blue-100">
                Customize the main hero section that visitors see when they land on your homepage.
              </p>
            </div>
            <div className="hidden lg:block">
              <svg className="w-16 h-16 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <form action={updateHero} className="divide-y divide-gray-200">
            
            {/* Hero Title Section */}
            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Hero Title</h3>
                  <p className="text-sm text-gray-500">Main headline that grabs visitor attention</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title Line 1
                  </label>
                  <input 
                    name="titleLine1" 
                    defaultValue={hero?.titleLine1 ?? 'Excellence in'} 
                    placeholder="e.g., Excellence in"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 placeholder-black"
                  />
                  <p className="text-xs text-gray-500 mt-1">First part of the main title</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title Line 2
                  </label>
                  <input 
                    name="titleLine2" 
                    defaultValue={hero?.titleLine2 ?? 'Islamic Education'} 
                    placeholder="e.g., Islamic Education"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 placeholder-black"
                  />
                  <p className="text-xs text-gray-500 mt-1">Second part of the main title</p>
                </div>
              </div>
            </div>

            {/* Hero Subtitle Section */}
            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Hero Subtitle</h3>
                  <p className="text-sm text-gray-500">Supporting text that explains your mission</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subtitle Text
                </label>
                <textarea 
                  name="subtitle" 
                  defaultValue={hero?.subtitle ?? 'Nurturing young minds with traditional Islamic values and modern educational excellence. Join our community of learners dedicated to academic achievement and spiritual growth.'} 
                  rows={4}
                  placeholder="Describe your institution's mission and values..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-none placeholder-black"
                />
                <p className="text-xs text-gray-500 mt-1">Keep it concise but compelling (recommended: 2-3 sentences)</p>
              </div>
            </div>

            {/* Background Image Section */}
            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Background Image</h3>
                  <p className="text-sm text-gray-500">Hero section background image URL</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL
                </label>
                <input 
                  name="bgImageUrl" 
                  defaultValue={hero?.bgImageUrl ?? 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'} 
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 placeholder-black"
                />
                <p className="text-xs text-gray-500 mt-1">Use high-quality images (recommended: 1920x1080px or larger)</p>
              </div>
            </div>

            {/* Call-to-Action Buttons */}
            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Call-to-Action Buttons</h3>
                  <p className="text-sm text-gray-500">Primary and secondary action buttons</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-700">Primary Button</h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Button Text
                    </label>
                    <input 
                      name="cta1Text" 
                      defaultValue={hero?.cta1Text ?? 'Apply Now'} 
                      placeholder="e.g., Apply Now"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 placeholder-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Button Link
                    </label>
                    <input 
                      name="cta1Href" 
                      defaultValue={hero?.cta1Href ?? '/admissions/apply'} 
                      placeholder="/admissions/apply"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 placeholder-black"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-700">Secondary Button</h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Button Text
                    </label>
                    <input 
                      name="cta2Text" 
                      defaultValue={hero?.cta2Text ?? 'Learn More'} 
                      placeholder="e.g., Learn More"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 placeholder-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Button Link
                    </label>
                    <input 
                      name="cta2Href" 
                      defaultValue={hero?.cta2Href ?? '/about'} 
                      placeholder="/about"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 placeholder-black"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Cards Section */}
            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Feature Highlights</h3>
                  <p className="text-sm text-gray-500">Three key features displayed below the hero content</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center mb-3">
                      <span className="w-6 h-6 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center mr-2">
                        {i + 1}
                      </span>
                      <h4 className="font-medium text-gray-900">Feature {i + 1}</h4>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Title
                        </label>
                        <input
                          name={`f${i + 1}_title`}
                          defaultValue={f[i]?.title ?? ''}
                          placeholder="Feature title"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white placeholder-black"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          name={`f${i + 1}_desc`}
                          defaultValue={f[i]?.description ?? ''}
                          placeholder="Brief description"
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-none bg-white placeholder-black"
                        />
                      </div>
                    </div>
                  </div>
                ))}
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
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg flex items-center"
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
            To see your changes, save the form above and then visit the homepage. 
            All changes are applied immediately to ensure you can see the results right away.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
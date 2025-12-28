"use client";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

interface MobilePDFViewerProps {
  pdfUrl: string;
  totalPages?: number;
}

export default function MobilePDFViewer({ pdfUrl, totalPages = 15 }: MobilePDFViewerProps) {
  // Extract the Public ID from Cloudinary URL
  const getPublicId = (url: string) => {
    if (!url) return null;
    const parts = url.split('/upload/');
    if (parts.length < 2) return null;
    
    // Get everything after "upload/"
    let path = parts[1]; 
    // Remove version number (e.g., v17668...) if present
    path = path.replace(/v\d+\//, ''); 
    // Remove extension (.pdf)
    path = path.replace('.pdf', ''); 
    
    return path;
  };

  const publicId = getPublicId(pdfUrl);
  const cloudName = "dr3thd67a"; // Your cloud name

  if (!publicId) {
    return (
      <div className="text-center p-10 bg-slate-100 dark:bg-slate-900 rounded-lg">
        <p className="text-slate-600 dark:text-slate-400">Invalid PDF URL</p>
      </div>
    );
  }

  // Generate pages array
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="w-full min-h-screen flex flex-col">
      <div className="flex-1 bg-white dark:bg-slate-800 shadow-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
        <Swiper
          modules={[Pagination, Navigation]}
          spaceBetween={0}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          className="h-[calc(100vh-8rem)] w-full"
        >
          {pages.map((page) => (
            <SwiperSlide key={page} className="bg-gray-100 dark:bg-slate-900 flex items-center justify-center">
              {/* Cloudinary URL magic: Converts PDF page -> High-quality image */}
              <img 
                src={`https://res.cloudinary.com/${cloudName}/image/upload/w_1600,q_auto:best,f_auto/pg_${page}/${publicId}.jpg`}
                alt={`Page ${page}`}
                className="w-full h-full object-contain"
                loading={page <= 2 ? "eager" : "lazy"}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="bg-white dark:bg-slate-800 py-4 border-t border-gray-200 dark:border-slate-700">
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          Swipe to turn pages • {totalPages} pages total
        </p>
      </div>
    </div>
  );
}

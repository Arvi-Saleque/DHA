"use client";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Zoom } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/zoom';

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
    <div className="w-full h-screen flex flex-col bg-gray-100 dark:bg-slate-900">
      <style jsx global>{`
        @media (max-width: 768px) {
          .swiper-button-next,
          .swiper-button-prev {
            width: 30px !important;
            height: 30px !important;
          }
          .swiper-button-next:after,
          .swiper-button-prev:after {
            font-size: 16px !important;
          }
        }
      `}</style>
      <div className="flex-1 overflow-hidden">
        <Swiper
          modules={[Pagination, Navigation, Zoom]}
          spaceBetween={0}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          zoom={{
            maxRatio: 3,
            minRatio: 1,
          }}
          className="h-full w-full"
        >
          {pages.map((page) => (
            <SwiperSlide key={page} className="flex items-center justify-center p-0">
              <div className="swiper-zoom-container w-full h-full">
                <img 
                  src={`https://res.cloudinary.com/${cloudName}/image/upload/w_2400,q_auto:best,f_auto,dpr_2.0/pg_${page}/${publicId}.jpg`}
                  alt={`Page ${page}`}
                  className="w-full h-full object-contain max-w-none"
                  style={{ objectFit: 'contain', width: '100%', height: '100%' }}
                  loading={page <= 2 ? "eager" : "lazy"}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

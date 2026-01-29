"use client";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Zoom } from 'swiper/modules';
import { useState } from 'react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/zoom';

interface MobilePDFViewerProps {
  pdfUrl: string;
  totalPages?: number;
}

export default function MobilePDFViewer({ pdfUrl, totalPages = 15 }: MobilePDFViewerProps) {
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  // Extract the Public ID from Cloudinary URL
  const getPublicId = (url: string) => {
    if (!url) return null;
    
    // Handle different Cloudinary URL formats
    const parts = url.split('/upload/');
    if (parts.length < 2) return null;
    
    // Get everything after "upload/"
    let path = parts[1]; 
    // Remove version number (e.g., v17668...) if present
    path = path.replace(/v\d+\//, ''); 
    // Remove extension (.pdf)
    path = path.replace(/\.pdf$/i, ''); 
    
    return path;
  };

  const publicId = getPublicId(pdfUrl);
  const cloudName = "dr3thd67a"; // Your cloud name

  if (!publicId) {
    return (
      <div className="text-center p-10 bg-slate-100 dark:bg-slate-900 rounded-lg">
        <p className="text-slate-600 dark:text-slate-400">Invalid PDF URL</p>
        <p className="text-xs text-slate-400 mt-2">URL: {pdfUrl}</p>
      </div>
    );
  }

  // Generate pages array
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Generate image URL for a specific page
  const getPageImageUrl = (page: number) => {
    // Cloudinary PDF to image transformation
    return `https://res.cloudinary.com/${cloudName}/image/upload/pg_${page}/${publicId}.jpg`;
  };

  const handleImageError = (page: number) => {
    setImageErrors(prev => new Set(prev).add(page));
  };

  return (
    <div className="w-full min-h-[500px] md:min-h-[700px] flex flex-col bg-slate-100">
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
        .swiper-pagination {
          bottom: 10px !important;
          padding: 0 !important;
          margin: 0 !important;
        }
        .swiper-pagination-bullet {
          margin: 0 4px !important;
        }
        .swiper-button-next,
        .swiper-button-prev {
          color: #0891b2 !important;
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
            <SwiperSlide key={page} className="!p-0 !m-0">
              <div className="swiper-zoom-container w-full h-full flex items-center justify-center bg-slate-100 p-4">
                {imageErrors.has(page) ? (
                  <div className="text-center text-slate-500">
                    <p>Page {page} could not be loaded</p>
                  </div>
                ) : (
                  <img 
                    src={getPageImageUrl(page)}
                    alt={`Page ${page}`}
                    className="max-w-full max-h-full object-contain shadow-lg"
                    loading={page <= 2 ? "eager" : "lazy"}
                    onError={() => handleImageError(page)}
                  />
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

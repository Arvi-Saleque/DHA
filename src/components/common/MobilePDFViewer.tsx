"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface MobilePDFViewerProps {
  pdfUrl: string;
}

export default function MobilePDFViewer({ pdfUrl }: MobilePDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [isClient, setIsClient] = useState(false);
  const [Document, setDocument] = useState<any>(null);
  const [Page, setPage] = useState<any>(null);
  const [scale, setScale] = useState<number>(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<number>(0);

  useEffect(() => {
    setIsClient(true);
    
    // Dynamically import react-pdf only on client side
    const loadPdfComponents = async () => {
      try {
        const pdfjs = await import('react-pdf');
        const pdfjsDist = await import('pdfjs-dist');
        
        // Configure worker
        pdfjs.pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.pdfjs.version}/build/pdf.worker.min.mjs`;
        
        setDocument(() => pdfjs.Document);
        setPage(() => pdfjs.Page);
      } catch (error) {
        console.error('Error loading PDF components:', error);
      }
    };

    loadPdfComponents();
  }, []);

  // Handle pinch-to-zoom
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let initialDistance = 0;
    let initialScale = scale;

    const getDistance = (touches: TouchList) => {
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        initialDistance = getDistance(e.touches);
        initialScale = scale;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const currentDistance = getDistance(e.touches);
        const newScale = initialScale * (currentDistance / initialDistance);
        setScale(Math.min(Math.max(newScale, 0.5), 3));
      }
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
    };
  }, [scale]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const goToPrevPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber((prev) => Math.min(prev + 1, numPages));
  };

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.25, 3));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.25, 0.5));
  };

  const resetZoom = () => {
    setScale(1);
  };

  if (!isClient || !Document || !Page) {
    return (
      <div className="flex items-center justify-center py-20 bg-slate-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  return (
    <div className="relative bg-slate-100">
      {/* Zoom Controls */}
      <div className="sticky top-0 z-10 bg-slate-800 text-white px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            onClick={zoomOut}
            disabled={scale <= 0.5}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-slate-700 disabled:opacity-50"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-xs font-mono">{Math.round(scale * 100)}%</span>
          <Button
            onClick={zoomIn}
            disabled={scale >= 3}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-slate-700 disabled:opacity-50"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>
        <Button
          onClick={resetZoom}
          variant="ghost"
          size="sm"
          className="text-white hover:bg-slate-700"
        >
          <Maximize2 className="w-4 h-4 mr-1" />
          Reset
        </Button>
      </div>

      <div 
        ref={containerRef}
        className="w-full overflow-auto touch-pan-x touch-pan-y"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
            </div>
          }
          error={
            <div className="text-center py-20">
              <FileText className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600">Failed to load PDF</p>
            </div>
          }
        >
          <Page
            pageNumber={pageNumber}
            width={(window.innerWidth - 32) * scale}
            scale={scale}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        </Document>
      </div>

      {/* Page Navigation */}
      {numPages > 1 && (
        <div className="sticky bottom-0 bg-slate-800 text-white px-4 py-3 flex items-center justify-between">
          <Button
            onClick={goToPrevPage}
            disabled={pageNumber <= 1}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-slate-700 disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <span className="text-sm">
            Page {pageNumber} of {numPages}
          </span>
          <Button
            onClick={goToNextPage}
            disabled={pageNumber >= numPages}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-slate-700 disabled:opacity-50"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      )}
    </div>
  );
}

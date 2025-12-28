"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, ChevronLeft, ChevronRight } from 'lucide-react';

interface MobilePDFViewerProps {
  pdfUrl: string;
}

export default function MobilePDFViewer({ pdfUrl }: MobilePDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [isClient, setIsClient] = useState(false);
  const [Document, setDocument] = useState<any>(null);
  const [Page, setPage] = useState<any>(null);

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

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const goToPrevPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber((prev) => Math.min(prev + 1, numPages));
  };

  if (!isClient || !Document || !Page) {
    return (
      <div className="flex items-center justify-center py-20 bg-slate-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-slate-100">
      <div className="w-full max-w-full overflow-x-auto">
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
            width={window.innerWidth - 32}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        </Document>
      </div>

      {/* Page Navigation */}
      {numPages > 1 && (
        <div className="bg-slate-800 text-white px-4 py-3 flex items-center justify-between">
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

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  CalendarDays,
} from "lucide-react";
import MobilePDFViewer from "@/components/common/MobilePDFViewer";

interface AcademicCalendar {
  _id: string;
  month: string;
  pdfUrl: string;
  totalPages?: number;
  isActive: boolean;
}

export default function CalendarPage() {
  const [calendar, setCalendar] = useState<AcademicCalendar | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCalendar();
  }, []);

  const fetchCalendar = async () => {
    try {
      const response = await fetch('/api/academic-calendar');
      const data = await response.json();
      if (data.length > 0) {
        setCalendar(data[0]); // Get first calendar only
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching calendar:', error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-cyan-600 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>

        <div className="relative container mx-auto px-4 py-6 sm:py-8">
          <Link href="/">
            <Button
              variant="ghost"
              className="text-white hover:bg-white/20 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>

          <div className="flex items-center gap-3 text-white">
            <CalendarDays className="w-8 h-8 sm:w-10 sm:h-10" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
              Academic Calendar
            </h1>
          </div>
        </div>
      </section>

      {/* PDF Viewer Section */}
      <section className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
            <p className="text-slate-600 mt-4">Loading calendar...</p>
          </div>
        ) : calendar ? (
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <MobilePDFViewer
              pdfUrl={calendar.pdfUrl}
              totalPages={calendar.totalPages || 15}
            />
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-xl">
            <CalendarDays className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No Calendar Available</h3>
            <p className="text-slate-600">
              Academic calendar will be posted here when available.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

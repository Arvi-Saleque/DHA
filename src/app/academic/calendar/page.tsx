"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar as CalendarIcon,
  Download,
  Eye,
  ArrowLeft,
  FileText,
  Clock,
  AlertCircle,
} from "lucide-react";

interface AcademicCalendar {
  _id: string;
  month: string;
  pdfUrl: string;
  isActive: boolean;
}

// Convert Google Drive link to embed URL
const convertGoogleDriveUrl = (url: string): string => {
  const match = url.match(/\/file\/d\/([^\/]+)/);
  if (match && match[1]) {
    return `https://drive.google.com/file/d/${match[1]}/preview`;
  }
  return url;
};

export default function CalendarPage() {
  const [calendars, setCalendars] = useState<AcademicCalendar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCalendars();
  }, []);

  const fetchCalendars = async () => {
    try {
      const response = await fetch('/api/academic-calendar');
      const data = await response.json();
      // Get only the first calendar
      setCalendars(data.length > 0 ? [data[0]] : []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching calendars:', error);
      setLoading(false);
    }
  };

  const handleViewDetails = (pdfUrl: string) => {
    const match = pdfUrl.match(/\/file\/d\/([^\/]+)/);
    if (match && match[1]) {
      window.open(`https://drive.google.com/file/d/${match[1]}/view`, '_blank');
    }
  };

  const handleDownload = (pdfUrl: string) => {
    const match = pdfUrl.match(/\/file\/d\/([^\/]+)/);
    if (match && match[1]) {
      window.open(`https://drive.google.com/uc?export=download&id=${match[1]}`, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="mb-20 relative h-[300px] sm:h-[350px] md:h-[400px] bg-cyan-600 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>

        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-white text-center">
          <Link href="/">
            <Button
              variant="ghost"
              className="absolute top-4 left-4 sm:top-6 sm:left-6 md:top-8 md:left-8 text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Back to Home</span>
              <span className="sm:hidden">Back</span>
            </Button>
          </Link>

          <Badge
            variant="secondary"
            className="mb-4 bg-white/20 backdrop-blur-sm text-white border-white/30"
          >
            <CalendarIcon className="w-3 h-3 mr-1" />
            Academic Portal
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 drop-shadow-lg">
            Academic Calendar
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-cyan-50 max-w-3xl drop-shadow-md">
            View important dates, events, and monthly academic schedules
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 pb-20">
        {/* Results Section */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
            <p className="text-slate-600 mt-4">Loading calendar...</p>
          </div>
        ) : calendars.length > 0 ? (
          <div className="max-w-5xl mx-auto">
            <Card className="border-none shadow-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 border-b">
                <CardTitle className="text-2xl text-slate-900 flex items-center justify-center gap-2">
                  <CalendarIcon className="w-6 h-6 text-cyan-600" />
                  {calendars[0].month}
                </CardTitle>
              </CardHeader>

              <CardContent className="p-0">
                {/* Large PDF Preview */}
                <div className="relative h-[600px] md:h-[800px] lg:h-[1000px] overflow-hidden bg-slate-100">
                  <iframe
                    src={convertGoogleDriveUrl(calendars[0].pdfUrl)}
                    className="w-full h-full border-0"
                    allow="autoplay"
                  />
                </div>

                {/* Action Buttons */}
                <div className="p-6 bg-slate-50 flex gap-4 justify-center">
                  <Button
                    size="lg"
                    variant="outline"
                    className="min-w-[160px]"
                    onClick={() => handleViewDetails(calendars[0].pdfUrl)}
                  >
                    <Eye className="w-5 h-5 mr-2" />
                    View Full Calendar
                  </Button>
                  <Button
                    size="lg"
                    className="bg-cyan-600 hover:bg-cyan-700 min-w-[160px]"
                    onClick={() => handleDownload(calendars[0].pdfUrl)}
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              No Calendar Available
            </h3>
            <p className="text-slate-600">
              Academic calendar will be published here soon.
            </p>
          </div>
        )}

        {/* Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="border-l-4 border-l-cyan-500">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Eye className="w-8 h-8 text-cyan-600 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">View Calendar</h3>
                  <p className="text-sm text-slate-600">
                    Click "View Full" to see the calendar in full screen for better readability.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Download className="w-8 h-8 text-blue-600 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">
                    Download PDF
                  </h3>
                  <p className="text-sm text-slate-600">
                    Download the calendar as a PDF file for offline access and printing.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <CalendarIcon className="w-8 h-8 text-purple-600 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">
                    Stay Updated
                  </h3>
                  <p className="text-sm text-slate-600">
                    Calendars are updated monthly. Check regularly for new events and changes.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Important Notice */}
        <Card className="mt-8 border-2 border-amber-200 bg-amber-50/50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">
                  Important Information
                </h3>
                <div className="space-y-2 text-slate-700">
                  <p className="flex items-start gap-2">
                    <span className="font-bold text-amber-600 mt-0.5">•</span>
                    <span>
                      All dates are subject to change. Please check regularly for updates
                    </span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="font-bold text-amber-600 mt-0.5">•</span>
                    <span>
                      Islamic holidays may be adjusted based on moon sighting
                    </span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="font-bold text-amber-600 mt-0.5">•</span>
                    <span>
                      Students are required to attend all scheduled events unless excused
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

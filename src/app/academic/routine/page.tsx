"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Download,
  Eye,
  Clock,
  ArrowLeft,
  FileText,
  GraduationCap,
} from "lucide-react";

interface ClassRoutine {
  _id: string;
  className: string;
  routineName: string;
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

export default function RoutinePage() {
  const [classRoutines, setClassRoutines] = useState<ClassRoutine[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState<string>("all");

  const classes = ['Play Group', 'Nursery', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7'];

  useEffect(() => {
    fetchClassRoutines();
  }, []);

  const fetchClassRoutines = async () => {
    try {
      const response = await fetch('/api/class-routine');
      const data = await response.json();
      setClassRoutines(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching class routines:', error);
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

  const filteredRoutines = selectedClass === "all" 
    ? classRoutines 
    : classRoutines.filter(routine => routine.className === selectedClass);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="mb-20 relative h-[300px] bg-cyan-600 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>

        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-white text-center">
          <Link href="/">
            <Button
              variant="ghost"
              className="absolute top-6 left-6 text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>

          <Badge
            variant="secondary"
            className="mb-4 bg-white/20 backdrop-blur-sm text-white border-white/30"
          >
            <Clock className="w-3 h-3 mr-1" />
            Academic Portal
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 drop-shadow-lg">
            Class Routine
          </h1>
          <p className="text-lg md:text-xl text-cyan-50 max-w-2xl drop-shadow-md">
            View daily class schedules and timetables for all classes
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 pb-20">
        <Card className="border-none shadow-xl">
          <CardHeader className="border-b bg-slate-50/50">
            <CardTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-cyan-600" />
              Class Timetables
            </CardTitle>
            <p className="text-sm text-slate-600 mt-2">
              Filter by class to view specific timetables
            </p>
          </CardHeader>

          <CardContent className="p-6">
            {/* Filter Section */}
            <div className="mb-8 p-4 bg-slate-50 rounded-lg border max-w-md">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-2">
                <GraduationCap className="w-4 h-4 text-cyan-600" />
                Filter by Class
              </label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {classes.map((cls) => (
                    <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Results Section */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                <p className="text-slate-600 mt-4">Loading class routines...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredRoutines.length > 0 ? (
                  <div>
                    <div className="mb-4 flex items-center justify-between">
                      <p className="text-sm text-slate-600">
                        Showing <strong>{filteredRoutines.length}</strong>{" "}
                        class routine{filteredRoutines.length !== 1 ? "s" : ""}
                      </p>
                      {selectedClass !== "all" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedClass("all")}
                        >
                          Clear Filter
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {filteredRoutines.map((routine) => (
                        <Card
                          key={routine._id}
                          className="border-2 hover:border-cyan-300 transition-all overflow-hidden group"
                        >
                          <CardHeader className="bg-gradient-to-r from-slate-50 to-purple-50 border-b pb-4">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <CardTitle className="text-lg text-slate-900 leading-tight mb-2">
                                  {routine.routineName}
                                </CardTitle>
                                <Badge variant="outline" className="gap-1">
                                  <GraduationCap className="w-3 h-3" />
                                  {routine.className}
                                </Badge>
                              </div>
                            </div>
                          </CardHeader>

                          <CardContent className="p-0">
                            {/* PDF Preview */}
                            <div className="relative h-72 overflow-hidden bg-slate-100">
                              <iframe
                                src={convertGoogleDriveUrl(routine.pdfUrl)}
                                className="w-full h-full border-0 pointer-events-none"
                                allow="autoplay"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="absolute bottom-4 left-4 right-4 flex gap-3">
                                  <Button
                                    size="sm"
                                    className="flex-1 bg-white text-slate-900 hover:bg-slate-100"
                                    onClick={() => handleViewDetails(routine.pdfUrl)}
                                  >
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Routine
                                  </Button>
                                  <Button
                                    size="sm"
                                    className="flex-1 bg-cyan-600 hover:bg-cyan-700"
                                    onClick={() => handleDownload(routine.pdfUrl)}
                                  >
                                    <Download className="w-4 h-4 mr-2" />
                                    Download PDF
                                  </Button>
                                </div>
                              </div>
                            </div>

                            {/* Mobile Action Buttons */}
                            <div className="p-4 bg-slate-50 flex gap-3 lg:hidden">
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1"
                                onClick={() => handleViewDetails(routine.pdfUrl)}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </Button>
                              <Button
                                size="sm"
                                className="flex-1 bg-cyan-600 hover:bg-cyan-700"
                                onClick={() => handleDownload(routine.pdfUrl)}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">
                      No Routines Found
                    </h3>
                    <p className="text-slate-600">
                      No class routines match your current filter.
                    </p>
                    {selectedClass !== "all" && (
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => setSelectedClass("all")}
                      >
                        Clear Filter
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="border-l-4 border-l-cyan-500">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Clock className="w-8 h-8 text-cyan-600 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Daily Schedule</h3>
                  <p className="text-sm text-slate-600">
                    View complete daily timetables with all subjects and break times.
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
                    Download & Print
                  </h3>
                  <p className="text-sm text-slate-600">
                    Download routines as PDF files for offline access and printing.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-cyan-500">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Calendar className="w-8 h-8 text-cyan-600 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">
                    Stay Updated
                  </h3>
                  <p className="text-sm text-slate-600">
                    Check regularly for any updates or changes to class schedules.
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
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">
                  Important Information
                </h3>
                <div className="space-y-2 text-slate-700">
                  <p className="flex items-start gap-2">
                    <span className="font-bold text-amber-600 mt-0.5">•</span>
                    <span>
                      Students must follow the routine and arrive on time for all classes
                    </span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="font-bold text-amber-600 mt-0.5">•</span>
                    <span>
                      Special activities and events may cause temporary schedule changes
                    </span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="font-bold text-amber-600 mt-0.5">•</span>
                    <span>
                      Contact your class teacher for any questions about the routine
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

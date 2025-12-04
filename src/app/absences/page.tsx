"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Download,
  Eye,
  ArrowLeft,
  FileText,
  GraduationCap,
  UserX,
  AlertCircle,
} from "lucide-react";

interface AbsenceRecord {
  _id: string;
  className: string;
  section: string;
  title: string;
  imageUrl: string;
  date: string;
}

export default function AbsencesPage() {
  const [absenceRecords, setAbsenceRecords] = useState<AbsenceRecord[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAbsences();
  }, []);

  const fetchAbsences = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/todays-absences");
      const data = await response.json();
      setAbsenceRecords(data.absences || []);
      
      // Auto-select first class if available
      if (data.absences && data.absences.length > 0) {
        setSelectedClass(data.absences[0].className);
      }
    } catch (error) {
      console.error("Error fetching absences:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (imageUrl: string, filename: string) => {
    const fileIdMatch = imageUrl.match(/\/file\/d\/([^\/]+)/);
    if (fileIdMatch) {
      window.open(`https://drive.google.com/uc?export=download&id=${fileIdMatch[1]}`, "_blank");
    } else {
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = filename;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleViewFull = (imageUrl: string) => {
    const fileIdMatch = imageUrl.match(/\/file\/d\/([^\/]+)/);
    if (fileIdMatch) {
      window.open(`https://drive.google.com/file/d/${fileIdMatch[1]}/view`, "_blank");
    } else {
      window.open(imageUrl, "_blank");
    }
  };

  // Convert Google Drive view link to embed link
  const convertGoogleDriveUrl = (url: string) => {
    if (url.includes('drive.google.com/file/d/')) {
      const fileIdMatch = url.match(/\/file\/d\/([^\/]+)/);
      if (fileIdMatch) {
        return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
      }
    }
    return url;
  };

  // Group records by class
  const classGroups = absenceRecords.reduce((acc, record) => {
    if (!acc[record.className]) {
      acc[record.className] = [];
    }
    acc[record.className].push(record);
    return acc;
  }, {} as Record<string, AbsenceRecord[]>);

  // Sort class names naturally (Class 1, Class 2, ..., Class 10)
  const classOptions = Object.keys(classGroups).sort((a, b) => {
    // Extract numeric part from "Class X" format
    const numA = parseInt(a.replace(/\D/g, '')) || 0;
    const numB = parseInt(b.replace(/\D/g, '')) || 0;
    
    // If both have numbers, sort numerically
    if (numA && numB) {
      return numA - numB;
    }
    
    // If only one has a number, it comes after non-numeric
    if (numA) return 1;
    if (numB) return -1;
    
    // Otherwise, sort alphabetically
    return a.localeCompare(b);
  });

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
            <Calendar className="w-3 h-3 mr-1" />
            Attendance Portal
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 drop-shadow-lg">
            Today&apos;s Absences
          </h1>
          <p className="text-lg md:text-xl text-cyan-50 max-w-2xl drop-shadow-md">
            View absent students for all grades and sections
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 pb-20">
        <Card className="border-none shadow-xl">
          <CardHeader className="border-b bg-slate-50/50">
            <CardTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-6 h-6 text-cyan-600" />
              Absence Records by Class
            </CardTitle>
            <p className="text-sm text-slate-600 mt-2">
              Select a class to view today&apos;s absence records
            </p>
          </CardHeader>

          <CardContent className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
                <p className="text-slate-600">Loading absence records...</p>
              </div>
            ) : classOptions.length === 0 ? (
              <div className="text-center py-12">
                <UserX className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  No Records Available
                </h3>
                <p className="text-slate-600">
                  No absence records have been uploaded yet.
                </p>
              </div>
            ) : (
              <Tabs
                value={selectedClass}
                onValueChange={setSelectedClass}
                className="w-full"
              >
                <TabsList className="grid w-full mb-8" style={{ gridTemplateColumns: `repeat(${classOptions.length}, minmax(0, 1fr))` }}>
                  {classOptions.map((className) => (
                    <TabsTrigger
                      key={className}
                      value={className}
                      className="gap-2"
                    >
                      <GraduationCap className="w-4 h-4" />
                      {className}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {classOptions.map((className) => (
                  <TabsContent
                    key={className}
                    value={className}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {classGroups[className].map((record) => (
                        <Card
                          key={record._id}
                          className="border-2 hover:border-cyan-300 transition-all overflow-hidden group"
                        >
                          <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 border-b">
                            <CardTitle className="text-xl text-slate-900">
                              {record.title}
                            </CardTitle>
                            <p className="text-sm text-slate-600 mt-1">
                              Section: {record.section}
                            </p>
                          </CardHeader>

                          <CardContent className="p-0">
                            <div className="relative h-80 overflow-hidden bg-slate-100">
                              <iframe
                                src={convertGoogleDriveUrl(record.imageUrl)}
                                className="w-full h-full border-0"
                                allow="autoplay"
                              />
                            </div>

                            <div className="p-4 bg-white border-t">
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="flex-1"
                                  onClick={() => handleViewFull(record.imageUrl)}
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  View Full
                                </Button>
                                <Button
                                  size="sm"
                                  className="flex-1 bg-cyan-600 hover:bg-cyan-700"
                                  onClick={() =>
                                    handleDownload(
                                      record.imageUrl,
                                      `${record.className}-${record.section}-absences.jpg`
                                    )
                                  }
                                >
                                  <Download className="w-4 h-4 mr-1" />
                                  Download
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            )}
          </CardContent>
        </Card>

        {/* Notice Card */}
        <Card className="mt-8 border-2 border-amber-200 bg-amber-50/50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Important Information
                </h3>
                <p className="text-slate-700 mb-2">
                  • Absence records are updated daily by class teachers
                </p>
                <p className="text-slate-700 mb-2">
                  • Parents will be notified via SMS for absences
                </p>
                <p className="text-slate-700 mb-2">
                  • Multiple consecutive absences require medical documentation
                </p>
                <p className="text-slate-700">
                  • For attendance queries, contact: attendance@madrasa.edu
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

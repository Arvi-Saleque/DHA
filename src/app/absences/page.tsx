"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Download,
  Eye,
  GraduationCap,
  ArrowLeft,
  FileText,
  UserX,
} from "lucide-react";
import MobilePDFViewer from "@/components/common/MobilePDFViewer";

interface TodaysAbsence {
  _id: string;
  className: string;
  absenceName: string;
  pdfUrl: string;
  totalPages?: number;
  isActive: boolean;
  createdAt: string;
}

export default function AbsencesPage() {
  const [absences, setAbsences] = useState<TodaysAbsence[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState("Play Group");
  const [viewingAbsence, setViewingAbsence] = useState<TodaysAbsence | null>(null);

  const classes = ['Play Group', 'Nursery', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7'];

  useEffect(() => {
    fetchAbsences();
  }, []);

  const fetchAbsences = async () => {
    try {
      const response = await fetch('/api/todays-absences');
      const data = await response.json();
      setAbsences(data.absences || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching absences:', error);
      setLoading(false);
    }
  };

  const handleDownload = async (pdfUrl: string) => {
    try {
      const match = pdfUrl.match(/\/file\/d\/([^\/]+)/);
      if (match && match[1]) {
        window.open(`https://drive.google.com/uc?export=download&id=${match[1]}`, '_blank');
      } else {
        const response = await fetch(pdfUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `absence-${Date.now()}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Download failed:', error);
      window.open(pdfUrl, '_blank');
    }
  };

  const classGroups = classes
    .map(cls => ({
      id: cls.toLowerCase().replace(' ', '-'),
      label: cls,
      absences: absences.filter((a) => a.className === cls),
    }))
    .filter(group => group.absences.length > 0);

  // Set the first available class when data loads
  useEffect(() => {
    if (classGroups.length > 0 && !selectedClass) {
      setSelectedClass(classGroups[0].label);
    }
  }, [absences, classGroups.length]);

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
            <UserX className="w-3 h-3 mr-1" />
            Academic Portal
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 drop-shadow-lg">
            Today's Absences
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-cyan-50 max-w-3xl drop-shadow-md">
            Daily attendance and absence records for all classes
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 pb-20">
        <Card className="border-none shadow-xl">
          <CardHeader className="border-b bg-slate-50/50">
            <CardTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-6 h-6 text-cyan-600" />
              Absence Records by Class Level
            </CardTitle>
            <p className="text-sm text-slate-600 mt-2">
              Select a class to view and download absence records
            </p>
          </CardHeader>

          <CardContent className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
                <p className="text-slate-600 mt-4">Loading absence records...</p>
              </div>
            ) : classGroups.length > 0 ? (
              <div className="space-y-6">
                {/* Class Selector Dropdown */}
                <div className="mb-8 p-4 bg-slate-50 rounded-lg border max-w-md">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-2">
                    <GraduationCap className="w-4 h-4 text-cyan-600" />
                    Filter by Class
                  </label>
                  <Select
                    value={selectedClass}
                    onValueChange={setSelectedClass}
                  >
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classGroups.map((group) => (
                        <SelectItem key={group.id} value={group.label}>
                          {group.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Display absences for selected class */}
                {classGroups
                  .filter(group => group.label === selectedClass)
                  .map((group) => (
                  <div key={group.id}>
                    {viewingAbsence ? (
                      /* PDF Viewer Mode */
                      <div className="-mx-6 -mb-6">
                        <div className="relative">
                          {/* Back Button */}
                          <div className="py-2 sm:py-3 bg-slate-100 px-3 sm:px-6 flex items-center justify-between">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-9"
                              onClick={() => setViewingAbsence(null)}
                            >
                              <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                              <span className="hidden sm:inline">Back to List</span>
                              <span className="sm:hidden">Back</span>
                            </Button>
                            <Badge variant="outline" className="gap-1 text-xs sm:text-sm">
                              <GraduationCap className="w-3 h-3" />
                              <span className="hidden sm:inline">{new Date(viewingAbsence.createdAt).toLocaleDateString('en-US')}</span>
                            </Badge>
                          </div>

                          {/* Mobile-Optimized PDF Viewer */}
                          <MobilePDFViewer
                            pdfUrl={viewingAbsence.pdfUrl}
                            totalPages={viewingAbsence.totalPages || 15}
                          />

                          {/* Action Buttons */}
                          <div className="py-2 sm:py-3 bg-slate-50 flex justify-center">
                            <Button
                              className="bg-cyan-600 hover:bg-cyan-700 text-xs sm:text-sm px-3 sm:px-4 h-8 sm:h-10"
                              onClick={() => handleDownload(viewingAbsence.pdfUrl)}
                            >
                              <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                              Download PDF
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : group.absences.length > 0 ? (
                      /* Table View Mode */
                      <div>
                        <div className="mb-4">
                          <p className="text-sm text-slate-600">
                            Showing <strong>{group.absences.length}</strong> absence record{group.absences.length !== 1 ? 's' : ''} for {group.label}
                          </p>
                        </div>
                        <div className="rounded-lg border border-slate-200 overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow className="bg-slate-50">
                                <TableHead className="font-semibold">Absence Record</TableHead>
                                <TableHead className="text-right font-semibold">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {group.absences.map((absence) => (
                                <TableRow key={absence._id} className="hover:bg-slate-50">
                                  <TableCell>
                                    <div className="flex items-center gap-2 sm:gap-3">
                                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                                        <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-600" />
                                      </div>
                                      <div>
                                        <p className="font-medium text-slate-900 text-sm sm:text-base">{new Date(absence.createdAt).toLocaleDateString('en-US')}</p>
                                        <p className="text-xs sm:text-sm text-slate-500">{absence.className}</p>
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <div className="flex flex-col sm:flex-row justify-end gap-1 sm:gap-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-9"
                                        onClick={() => setViewingAbsence(absence)}
                                      >
                                        <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                        <span className="hidden sm:inline">View Details</span>
                                        <span className="sm:hidden">View</span>
                                      </Button>
                                      <Button
                                        size="sm"
                                        className="bg-cyan-600 hover:bg-cyan-700 text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-9"
                                        onClick={() => handleDownload(absence.pdfUrl)}
                                      >
                                        <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                        Download
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No Absence Records Available</h3>
                <p className="text-slate-600">
                  Absence records will be posted here when available.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

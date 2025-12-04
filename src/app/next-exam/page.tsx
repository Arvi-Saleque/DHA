"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Calendar,
  Download,
  Clock,
  BookOpen,
  ArrowLeft,
  FileText,
  GraduationCap,
  AlertCircle,
  CheckCircle2,
  Bell,
  Loader2,
} from "lucide-react";

interface ExamSchedule {
  _id: string;
  date: string;
  subject: string;
  time: string;
  duration: string;
  room: string;
  grade: string;
}

export default function NextExamPage() {
  const [exams, setExams] = useState<ExamSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGrade, setSelectedGrade] = useState("");

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const response = await fetch("/api/next-exams");
      const data = await response.json();
      if (data.success) {
        setExams(data.exams);
        // Set first grade as default
        if (data.exams.length > 0) {
          const grades = Array.from(new Set(data.exams.map((e: ExamSchedule) => e.grade)));
          setSelectedGrade(grades[0] as string);
        }
      }
    } catch (error) {
      console.error("Error fetching exams:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    // Get the selected class exams
    const selectedExams = exams.filter((e) => e.grade === selectedGrade);
    
    if (selectedExams.length === 0) {
      alert("No exam schedule available to download");
      return;
    }

    // Create HTML content for PDF
    let htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${selectedGrade} - Exam Routine</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            padding: 40px;
            color: #1e293b;
          }
          .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 3px solid #0891b2;
            padding-bottom: 20px;
          }
          .header h1 {
            color: #0891b2;
            font-size: 32px;
            margin: 0;
          }
          .header h2 {
            color: #64748b;
            font-size: 20px;
            margin: 10px 0;
            font-weight: normal;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #e2e8f0;
            padding: 12px;
            text-align: left;
          }
          th {
            background-color: #0891b2;
            color: white;
            font-weight: bold;
          }
          tr:nth-child(even) {
            background-color: #f8fafc;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e2e8f0;
            text-align: center;
            color: #64748b;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Darul Hikmah academy</h1>
          <h2>${selectedGrade} - Examination Schedule</h2>
          <p>Academic Year: 2025-2026</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Day</th>
              <th>Subject</th>
              <th>Time</th>
              <th>Duration</th>
              <th>Room</th>
            </tr>
          </thead>
          <tbody>
    `;

    selectedExams.forEach((exam) => {
      const examDate = new Date(exam.date);
      const dateStr = examDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      const dayStr = examDate.toLocaleDateString('en-US', { weekday: 'long' });
      
      htmlContent += `
            <tr>
              <td>${dateStr}</td>
              <td>${dayStr}</td>
              <td><strong>${exam.subject}</strong></td>
              <td>${exam.time}</td>
              <td>${exam.duration}</td>
              <td>${exam.room}</td>
            </tr>
      `;
    });

    htmlContent += `
          </tbody>
        </table>
        <div class="footer">
          <p><strong>Important:</strong> Students must arrive 30 minutes before exam time. Bring your student ID card.</p>
          <p>Generated on: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>
      </body>
      </html>
    `;

    // Create a new window and print
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      
      // Wait for content to load then print
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  };

  // Group exams by grade
  const grades = Array.from(new Set(exams.map((e) => e.grade)));
  const gradeGroups = grades.map((grade) => ({
    id: grade.toLowerCase().replace(/\s+/g, "-"),
    label: grade,
    schedules: exams.filter((e) => e.grade === grade),
  }));

  // Calculate stats
  const totalPapers = exams.length;
  const uniqueGrades = grades.length;
  const firstExamDate = exams.length > 0 
    ? new Date(exams[0].date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : "N/A";

  const stats = [
    {
      icon: Calendar,
      value: firstExamDate,
      label: "Exam Starts",
      color: "text-cyan-600",
    },
    {
      icon: GraduationCap,
      value: uniqueGrades.toString(),
      label: "Grades",
      color: "text-blue-600",
    },
    {
      icon: BookOpen,
      value: totalPapers.toString(),
      label: "Total Papers",
      color: "text-purple-600",
    },
    {
      icon: Clock,
      value: "10 Days",
      label: "Duration",
      color: "text-green-600",
    },
  ];

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
            Academic Portal
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 drop-shadow-lg">
            Next Exam Routine
          </h1>
          <p className="text-lg md:text-xl text-cyan-50 max-w-2xl drop-shadow-md">
            Complete schedule for the upcoming midterm examination
          </p>
        </div>
      </section>

      {/* Main Content - Exam Schedule Table */}
      <section className="container mx-auto px-4 pb-20">
        <Card className="border-none shadow-xl">
          <CardHeader className="border-b bg-slate-50/50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-cyan-600" />
                  Examination Schedule
                </CardTitle>
              </div>
              <Button
                onClick={handleDownload}
                className="bg-cyan-600 hover:bg-cyan-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Routine
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
              </div>
            ) : exams.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  No exam schedule available at the moment
                </p>
              </div>
            ) : (
              <Tabs
                value={selectedGrade}
                onValueChange={setSelectedGrade}
                className="w-full"
              >
                <TabsList className="grid w-full mb-8" style={{ gridTemplateColumns: `repeat(${gradeGroups.length}, 1fr)` }}>
                  {gradeGroups.map((group) => (
                    <TabsTrigger
                      key={group.id}
                      value={group.label}
                      className="gap-2"
                    >
                      <GraduationCap className="w-4 h-4" />
                      {group.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {gradeGroups.map((group) => (
                  <TabsContent
                    key={group.id}
                    value={group.label}
                    className="space-y-6"
                  >
                    <div className="overflow-x-auto rounded-lg border border-slate-200">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-slate-50">
                            <TableHead className="font-bold text-slate-900">
                              Date
                            </TableHead>
                            <TableHead className="font-bold text-slate-900">
                              Subject
                            </TableHead>
                            <TableHead className="font-bold text-slate-900">
                              Time
                            </TableHead>
                            <TableHead className="font-bold text-slate-900">
                              Duration
                            </TableHead>
                            <TableHead className="font-bold text-slate-900">
                              Room
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {group.schedules.map((schedule) => (
                            <TableRow
                              key={schedule._id}
                              className="hover:bg-slate-50 transition-colors"
                            >
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 bg-cyan-100 rounded-lg flex flex-col items-center justify-center">
                                    <span className="text-xs text-cyan-600 font-semibold">
                                      {new Date(schedule.date).toLocaleDateString(
                                        "en-US",
                                        { month: "short" }
                                      )}
                                    </span>
                                    <span className="text-lg font-bold text-cyan-700">
                                      {new Date(schedule.date).getDate()}
                                    </span>
                                  </div>
                                  <div>
                                    <div className="font-semibold text-slate-900">
                                      {new Date(schedule.date).toLocaleDateString("en-US", { weekday: "long" })}
                                    </div>
                                    <div className="text-xs text-slate-500">
                                      {new Date(schedule.date).toLocaleDateString()}
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <BookOpen className="w-4 h-4 text-blue-600" />
                                  <span className="font-semibold text-slate-900">
                                    {schedule.subject}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4 text-purple-600" />
                                  <span className="text-slate-700">{schedule.time}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className="bg-green-50 text-green-700 border-green-200"
                                >
                                  {schedule.duration}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <span className="font-semibold text-slate-700">
                                  {schedule.room}
                                </span>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            )}
          </CardContent>
        </Card>

        {/* Important Instructions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="border-l-4 border-l-cyan-500">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-8 h-8 text-cyan-600 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">
                    Be Prepared
                  </h3>
                  <p className="text-sm text-slate-600">
                    Arrive 30 minutes before the exam starts. Bring your
                    student ID card and necessary stationery.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <BookOpen className="w-8 h-8 text-blue-600 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">
                    Study Materials
                  </h3>
                  <p className="text-sm text-slate-600">
                    Review your notes and textbooks. Practice past papers
                    available in the library.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <FileText className="w-8 h-8 text-purple-600 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">
                    Exam Rules
                  </h3>
                  <p className="text-sm text-slate-600">
                    Mobile phones and electronic devices are strictly
                    prohibited during examinations.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notice Card */}
        <Card className="mt-8 border-2 border-amber-200 bg-amber-50/50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Important Exam Guidelines
                </h3>
                <p className="text-slate-700 mb-2">
                  • Students must bring their valid student ID card
                </p>
                <p className="text-slate-700 mb-2">
                  • Entry will not be allowed after 15 minutes of exam start time
                </p>
                <p className="text-slate-700 mb-2">
                  • Use of unfair means will result in cancellation of exam
                </p>
                <p className="text-slate-700 mb-2">
                  • Maintain complete silence in the examination hall
                </p>
                <p className="text-slate-700">
                  • Contact exam controller for any queries: exams@madrasa.edu
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  GraduationCap,
  ArrowLeft,
  UserX,
  Calendar,
  Users,
  Filter,
  Loader2,
  AlertCircle,
} from "lucide-react";

interface Student {
  studentName: string;
  rollNumber: string;
}

interface TodaysAbsence {
  _id: string;
  date: string;
  className: string;
  students: Student[];
  totalAbsent: number;
  isActive: boolean;
  createdAt: string;
}

const classes = [
  "All Classes",
  "Play Group",
  "Nursery",
  "Class 1",
  "Class 2",
  "Class 3",
  "Class 4",
  "Class 5",
  "Class 6",
  "Class 7",
  "Class 8",
  "Class 9",
  "Class 10",
];

export default function AbsencesPage() {
  const [absences, setAbsences] = useState<TodaysAbsence[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>("all");
  const [selectedClass, setSelectedClass] = useState<string>("All Classes");
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [expandedRecord, setExpandedRecord] = useState<string | null>(null);

  useEffect(() => {
    fetchAbsences();
  }, []);

  const fetchAbsences = async () => {
    try {
      const response = await fetch("/api/todays-absences");
      const data = await response.json();
      setAbsences(data.absences || []);
      setAvailableDates(data.availableDates || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching absences:", error);
      setLoading(false);
    }
  };

  // Filter absences based on selected date and class
  const filteredAbsences = absences.filter((absence) => {
    const matchesDate =
      selectedDate === "all" ||
      new Date(absence.date).toISOString().split("T")[0] === selectedDate;
    const matchesClass =
      selectedClass === "All Classes" || absence.className === selectedClass;
    return matchesDate && matchesClass;
  });

  // Get unique classes from absences for filter
  const availableClasses = [
    "All Classes",
    ...Array.from(new Set(absences.map((a) => a.className))).sort((a, b) => {
      const order = classes;
      return order.indexOf(a) - order.indexOf(b);
    }),
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getTotalAbsentStudents = () => {
    return filteredAbsences.reduce((sum, a) => sum + a.totalAbsent, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="mb-12 relative h-[280px] sm:h-[320px] bg-gradient-to-br from-red-500 via-red-600 to-rose-700 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>

        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-white text-center">
          <Link href="/">
            <Button
              variant="ghost"
              className="absolute top-4 left-4 sm:top-6 sm:left-6 text-white hover:bg-white/20"
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
            Attendance Portal
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 drop-shadow-lg">
            Absence Records
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-red-100 max-w-2xl drop-shadow-md">
            Daily student absence records for all classes
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 pb-20 -mt-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-xl">
                <Calendar className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Available Dates</p>
                <p className="text-2xl font-bold text-slate-900">
                  {availableDates.length}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-xl">
                <GraduationCap className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Records</p>
                <p className="text-2xl font-bold text-slate-900">
                  {filteredAbsences.length}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-rose-100 rounded-xl">
                <Users className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Absent Students</p>
                <p className="text-2xl font-bold text-slate-900">
                  {getTotalAbsentStudents()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6 border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex items-center gap-2 text-slate-700">
                <Filter className="w-5 h-5" />
                <span className="font-medium">Filters:</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 flex-1">
                <Select value={selectedDate} onValueChange={setSelectedDate}>
                  <SelectTrigger className="w-full sm:w-[200px] bg-white">
                    <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                    <SelectValue placeholder="Select Date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Dates</SelectItem>
                    {availableDates.map((date) => (
                      <SelectItem key={date} value={date}>
                        {formatDate(date)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="w-full sm:w-[180px] bg-white">
                    <GraduationCap className="w-4 h-4 mr-2 text-slate-400" />
                    <SelectValue placeholder="Select Class" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableClasses.map((cls) => (
                      <SelectItem key={cls} value={cls}>
                        {cls}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Absence Records */}
        <Card className="border-0 shadow-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-900 text-white">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <UserX className="w-5 h-5" />
              Absence List
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-red-600" />
                <span className="ml-3 text-slate-600">
                  Loading absence records...
                </span>
              </div>
            ) : filteredAbsences.length === 0 ? (
              <div className="text-center py-16">
                <AlertCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  No Absence Records Found
                </h3>
                <p className="text-slate-500">
                  {selectedDate !== "all" || selectedClass !== "All Classes"
                    ? "Try adjusting your filters to see more records."
                    : "Absence records will appear here when available."}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredAbsences.map((absence) => (
                  <div key={absence._id} className="bg-white">
                    {/* Record Header */}
                    <div
                      className="p-4 sm:p-5 cursor-pointer hover:bg-slate-50 transition-colors"
                      onClick={() =>
                        setExpandedRecord(
                          expandedRecord === absence._id ? null : absence._id
                        )
                      }
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl text-white">
                            <Calendar className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-900 text-lg">
                              {formatDate(absence.date)}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge
                                variant="outline"
                                className="bg-slate-100 text-slate-700 border-slate-200"
                              >
                                <GraduationCap className="w-3 h-3 mr-1" />
                                {absence.className}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge
                            variant="destructive"
                            className="bg-red-100 text-red-700 hover:bg-red-100"
                          >
                            <Users className="w-3 h-3 mr-1" />
                            {absence.totalAbsent} Absent
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-slate-500"
                          >
                            {expandedRecord === absence._id
                              ? "Hide Details"
                              : "View Details"}
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Student List */}
                    {expandedRecord === absence._id && (
                      <div className="px-4 sm:px-5 pb-5 bg-slate-50">
                        <div className="rounded-lg border border-slate-200 overflow-hidden bg-white">
                          <Table>
                            <TableHeader>
                              <TableRow className="bg-slate-100">
                                <TableHead className="font-bold text-slate-800 w-16">
                                  #
                                </TableHead>
                                <TableHead className="font-bold text-slate-800">
                                  Student Name
                                </TableHead>
                                <TableHead className="font-bold text-slate-800">
                                  Roll Number
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {absence.students.map((student, index) => (
                                <TableRow
                                  key={index}
                                  className="hover:bg-red-50/50"
                                >
                                  <TableCell className="font-medium text-slate-500">
                                    {index + 1}
                                  </TableCell>
                                  <TableCell className="font-medium text-slate-900">
                                    {student.studentName}
                                  </TableCell>
                                  <TableCell>
                                    <Badge
                                      variant="outline"
                                      className="font-mono"
                                    >
                                      {student.rollNumber}
                                    </Badge>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

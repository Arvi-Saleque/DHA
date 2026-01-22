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
            <UserX className="w-3 h-3 mr-1" />
            Academic Portal
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 drop-shadow-lg">
            Student Absences
          </h1>
          <p className="text-lg md:text-xl text-cyan-50 max-w-2xl drop-shadow-md">
            Daily student absence records for all classes
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 pb-20">
        {/* Filters */}
        <Card className="mb-6 border-none shadow-xl">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              <div className="flex items-center gap-2 text-slate-700 min-w-fit">
                <Filter className="w-5 h-5 text-cyan-600" />
                <span className="font-semibold">Filters:</span>
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
        <Card className="border-none shadow-xl overflow-hidden">
          <CardHeader className="border-b bg-slate-50/50">
            <CardTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <UserX className="w-6 h-6 text-cyan-600" />
              Absence Records
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
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
                      className="p-5 cursor-pointer hover:bg-slate-50 transition-colors"
                      onClick={() =>
                        setExpandedRecord(
                          expandedRecord === absence._id ? null : absence._id
                        )
                      }
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-cyan-100 rounded-xl">
                            <Calendar className="w-6 h-6 text-cyan-600" />
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
                            variant="secondary"
                            className="bg-orange-100 text-orange-700 hover:bg-orange-100"
                          >
                            <Users className="w-3 h-3 mr-1" />
                            {absence.totalAbsent} Absent
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50"
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
                      <div className="px-5 pb-5 bg-slate-50">
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
                                  className="hover:bg-slate-50"
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

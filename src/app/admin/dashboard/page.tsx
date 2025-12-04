"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/admin/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Calendar,
  UserX,
  BookOpen,
  Clock,
  Loader2,
} from "lucide-react";

interface Assignment {
  _id: string;
  subject: string;
  class: string;
  title: string;
  deadline: string;
  teacherName: string;
  status: string;
}

export default function AdminDashboard() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await fetch("/api/assignments");
      const data = await response.json();
      if (data.success) {
        setAssignments(data.assignments);
      }
    } catch (error) {
      console.error("Error fetching assignments:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow, ${date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
    }
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Assignments */}
        <Card className="lg:col-span-2">
          <CardHeader className="border-b border-gray-100 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-cyan-600" />
                Daily Assignments
              </CardTitle>
              <Button size="sm" variant="outline">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
              </div>
            ) : assignments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No assignments found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {assignments.map((assignment) => (
                  <div
                    key={assignment._id}
                    className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="h-10 w-10 bg-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BookOpen className="h-5 w-5 text-cyan-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900">{assignment.subject}</h4>
                        <Badge variant="outline" className="text-xs">
                          {assignment.class}
                        </Badge>
                        {assignment.status === "urgent" && (
                          <Badge className="bg-red-100 text-red-700 text-xs">Urgent</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{assignment.title}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDeadline(assignment.deadline)}
                        </span>
                        <span>By {assignment.teacherName}</span>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" className="text-cyan-600">
                      View
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Next Exam & Today's Absences */}
        <div className="space-y-6">
          {/* Next Exam */}
          <Card>
            <CardHeader className="border-b border-gray-100 pb-4">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Next Exam
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">
                  <div className="inline-flex items-center justify-center h-16 w-16 bg-blue-100 rounded-full mb-4">
                    <Calendar className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 mb-2">Final Examination</h3>
                  <p className="text-sm text-gray-600 mb-4">December 15, 2025</p>
                  <Badge className="bg-blue-600">Starting in 13 days</Badge>
                </div>

                <div className="space-y-3">
                  {[
                    { subject: "Mathematics", date: "Dec 15", time: "9:00 AM" },
                    { subject: "English", date: "Dec 16", time: "9:00 AM" },
                    { subject: "Science", date: "Dec 17", time: "9:00 AM" },
                  ].map((exam, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{exam.subject}</p>
                        <p className="text-xs text-gray-500">{exam.time}</p>
                      </div>
                      <Badge variant="outline">{exam.date}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Today's Absences */}
          <Card>
            <CardHeader className="border-b border-gray-100 pb-4">
              <CardTitle className="flex items-center gap-2">
                <UserX className="h-5 w-5 text-red-600" />
                Today&apos;s Absences
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {[
                  { name: "Ahmed Hassan", class: "Grade 10-A", reason: "Sick" },
                  { name: "Fatima Noor", class: "Grade 9-B", reason: "Family Event" },
                  { name: "Ali Raza", class: "Grade 11-A", reason: "Medical" },
                  { name: "Sara Khan", class: "Grade 8-C", reason: "Personal" },
                  { name: "Usman Ali", class: "Grade 10-B", reason: "Sick" },
                ].map((student, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-red-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-semibold text-red-700">
                          {student.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-sm text-gray-900">{student.name}</p>
                        <p className="text-xs text-gray-500">{student.class}</p>
                      </div>
                    </div>
                    <Badge className="bg-red-100 text-red-700 text-xs">{student.reason}</Badge>
                  </div>
                ))}

                <Button className="w-full mt-4" variant="outline" size="sm">
                  View All Absences
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

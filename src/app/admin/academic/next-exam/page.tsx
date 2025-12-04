"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/admin/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Calendar,
  Search,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface NextExam {
  _id: string;
  date: string;
  subject: string;
  time: string;
  duration: string;
  room: string;
  grade: string;
}

interface FormData {
  date: string;
  subject: string;
  time: string;
  duration: string;
  room: string;
  grade: string;
}

export default function NextExamManagement() {
  const [exams, setExams] = useState<NextExam[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState<FormData>({
    date: "",
    subject: "",
    time: "",
    duration: "",
    room: "",
    grade: "",
  });

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/next-exams");
      const data = await response.json();
      if (data.success) {
        setExams(data.exams);
      }
    } catch (error) {
      console.error("Error fetching exams:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (exam?: NextExam) => {
    if (exam) {
      setIsEditing(true);
      setCurrentId(exam._id);
      setFormData({
        date: new Date(exam.date).toISOString().slice(0, 10),
        subject: exam.subject,
        time: exam.time,
        duration: exam.duration,
        room: exam.room,
        grade: exam.grade,
      });
    } else {
      setIsEditing(false);
      setCurrentId(null);
      setFormData({
        date: "",
        subject: "",
        time: "",
        duration: "",
        room: "",
        grade: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      date: "",
      subject: "",
      time: "",
      duration: "",
      room: "",
      grade: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = isEditing
        ? `/api/next-exams?id=${currentId}`
        : "/api/next-exams";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        await fetchExams();
        handleCloseDialog();
      } else {
        alert(data.error || "Failed to save exam");
      }
    } catch (error) {
      console.error("Error saving exam:", error);
      alert("Failed to save exam");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this exam?")) {
      return;
    }

    try {
      const response = await fetch(`/api/next-exams?id=${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        await fetchExams();
      } else {
        alert(data.error || "Failed to delete exam");
      }
    } catch (error) {
      console.error("Error deleting exam:", error);
      alert("Failed to delete exam");
    }
  };

  const filteredExams = exams.filter(
    (exam) =>
      exam.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.grade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.room.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-6 w-6 text-cyan-600" />
                Manage Next Exam Schedule
              </CardTitle>
              <Button
                onClick={() => handleOpenDialog()}
                className="bg-cyan-600 hover:bg-cyan-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Exam
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by subject, class, or room..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Exams Table */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
              </div>
            ) : filteredExams.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  {searchTerm
                    ? "No exams found matching your search"
                    : "No exams yet. Click 'Add Exam' to create one."}
                </p>
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Room</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredExams.map((exam) => (
                      <TableRow key={exam._id}>
                        <TableCell className="font-medium">
                          {formatDate(exam.date)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{exam.grade}</Badge>
                        </TableCell>
                        <TableCell>{exam.subject}</TableCell>
                        <TableCell className="text-gray-600">
                          {exam.time}
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-700">
                            {exam.duration}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-semibold">
                          {exam.room}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleOpenDialog(exam)}
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(exam._id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Exam" : "Add New Exam"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">
                    Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grade">
                    Class <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.grade}
                    onValueChange={(value) =>
                      setFormData({ ...formData, grade: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Play Group">Play Group</SelectItem>
                      <SelectItem value="Nursery">Nursery</SelectItem>
                      <SelectItem value="Class 1">Class 1</SelectItem>
                      <SelectItem value="Class 2">Class 2</SelectItem>
                      <SelectItem value="Class 3">Class 3</SelectItem>
                      <SelectItem value="Class 4">Class 4</SelectItem>
                      <SelectItem value="Class 5">Class 5</SelectItem>
                      <SelectItem value="Class 6">Class 6</SelectItem>
                      <SelectItem value="Class 7">Class 7</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">
                  Subject <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  placeholder="e.g., Islamic Studies"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="time">
                    Time <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="time"
                    value={formData.time}
                    onChange={(e) =>
                      setFormData({ ...formData, time: e.target.value })
                    }
                    placeholder="e.g., 9:00 AM - 12:00 PM"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">
                    Duration <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                    placeholder="e.g., 3 hours"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="room">
                  Room <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="room"
                  value={formData.room}
                  onChange={(e) =>
                    setFormData({ ...formData, room: e.target.value })
                  }
                  placeholder="e.g., Hall A"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseDialog}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-cyan-600 hover:bg-cyan-700"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>{isEditing ? "Update" : "Create"} Exam</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

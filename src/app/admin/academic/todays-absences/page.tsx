"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/admin/DashboardLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Calendar,
  Users,
  GraduationCap,
  AlertTriangle,
  Eye,
  UserX,
  X,
  Loader2,
} from "lucide-react";

interface Student {
  studentName: string;
  rollNumber: string;
}

interface Absence {
  _id: string;
  date: string;
  className: string;
  students: Student[];
  totalAbsent: number;
  isActive: boolean;
  createdAt: string;
}

const classOptions = [
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

export default function TodaysAbsencesAdmin() {
  const [absences, setAbsences] = useState<Absence[]>([]);
  const [filteredAbsences, setFilteredAbsences] = useState<Absence[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterClass, setFilterClass] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [editingAbsence, setEditingAbsence] = useState<Absence | null>(null);
  const [viewingAbsence, setViewingAbsence] = useState<Absence | null>(null);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    className: "",
    students: [{ studentName: "", rollNumber: "" }] as Student[],
  });

  // Bulk input mode
  const [bulkInput, setBulkInput] = useState("");
  const [inputMode, setInputMode] = useState<"individual" | "bulk">("individual");

  useEffect(() => {
    fetchAbsences();
  }, []);

  useEffect(() => {
    let filtered = absences;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (absence) =>
          absence.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
          absence.students.some(
            (s) =>
              s.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
              s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    // Filter by class
    if (filterClass !== "all") {
      filtered = filtered.filter((absence) => absence.className === filterClass);
    }

    setFilteredAbsences(filtered);
  }, [searchTerm, filterClass, absences]);

  const fetchAbsences = async () => {
    setIsFetching(true);
    try {
      const response = await fetch("/api/todays-absences");
      const data = await response.json();
      setAbsences(data.absences || []);
      setFilteredAbsences(data.absences || []);
    } catch (error) {
      console.error("Error fetching absences:", error);
      alert("Failed to fetch absences");
    } finally {
      setIsFetching(false);
    }
  };

  const parseBulkInput = (text: string): Student[] => {
    const lines = text.split("\n").filter((line) => line.trim());
    const students: Student[] = [];

    for (const line of lines) {
      // Try different formats:
      // Format 1: "Name - Roll" or "Name, Roll"
      // Format 2: "Roll - Name" or "Roll, Name" (if roll looks like a number)
      // Format 3: "Roll Name" (space separated, first is roll if numeric)

      let name = "";
      let roll = "";

      if (line.includes("-")) {
        const parts = line.split("-").map((p) => p.trim());
        if (parts.length >= 2) {
          // Check if first part is roll number (numeric or alphanumeric short)
          if (/^\d+$/.test(parts[0]) || parts[0].length <= 5) {
            roll = parts[0];
            name = parts.slice(1).join("-").trim();
          } else {
            name = parts[0];
            roll = parts[1];
          }
        }
      } else if (line.includes(",")) {
        const parts = line.split(",").map((p) => p.trim());
        if (parts.length >= 2) {
          if (/^\d+$/.test(parts[0]) || parts[0].length <= 5) {
            roll = parts[0];
            name = parts.slice(1).join(",").trim();
          } else {
            name = parts[0];
            roll = parts[1];
          }
        }
      } else {
        // Space separated - first word is roll if numeric
        const parts = line.trim().split(/\s+/);
        if (parts.length >= 2) {
          if (/^\d+$/.test(parts[0])) {
            roll = parts[0];
            name = parts.slice(1).join(" ");
          } else {
            name = parts.slice(0, -1).join(" ");
            roll = parts[parts.length - 1];
          }
        } else if (parts.length === 1) {
          name = parts[0];
          roll = "N/A";
        }
      }

      if (name && roll) {
        students.push({ studentName: name, rollNumber: roll });
      }
    }

    return students;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let studentsToSubmit = formData.students;

      // If bulk mode, parse the bulk input
      if (inputMode === "bulk" && bulkInput.trim()) {
        studentsToSubmit = parseBulkInput(bulkInput);
      }

      // Filter out empty students
      studentsToSubmit = studentsToSubmit.filter(
        (s) => s.studentName.trim() && s.rollNumber.trim()
      );

      if (studentsToSubmit.length === 0) {
        alert("Please add at least one student");
        setIsLoading(false);
        return;
      }

      const url = "/api/todays-absences";
      const method = editingAbsence ? "PUT" : "POST";
      const body = editingAbsence
        ? {
            id: editingAbsence._id,
            date: formData.date,
            className: formData.className,
            students: studentsToSubmit,
          }
        : {
            date: formData.date,
            className: formData.className,
            students: studentsToSubmit,
          };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        alert(
          editingAbsence
            ? "Absence record updated successfully!"
            : "Absence record added successfully!"
        );
        setIsDialogOpen(false);
        resetForm();
        fetchAbsences();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to save absence");
      }
    } catch (error) {
      console.error("Error saving absence:", error);
      alert("Failed to save absence");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (absence: Absence) => {
    setEditingAbsence(absence);
    setFormData({
      date: new Date(absence.date).toISOString().split("T")[0],
      className: absence.className,
      students: absence.students.length > 0 ? absence.students : [{ studentName: "", rollNumber: "" }],
    });
    setInputMode("individual");
    setBulkInput("");
    setIsDialogOpen(true);
  };

  const handleView = (absence: Absence) => {
    setViewingAbsence(absence);
    setIsViewDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this absence record?")) {
      return;
    }

    try {
      const response = await fetch(`/api/todays-absences?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Absence deleted successfully!");
        fetchAbsences();
      } else {
        alert("Failed to delete absence");
      }
    } catch (error) {
      console.error("Error deleting absence:", error);
      alert("Failed to delete absence");
    }
  };

  const handleDeleteAll = async () => {
    if (
      !confirm(
        `Are you sure you want to delete ALL ${absences.length} absence records? This action cannot be undone!`
      )
    ) {
      return;
    }

    if (
      !confirm(
        "This will permanently delete all absence records. Are you absolutely sure?"
      )
    ) {
      return;
    }

    setIsLoading(true);
    try {
      let deletedCount = 0;
      let failedCount = 0;

      for (const absence of absences) {
        try {
          const response = await fetch(`/api/todays-absences?id=${absence._id}`, {
            method: "DELETE",
          });

          if (response.ok) {
            deletedCount++;
          } else {
            failedCount++;
          }
        } catch (error) {
          failedCount++;
        }
      }

      await fetchAbsences();
      alert(
        `Deleted ${deletedCount} absence records${
          failedCount > 0 ? `. Failed to delete ${failedCount} records.` : " successfully!"
        }`
      );
    } catch (error) {
      console.error("Error deleting all absences:", error);
      alert("Failed to delete absence records");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split("T")[0],
      className: "",
      students: [{ studentName: "", rollNumber: "" }],
    });
    setBulkInput("");
    setInputMode("individual");
    setEditingAbsence(null);
  };

  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      resetForm();
    }
  };

  const addStudent = () => {
    setFormData({
      ...formData,
      students: [...formData.students, { studentName: "", rollNumber: "" }],
    });
  };

  const removeStudent = (index: number) => {
    if (formData.students.length > 1) {
      setFormData({
        ...formData,
        students: formData.students.filter((_, i) => i !== index),
      });
    }
  };

  const updateStudent = (index: number, field: keyof Student, value: string) => {
    const newStudents = [...formData.students];
    newStudents[index] = { ...newStudents[index], [field]: value };
    setFormData({ ...formData, students: newStudents });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getTotalAbsentStudents = () => {
    return absences.reduce((sum, a) => sum + a.totalAbsent, 0);
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <UserX className="w-7 h-7 text-red-600" />
              Absence Management
            </h1>
            <p className="text-gray-600 mt-1">
              Record and manage daily student absences
            </p>
          </div>

          <div className="flex gap-2">
            {absences.length > 0 && (
              <Button
                onClick={handleDeleteAll}
                variant="destructive"
                className="bg-red-600 hover:bg-red-700"
                disabled={isLoading}
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Delete All
              </Button>
            )}
            <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
              <DialogTrigger asChild>
                <Button className="bg-cyan-600 hover:bg-cyan-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Absence Record
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingAbsence ? "Edit Absence Record" : "Add New Absence Record"}
                  </DialogTitle>
                  <DialogDescription>
                    Record absent students for a specific date and class
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-5 mt-4">
                  {/* Date and Class Selection */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
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
                    <div>
                      <Label htmlFor="className">
                        Class <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.className}
                        onValueChange={(value) =>
                          setFormData({ ...formData, className: value })
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select class" />
                        </SelectTrigger>
                        <SelectContent>
                          {classOptions.map((className) => (
                            <SelectItem key={className} value={className}>
                              {className}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Input Mode Toggle */}
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={inputMode === "individual" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setInputMode("individual")}
                    >
                      Individual Entry
                    </Button>
                    <Button
                      type="button"
                      variant={inputMode === "bulk" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setInputMode("bulk")}
                    >
                      Bulk Entry
                    </Button>
                  </div>

                  {inputMode === "individual" ? (
                    /* Individual Student Entry */
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Absent Students</Label>
                        <Button type="button" variant="outline" size="sm" onClick={addStudent}>
                          <Plus className="w-4 h-4 mr-1" />
                          Add Student
                        </Button>
                      </div>
                      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                        {formData.students.map((student, index) => (
                          <div
                            key={index}
                            className="flex gap-2 items-center bg-slate-50 p-3 rounded-lg"
                          >
                            <span className="text-sm font-medium text-slate-500 w-6">
                              {index + 1}.
                            </span>
                            <Input
                              placeholder="Student Name"
                              value={student.studentName}
                              onChange={(e) =>
                                updateStudent(index, "studentName", e.target.value)
                              }
                              className="flex-1"
                            />
                            <Input
                              placeholder="Roll No."
                              value={student.rollNumber}
                              onChange={(e) =>
                                updateStudent(index, "rollNumber", e.target.value)
                              }
                              className="w-28"
                            />
                            {formData.students.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeStudent(index)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* Bulk Entry Mode */
                    <div className="space-y-3">
                      <div>
                        <Label>Bulk Entry (One student per line)</Label>
                        <p className="text-sm text-slate-500 mt-1 mb-2">
                          Format: "Roll - Name" or "Name, Roll" or "Roll Name"
                        </p>
                        <Textarea
                          placeholder={`Example:\n1 - John Smith\n2 - Jane Doe\n3 - Ahmad Khan`}
                          value={bulkInput}
                          onChange={(e) => setBulkInput(e.target.value)}
                          rows={10}
                          className="font-mono text-sm"
                        />
                      </div>
                      {bulkInput.trim() && (
                        <div className="bg-slate-50 p-3 rounded-lg">
                          <p className="text-sm font-medium text-slate-700 mb-2">
                            Preview ({parseBulkInput(bulkInput).length} students):
                          </p>
                          <div className="max-h-[150px] overflow-y-auto space-y-1">
                            {parseBulkInput(bulkInput).map((s, i) => (
                              <div key={i} className="text-sm text-slate-600">
                                <span className="font-medium">{s.rollNumber}</span> - {s.studentName}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleDialogClose(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-cyan-600 hover:bg-cyan-700"
                      disabled={isLoading || !formData.className}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : editingAbsence ? (
                        "Update Record"
                      ) : (
                        "Add Record"
                      )}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Records</p>
                <p className="text-2xl font-bold text-slate-900">{absences.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-xl">
                <GraduationCap className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Filtered Records</p>
                <p className="text-2xl font-bold text-slate-900">
                  {filteredAbsences.length}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-xl">
                <Users className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Absent Students</p>
                <p className="text-2xl font-bold text-slate-900">
                  {getTotalAbsentStudents()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search by class or student name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterClass} onValueChange={setFilterClass}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <GraduationCap className="w-4 h-4 mr-2 text-slate-400" />
                <SelectValue placeholder="Filter by class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {classOptions.map((cls) => (
                  <SelectItem key={cls} value={cls}>
                    {cls}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Absence Records Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="font-bold">Date</TableHead>
                <TableHead className="font-bold">Class</TableHead>
                <TableHead className="font-bold">Absent Students</TableHead>
                <TableHead className="font-bold">Status</TableHead>
                <TableHead className="text-right font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isFetching ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-cyan-600" />
                    <p className="text-slate-500 mt-2">Loading records...</p>
                  </TableCell>
                </TableRow>
              ) : filteredAbsences.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-gray-500">
                    <UserX className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                    <p>No absence records found</p>
                    <p className="text-sm text-slate-400 mt-1">
                      {searchTerm || filterClass !== "all"
                        ? "Try adjusting your filters"
                        : "Click 'Add Absence Record' to create one"}
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredAbsences.map((absence) => (
                  <TableRow key={absence._id} className="hover:bg-slate-50">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span className="font-medium">{formatDate(absence.date)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-normal">
                        {absence.className}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="destructive"
                        className="bg-red-100 text-red-700 hover:bg-red-100"
                      >
                        <Users className="w-3 h-3 mr-1" />
                        {absence.totalAbsent} students
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          absence.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {absence.isActive ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleView(absence)}
                          className="text-blue-600"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(absence)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(absence._id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserX className="w-5 h-5 text-red-600" />
              Absence Details
            </DialogTitle>
            {viewingAbsence && (
              <DialogDescription>
                {formatDate(viewingAbsence.date)} - {viewingAbsence.className}
              </DialogDescription>
            )}
          </DialogHeader>
          {viewingAbsence && (
            <div className="mt-4">
              <div className="flex items-center gap-4 mb-4 p-3 bg-slate-50 rounded-lg">
                <Badge variant="outline" className="text-sm">
                  <Calendar className="w-3 h-3 mr-1" />
                  {formatDate(viewingAbsence.date)}
                </Badge>
                <Badge variant="outline" className="text-sm">
                  <GraduationCap className="w-3 h-3 mr-1" />
                  {viewingAbsence.className}
                </Badge>
                <Badge
                  variant="destructive"
                  className="bg-red-100 text-red-700 hover:bg-red-100"
                >
                  <Users className="w-3 h-3 mr-1" />
                  {viewingAbsence.totalAbsent} absent
                </Badge>
              </div>

              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-100">
                      <TableHead className="w-12 font-bold">#</TableHead>
                      <TableHead className="font-bold">Student Name</TableHead>
                      <TableHead className="font-bold">Roll Number</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {viewingAbsence.students.map((student, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium text-slate-500">
                          {index + 1}
                        </TableCell>
                        <TableCell className="font-medium">
                          {student.studentName}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-mono">
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
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

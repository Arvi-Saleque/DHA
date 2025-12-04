"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/admin/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  BookOpen,
  Search,
  AlertTriangle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Assignment {
  _id: string;
  subject: string;
  class: string;
  title: string;
  description?: string;
  deadline: string;
  teacherName: string;
  isActive: boolean;
}

interface FormData {
  subject: string;
  class: string;
  title: string;
  description: string;
  deadline: string;
  teacherName: string;
}

export default function AssignmentsManagement() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState<FormData>({
    subject: "",
    class: "",
    title: "",
    description: "",
    deadline: "",
    teacherName: "",
  });

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
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

  const handleOpenDialog = (assignment?: Assignment) => {
    if (assignment) {
      setIsEditing(true);
      setCurrentId(assignment._id);
      setFormData({
        subject: assignment.subject,
        class: assignment.class,
        title: assignment.title,
        description: assignment.description || "",
        deadline: new Date(assignment.deadline).toISOString().slice(0, 10),
        teacherName: assignment.teacherName,
      });
    } else {
      setIsEditing(false);
      setCurrentId(null);
      setFormData({
        subject: "",
        class: "",
        title: "",
        description: "",
        deadline: "",
        teacherName: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      subject: "",
      class: "",
      title: "",
      description: "",
      deadline: "",
      teacherName: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = isEditing
        ? `/api/assignments?id=${currentId}`
        : "/api/assignments";
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
        await fetchAssignments();
        handleCloseDialog();
      } else {
        alert(data.error || "Failed to save assignment");
      }
    } catch (error) {
      console.error("Error saving assignment:", error);
      alert("Failed to save assignment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this assignment?")) {
      return;
    }

    try {
      const response = await fetch(`/api/assignments?id=${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        await fetchAssignments();
      } else {
        alert(data.error || "Failed to delete assignment");
      }
    } catch (error) {
      console.error("Error deleting assignment:", error);
      alert("Failed to delete assignment");
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm(`Are you sure you want to delete ALL ${assignments.length} assignments? This action cannot be undone!`)) {
      return;
    }

    // Double confirmation for safety
    if (!confirm("This will permanently delete all assignments. Are you absolutely sure?")) {
      return;
    }

    setLoading(true);
    try {
      let deletedCount = 0;
      let failedCount = 0;

      for (const assignment of assignments) {
        try {
          const response = await fetch(`/api/assignments?id=${assignment._id}`, {
            method: "DELETE",
          });

          const data = await response.json();
          if (data.success) {
            deletedCount++;
          } else {
            failedCount++;
          }
        } catch (error) {
          failedCount++;
        }
      }

      await fetchAssignments();
      alert(`Deleted ${deletedCount} assignments${failedCount > 0 ? `. Failed to delete ${failedCount} assignments.` : ' successfully!'}`);
    } catch (error) {
      console.error("Error deleting all assignments:", error);
      alert("Failed to delete assignments");
    } finally {
      setLoading(false);
    }
  };

  const filteredAssignments = assignments.filter(
    (assignment) =>
      assignment.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-cyan-600" />
                Manage Assignments
              </CardTitle>
              <div className="flex gap-2">
                {assignments.length > 0 && (
                  <Button
                    onClick={handleDeleteAll}
                    variant="destructive"
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Delete All
                  </Button>
                )}
                <Button
                  onClick={() => handleOpenDialog()}
                  className="bg-cyan-600 hover:bg-cyan-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Assignment
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by class or subject..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Assignments Table */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
              </div>
            ) : filteredAssignments.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  {searchTerm
                    ? "No assignments found matching your search"
                    : "No assignments yet. Click 'Add Assignment' to create one."}
                </p>
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Class</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Assignment Name</TableHead>
                      <TableHead>Instructions</TableHead>
                      <TableHead>Deadline</TableHead>
                      <TableHead>Teacher</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAssignments.map((assignment) => (
                      <TableRow key={assignment._id}>
                        <TableCell>
                          <Badge variant="outline">{assignment.class}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          {assignment.subject}
                        </TableCell>
                        <TableCell>{assignment.title}</TableCell>
                        <TableCell className="max-w-md">
                          <div className="text-sm text-gray-600 line-clamp-2">
                            {assignment.description || "No instructions"}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(assignment.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {assignment.teacherName}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleOpenDialog(assignment)}
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(assignment._id)}
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
              {isEditing ? "Edit Assignment" : "Add New Assignment"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="class">
                    Class <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="class"
                    value={formData.class}
                    onChange={(e) =>
                      setFormData({ ...formData, class: e.target.value })
                    }
                    placeholder="e.g., Class 5"
                    required
                  />
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">
                  Assignment Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g., Tafsir of Surah Al-Baqarah"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Instructions</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Write a detailed tafsir covering verses 1-20 with proper references"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline">
                  Deadline <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) =>
                    setFormData({ ...formData, deadline: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="teacherName">
                  Teacher <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="teacherName"
                  value={formData.teacherName}
                  onChange={(e) =>
                    setFormData({ ...formData, teacherName: e.target.value })
                  }
                  placeholder="e.g., Mr. Ahmed Hassan"
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
                  <>{isEditing ? "Update" : "Create"} Assignment</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

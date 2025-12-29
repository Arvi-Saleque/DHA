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
import { Plus, Pencil, Trash2, Search, FileText, AlertTriangle } from "lucide-react";
import PdfUploader from "@/components/common/PdfUploader";

interface Absence {
  _id: string;
  className: string;
  absenceName: string;
  pdfUrl: string;
  totalPages: number;
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingAbsence, setEditingAbsence] = useState<Absence | null>(null);

  const [formData, setFormData] = useState({
    className: "",
    absenceName: "",
    pdfUrl: "",
    totalPages: 15,
  });

  useEffect(() => {
    fetchAbsences();
  }, []);

  useEffect(() => {
    const filtered = absences.filter(
      (absence) =>
        absence.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
        absence.absenceName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAbsences(filtered);
  }, [searchTerm, absences]);

  const fetchAbsences = async () => {
    try {
      const response = await fetch("/api/todays-absences");
      const data = await response.json();
      setAbsences(data.absences || []);
      setFilteredAbsences(data.absences || []);
    } catch (error) {
      console.error("Error fetching absences:", error);
      alert("Failed to fetch absences");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = "/api/todays-absences";
      const method = editingAbsence ? "PUT" : "POST";
      const body = editingAbsence
        ? { ...formData, id: editingAbsence._id }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        alert(
          editingAbsence
            ? "Absence updated successfully!"
            : "Absence added successfully!"
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
      className: absence.className,
      absenceName: absence.absenceName,
      pdfUrl: absence.pdfUrl,
      totalPages: absence.totalPages,
    });
    setIsDialogOpen(true);
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
    if (!confirm(`Are you sure you want to delete ALL ${absences.length} absence records? This action cannot be undone!`)) {
      return;
    }

    // Double confirmation for safety
    if (!confirm("This will permanently delete all absence records. Are you absolutely sure?")) {
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
      alert(`Deleted ${deletedCount} absence records${failedCount > 0 ? `. Failed to delete ${failedCount} records.` : ' successfully!'}`);
    } catch (error) {
      console.error("Error deleting all absences:", error);
      alert("Failed to delete absence records");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      className: "",
      absenceName: "",
      pdfUrl: "",
      totalPages: 15,
    });
    setEditingAbsence(null);
  };

  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      resetForm();
    }
  };

  return (
    <DashboardLayout>
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Today's Absences Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage attendance sheets for all classes
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
                Add New Absence Record
              </Button>
            </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingAbsence ? "Edit Absence Record" : "Add New Absence Record"}
              </DialogTitle>
              <DialogDescription>
                Upload absence sheet PDF for the selected class
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
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

              <div>
                <Label htmlFor="absenceName">
                  Absence Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="absenceName"
                  value={formData.absenceName}
                  onChange={(e) =>
                    setFormData({ ...formData, absenceName: e.target.value })
                  }
                  placeholder="e.g., November 2024 Absences"
                  required
                />
              </div>

              <div>
                <PdfUploader
                  label="Absence Sheet PDF"
                  value={formData.pdfUrl}
                  onChange={(url) =>
                    setFormData({ ...formData, pdfUrl: url })
                  }
                  folder="absences"
                />
              </div>

              <div>
                <Label htmlFor="totalPages">
                  Total Pages <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="totalPages"
                  type="number"
                  min="1"
                  value={formData.totalPages}
                  onChange={(e) =>
                    setFormData({ ...formData, totalPages: parseInt(e.target.value) || 1 })
                  }
                  placeholder="e.g., 15"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
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
                  disabled={isLoading}
                >
                  {isLoading
                    ? "Saving..."
                    : editingAbsence
                    ? "Update"
                    : "Add Absence"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search by class or absence name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Class</TableHead>
              <TableHead>Absence Name</TableHead>
              <TableHead>PDF</TableHead>
              <TableHead>Total Pages</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAbsences.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No absence records found
                </TableCell>
              </TableRow>
            ) : (
              filteredAbsences.map((absence) => (
                <TableRow key={absence._id}>
                  <TableCell className="font-medium">{absence.className}</TableCell>
                  <TableCell>{absence.absenceName}</TableCell>
                  <TableCell>
                    <a
                      href={absence.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
                    >
                      <FileText className="w-4 h-4" />
                      View PDF
                    </a>
                  </TableCell>
                  <TableCell>{absence.totalPages} pages</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      absence.isActive 
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {absence.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
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
    </DashboardLayout>
  );
}

"use client";

import { useState, useEffect } from "react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import PdfUploader from "@/components/common/PdfUploader";
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
  Calendar,
  Plus,
  Search,
  Edit,
  Trash2,
  FileText,
  AlertCircle,
  AlertTriangle,
} from "lucide-react";

interface AcademicCalendar {
  _id: string;
  month: string;
  pdfUrl: string;
  isActive: boolean;
  totalPages?: number;
  createdAt: string;
}

export default function AcademicCalendarManagement() {
  const [calendars, setCalendars] = useState<AcademicCalendar[]>([]);
  const [filteredCalendars, setFilteredCalendars] = useState<AcademicCalendar[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCalendar, setEditingCalendar] = useState<AcademicCalendar | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    month: "",
    pdfUrl: "",
    totalPages: 15,
  });

  useEffect(() => {
    fetchCalendars();
  }, []);

  useEffect(() => {
    const filtered = calendars.filter((calendar) =>
      calendar.month.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCalendars(filtered);
  }, [searchTerm, calendars]);

  const fetchCalendars = async () => {
    try {
      const response = await fetch("/api/academic-calendar");
      const data = await response.json();
      setCalendars(data);
      setFilteredCalendars(data);
    } catch (error) {
      console.error("Error fetching calendars:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = "/api/academic-calendar";
      const method = editingCalendar ? "PUT" : "POST";
      const body = editingCalendar
        ? { ...formData, _id: editingCalendar._id }
        : formData;

      console.log("Submitting calendar data:", body);

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Server response:", result);
        await fetchCalendars();
        setIsDialogOpen(false);
        resetForm();
      } else {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        alert(`Failed to save calendar: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error saving calendar:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (calendar: AcademicCalendar) => {
    setEditingCalendar(calendar);
    setFormData({
      month: calendar.month,
      pdfUrl: calendar.pdfUrl,
      totalPages: calendar.totalPages || 15,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this calendar?")) return;

    try {
      const response = await fetch(`/api/academic-calendar?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchCalendars();
      }
    } catch (error) {
      console.error("Error deleting calendar:", error);
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm("⚠️ WARNING: This will delete ALL calendars. Are you absolutely sure?")) return;
    if (!confirm("This action cannot be undone. Delete all calendars?")) return;

    try {
      const response = await fetch("/api/academic-calendar", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deleteAll: true }),
      });

      if (response.ok) {
        await fetchCalendars();
        alert("All calendars deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting all calendars:", error);
      alert("Failed to delete calendars");
    }
  };

  const resetForm = () => {
    setFormData({
      month: "",
      pdfUrl: "",
      totalPages: 15,
    });
    setEditingCalendar(null);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="h-8 w-8 text-cyan-600" />
              Academic Calendar Management
            </h1>
            <p className="text-slate-600 mt-1">
              Manage the academic calendar PDF (only one active calendar shown to students)
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="destructive"
              onClick={handleDeleteAll}
              className="bg-red-600 hover:bg-red-700"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Delete All
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-cyan-600 hover:bg-cyan-700"
                onClick={() => resetForm()}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Calendar
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingCalendar ? "Edit Calendar" : "Add New Calendar"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="month">Month *</Label>
                  <Input
                    id="month"
                    placeholder="e.g., Academic Calendar 2025-2026"
                    value={formData.month}
                    onChange={(e) =>
                      setFormData({ ...formData, month: e.target.value })
                    }
                    required
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Enter a title for the calendar (e.g., "Academic Calendar 2025-2026")
                  </p>
                </div>

                <div>
                  <PdfUploader
                    label="Academic Calendar PDF"
                    value={formData.pdfUrl}
                    onChange={(url) =>
                      setFormData({ ...formData, pdfUrl: url })
                    }
                    folder="academic-calendar"
                  />
                </div>

                <div>
                  <Label htmlFor="totalPages">Total Pages *</Label>
                  <Input
                    id="totalPages"
                    type="number"
                    min="1"
                    placeholder="e.g., 15"
                    value={formData.totalPages}
                    onChange={(e) => {
                      const numValue = parseInt(e.target.value, 10);
                      setFormData({ ...formData, totalPages: isNaN(numValue) ? 1 : numValue });
                    }}
                    required
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Enter the total number of pages in the PDF
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-cyan-600 hover:bg-cyan-700"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : editingCalendar ? "Update Calendar" : "Add Calendar"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleDialogClose}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          </div>
        </div>

        {/* Search and Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Calendars</CardTitle>
            <p className="text-sm text-slate-600 mt-2">
              Note: Only the first calendar will be displayed to students on the public page
            </p>
          </CardHeader>
          <CardContent>
            {filteredCalendars.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  No Calendars Found
                </h3>
                <p className="text-slate-600 mb-4">
                  {searchTerm
                    ? "No calendars match your search."
                    : "Get started by adding your first calendar."}
                </p>
                {searchTerm && (
                  <Button
                    variant="outline"
                    onClick={() => setSearchTerm("")}
                  >
                    Clear Search
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Month</TableHead>
                      <TableHead>PDF Link</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCalendars.map((calendar) => (
                      <TableRow key={calendar._id}>
                        <TableCell className="font-medium">
                          {calendar.month}
                        </TableCell>
                        <TableCell>
                          <a
                            href={calendar.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-600 hover:underline text-sm flex items-center gap-1"
                          >
                            <FileText className="w-4 h-4" />
                            View PDF
                          </a>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              calendar.isActive ? "default" : "secondary"
                            }
                          >
                            {calendar.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">
                          {new Date(calendar.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(calendar)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(calendar._id)}
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
    </DashboardLayout>
  );
}

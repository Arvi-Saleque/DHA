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
import { Badge } from "@/components/ui/badge";
import {
  Award,
  Plus,
  Search,
  Edit,
  Trash2,
  Users,
  DollarSign,
  AlertTriangle,
} from "lucide-react";

interface Scholarship {
  _id: string;
  className: string;
  studentId: string;
  studentName: string;
  benefactorId: string;
  benefactorName: string;
  amount: number;
  date: string;
  isActive: boolean;
  createdAt: string;
}

export default function ScholarshipManagement() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [filteredScholarships, setFilteredScholarships] = useState<Scholarship[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingScholarship, setEditingScholarship] = useState<Scholarship | null>(null);
  const [loading, setLoading] = useState(false);

  const classes = ['Play Group', 'Nursery', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7'];

  const [formData, setFormData] = useState({
    className: "",
    studentId: "",
    studentName: "",
    benefactorId: "",
    benefactorName: "",
    amount: "",
    date: "",
  });

  useEffect(() => {
    fetchScholarships();
  }, []);

  useEffect(() => {
    const filtered = scholarships.filter((scholarship) =>
      scholarship.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scholarship.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scholarship.benefactorId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scholarship.benefactorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scholarship.className.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredScholarships(filtered);
  }, [searchTerm, scholarships]);

  const fetchScholarships = async () => {
    try {
      const response = await fetch("/api/scholarship");
      const data = await response.json();
      setScholarships(data);
      setFilteredScholarships(data);
    } catch (error) {
      console.error("Error fetching scholarships:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = "/api/scholarship";
      const method = editingScholarship ? "PUT" : "POST";
      const body = editingScholarship
        ? { ...formData, _id: editingScholarship._id, amount: Number(formData.amount) }
        : { ...formData, amount: Number(formData.amount) };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        await fetchScholarships();
        setIsDialogOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error("Error saving scholarship:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (scholarship: Scholarship) => {
    setEditingScholarship(scholarship);
    setFormData({
      className: scholarship.className,
      studentId: scholarship.studentId,
      studentName: scholarship.studentName,
      benefactorId: scholarship.benefactorId,
      benefactorName: scholarship.benefactorName,
      amount: scholarship.amount.toString(),
      date: scholarship.date,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this scholarship?")) return;

    try {
      const response = await fetch(`/api/scholarship?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchScholarships();
      }
    } catch (error) {
      console.error("Error deleting scholarship:", error);
    }
  };

  const handleDeleteAll = async () => {
    if (confirm('⚠️ WARNING: This will delete ALL scholarship records. Are you sure?')) {
      if (confirm('This action cannot be undone. Do you really want to delete all scholarship records?')) {
        try {
          const response = await fetch('/api/scholarship', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ deleteAll: true }),
          });
          
          if (response.ok) {
            alert('All scholarship records deleted successfully');
            fetchScholarships();
          }
        } catch (error) {
          console.error('Error deleting all scholarships:', error);
          alert('Failed to delete all records');
        }
      }
    }
  };

  const resetForm = () => {
    setFormData({
      className: "",
      studentId: "",
      studentName: "",
      benefactorId: "",
      benefactorName: "",
      amount: "",
      date: "",
    });
    setEditingScholarship(null);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const totalAmount = scholarships.reduce((sum, s) => sum + s.amount, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
              <Award className="h-8 w-8 text-cyan-600" />
              Scholarship Management
            </h1>
            <p className="text-slate-600 mt-1">
              Manage scholarship records for students
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="destructive" 
              onClick={handleDeleteAll}
              className="bg-red-600 hover:bg-red-700"
            >
              <AlertTriangle className="mr-2 h-4 w-4" />
              Delete All
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className="bg-cyan-600 hover:bg-cyan-700"
                  onClick={() => resetForm()}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Scholarship
                </Button>
              </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingScholarship ? "Edit Scholarship" : "Add New Scholarship"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="className">Class *</Label>
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
                        {classes.map((cls) => (
                          <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="amount">Amount (₨) *</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="e.g., 50000"
                      value={formData.amount}
                      onChange={(e) =>
                        setFormData({ ...formData, amount: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="studentId">Student ID *</Label>
                    <Input
                      id="studentId"
                      placeholder="e.g., STU-2025-101"
                      value={formData.studentId}
                      onChange={(e) =>
                        setFormData({ ...formData, studentId: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="studentName">Student Name *</Label>
                    <Input
                      id="studentName"
                      placeholder="e.g., Ahmed Ali"
                      value={formData.studentName}
                      onChange={(e) =>
                        setFormData({ ...formData, studentName: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="benefactorId">Benefactor ID *</Label>
                    <Input
                      id="benefactorId"
                      placeholder="e.g., BEN-2025-001"
                      value={formData.benefactorId}
                      onChange={(e) =>
                        setFormData({ ...formData, benefactorId: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="benefactorName">Benefactor Name *</Label>
                    <Input
                      id="benefactorName"
                      placeholder="e.g., Muhammad Hassan"
                      value={formData.benefactorName}
                      onChange={(e) =>
                        setFormData({ ...formData, benefactorName: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="date">Date *</Label>
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

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-cyan-600 hover:bg-cyan-700"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : editingScholarship ? "Update Scholarship" : "Add Scholarship"}
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
            <CardTitle>All Scholarships</CardTitle>
            <div className="flex items-center gap-4 mt-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Search by student ID, benefactor ID, or class..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredScholarships.length === 0 ? (
              <div className="text-center py-12">
                <Award className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  No Scholarships Found
                </h3>
                <p className="text-slate-600 mb-4">
                  {searchTerm
                    ? "No scholarships match your search."
                    : "Get started by adding your first scholarship."}
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
                      <TableHead>Class</TableHead>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Benefactor ID</TableHead>
                      <TableHead>Benefactor Name</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredScholarships.map((scholarship) => (
                      <TableRow key={scholarship._id}>
                        <TableCell className="font-medium">
                          {scholarship.className}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {scholarship.studentId}
                        </TableCell>
                        <TableCell>
                          {scholarship.studentName}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {scholarship.benefactorId}
                        </TableCell>
                        <TableCell>
                          {scholarship.benefactorName}
                        </TableCell>
                        <TableCell className="font-semibold text-green-600">
                          ₨{scholarship.amount.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(scholarship)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(scholarship._id)}
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

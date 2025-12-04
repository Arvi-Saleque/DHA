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
  DollarSign,
  Plus,
  Search,
  Edit,
  Trash2,
  FileText,
} from "lucide-react";

interface AdmissionFee {
  _id: string;
  className: string;
  admissionFee: number;
  tuitionFee: number;
  examFee: number;
  otherFees: number;
  isActive: boolean;
  createdAt: string;
}

export default function AdmissionFeeManagement() {
  const [fees, setFees] = useState<AdmissionFee[]>([]);
  const [filteredFees, setFilteredFees] = useState<AdmissionFee[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFee, setEditingFee] = useState<AdmissionFee | null>(null);
  const [loading, setLoading] = useState(false);

  const classes = ['Play Group', 'Nursery', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7'];

  const [formData, setFormData] = useState({
    className: "",
    admissionFee: "",
    tuitionFee: "",
    examFee: "",
    otherFees: "",
  });

  useEffect(() => {
    fetchFees();
  }, []);

  useEffect(() => {
    const filtered = fees.filter((fee) =>
      fee.className.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredFees(filtered);
  }, [searchTerm, fees]);

  const fetchFees = async () => {
    try {
      const response = await fetch("/api/admission-fee");
      const data = await response.json();
      setFees(data);
      setFilteredFees(data);
    } catch (error) {
      console.error("Error fetching fees:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = "/api/admission-fee";
      const method = editingFee ? "PUT" : "POST";
      const body = editingFee
        ? { 
            ...formData, 
            _id: editingFee._id,
            admissionFee: Number(formData.admissionFee),
            tuitionFee: Number(formData.tuitionFee),
            examFee: Number(formData.examFee),
            otherFees: Number(formData.otherFees) || 0,
          }
        : { 
            ...formData,
            admissionFee: Number(formData.admissionFee),
            tuitionFee: Number(formData.tuitionFee),
            examFee: Number(formData.examFee),
            otherFees: Number(formData.otherFees) || 0,
          };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        await fetchFees();
        setIsDialogOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error("Error saving fee:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (fee: AdmissionFee) => {
    setEditingFee(fee);
    setFormData({
      className: fee.className,
      admissionFee: fee.admissionFee.toString(),
      tuitionFee: fee.tuitionFee.toString(),
      examFee: fee.examFee.toString(),
      otherFees: fee.otherFees.toString(),
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this fee record?")) return;

    try {
      const response = await fetch(`/api/admission-fee?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchFees();
      }
    } catch (error) {
      console.error("Error deleting fee:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      className: "",
      admissionFee: "",
      tuitionFee: "",
      examFee: "",
      otherFees: "",
    });
    setEditingFee(null);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const totalAdmissionFees = fees.reduce((sum, f) => sum + f.admissionFee, 0);
  const totalTuitionFees = fees.reduce((sum, f) => sum + f.tuitionFee, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
              <DollarSign className="h-8 w-8 text-cyan-600" />
              Admission & Tuition Fee Management
            </h1>
            <p className="text-slate-600 mt-1">
              Manage fee structure for all classes
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-cyan-600 hover:bg-cyan-700"
                onClick={() => resetForm()}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Fee Structure
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingFee ? "Edit Fee Structure" : "Add New Fee Structure"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="admissionFee">Admission Fee (₨) *</Label>
                    <Input
                      id="admissionFee"
                      type="number"
                      placeholder="e.g., 5000"
                      value={formData.admissionFee}
                      onChange={(e) =>
                        setFormData({ ...formData, admissionFee: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="tuitionFee">Monthly Tuition Fee (₨) *</Label>
                    <Input
                      id="tuitionFee"
                      type="number"
                      placeholder="e.g., 3000"
                      value={formData.tuitionFee}
                      onChange={(e) =>
                        setFormData({ ...formData, tuitionFee: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="examFee">Exam Fee (₨) *</Label>
                    <Input
                      id="examFee"
                      type="number"
                      placeholder="e.g., 1000"
                      value={formData.examFee}
                      onChange={(e) =>
                        setFormData({ ...formData, examFee: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="otherFees">Other Fees (₨)</Label>
                    <Input
                      id="otherFees"
                      type="number"
                      placeholder="e.g., 500 (optional)"
                      value={formData.otherFees}
                      onChange={(e) =>
                        setFormData({ ...formData, otherFees: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-cyan-600 hover:bg-cyan-700"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : editingFee ? "Update Fee Structure" : "Add Fee Structure"}
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

        {/* Search and Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Fee Structures</CardTitle>
            <div className="flex items-center gap-4 mt-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Search by class..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredFees.length === 0 ? (
              <div className="text-center py-12">
                <DollarSign className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  No Fee Structures Found
                </h3>
                <p className="text-slate-600 mb-4">
                  {searchTerm
                    ? "No fee structures match your search."
                    : "Get started by adding your first fee structure."}
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
                      <TableHead>Admission Fee</TableHead>
                      <TableHead>Monthly Tuition</TableHead>
                      <TableHead>Exam Fee</TableHead>
                      <TableHead>Other Fees</TableHead>
                      <TableHead>Total (Annual)</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFees.map((fee) => {
                      const annualTotal = fee.admissionFee + (fee.tuitionFee * 12) + fee.examFee + fee.otherFees;
                      return (
                        <TableRow key={fee._id}>
                          <TableCell className="font-medium">
                            {fee.className}
                          </TableCell>
                          <TableCell className="font-semibold text-cyan-600">
                            ₨{fee.admissionFee.toLocaleString()}
                          </TableCell>
                          <TableCell className="font-semibold text-green-600">
                            ₨{fee.tuitionFee.toLocaleString()}
                          </TableCell>
                          <TableCell className="font-semibold text-blue-600">
                            ₨{fee.examFee.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-slate-600">
                            ₨{fee.otherFees.toLocaleString()}
                          </TableCell>
                          <TableCell className="font-bold text-slate-900">
                            ₨{annualTotal.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(fee)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(fee._id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
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

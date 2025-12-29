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
  DialogDescription,
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
  FileText,
  Plus,
  Pencil,
  Trash2,
  Search,
} from "lucide-react";
import PdfUploader from "@/components/common/PdfUploader";

interface ExamResult {
  _id: string;
  className: string;
  examName: string;
  pdfUrl: string;
  totalPages?: number;
  passPercentage: number;
}

const classes = ['Play Group', 'Nursery', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7'];

export default function ExamResultsAdminPage() {
  const [results, setResults] = useState<ExamResult[]>([]);
  const [filteredResults, setFilteredResults] = useState<ExamResult[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingResult, setEditingResult] = useState<ExamResult | null>(null);
  const [formData, setFormData] = useState({
    className: '',
    examName: '',
    pdfUrl: '',
    totalPages: 15,
    passPercentage: '',
  });

  useEffect(() => {
    fetchResults();
  }, []);

  useEffect(() => {
    const filtered = results.filter((result) =>
      result.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.examName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredResults(filtered);
  }, [searchTerm, results]);

  const fetchResults = async () => {
    try {
      const response = await fetch('/api/exam-results');
      const data = await response.json();
      setResults(data);
      setFilteredResults(data);
    } catch (error) {
      console.error('Error fetching results:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const resultData = {
      className: formData.className,
      examName: formData.examName,
      pdfUrl: formData.pdfUrl,
      totalPages: formData.totalPages,
      passPercentage: Number(formData.passPercentage),
    };

    console.log('Submitting exam result data:', resultData);

    try {
      if (editingResult) {
        await fetch('/api/exam-results', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...resultData, id: editingResult._id }),
        });
      } else {
        await fetch('/api/exam-results', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(resultData),
        });
      }
      
      fetchResults();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving exam result:', error);
    }
  };

  const handleEdit = (result: ExamResult) => {
    setEditingResult(result);
    setFormData({
      className: result.className,
      examName: result.examName,
      pdfUrl: result.pdfUrl,
      totalPages: result.totalPages || 15,
      passPercentage: result.passPercentage.toString(),
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this exam result?')) {
      try {
        await fetch(`/api/exam-results?id=${id}`, { method: 'DELETE' });
        fetchResults();
      } catch (error) {
        console.error('Error deleting result:', error);
      }
    }
  };

  const handleDeleteAll = async () => {
    if (confirm('⚠️ Are you sure you want to delete ALL exam results?')) {
      if (confirm('This action cannot be undone. Delete all exam results?')) {
        try {
          await fetch('/api/exam-results/delete-all', { method: 'DELETE' });
          fetchResults();
        } catch (error) {
          console.error('Error deleting all results:', error);
        }
      }
    }
  };

  const resetForm = () => {
    setFormData({
      className: '',
      examName: '',
      pdfUrl: '',
      totalPages: 15,
      passPercentage: '',
    });
    setEditingResult(null);
  };

  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      resetForm();
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Exam Results Management</h1>
        <div className="flex gap-2">
          {results.length > 0 && (
            <Button
              variant="destructive"
              onClick={handleDeleteAll}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete All
            </Button>
          )}
        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Exam Result
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingResult ? 'Edit Exam Result' : 'Add New Exam Result'}</DialogTitle>
              <DialogDescription>
                Upload exam results with pass percentage information
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="className">Class</Label>
                  <Select
                    value={formData.className}
                    onValueChange={(value) =>
                      setFormData({ ...formData, className: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((cls) => (
                        <SelectItem key={cls} value={cls}>
                          {cls}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="examName">Exam Name</Label>
                  <Input
                    id="examName"
                    placeholder="e.g., Midterm Examination 2025"
                    value={formData.examName}
                    onChange={(e) =>
                      setFormData({ ...formData, examName: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <PdfUploader
                    label="Exam Result PDF"
                    value={formData.pdfUrl}
                    onChange={(url) => setFormData({ ...formData, pdfUrl: url })}
                    folder="exam-results"
                  />
                </div>

                <div>
                  <Label htmlFor="totalPages">Total Pages (for PDF viewer)</Label>
                  <Input
                    id="totalPages"
                    type="number"
                    min="1"
                    value={formData.totalPages}
                    onChange={(e) => setFormData({ ...formData, totalPages: parseInt(e.target.value) || 15 })}
                    placeholder="Number of pages in PDF"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter the total number of pages in the PDF for proper navigation</p>
                </div>

                <div>
                  <Label htmlFor="passPercentage">Pass Percentage</Label>
                  <Input
                    id="passPercentage"
                    type="number"
                    min="0"
                    max="100"
                    placeholder="e.g., 92"
                    value={formData.passPercentage}
                    onChange={(e) =>
                      setFormData({ ...formData, passPercentage: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="flex gap-2 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-cyan-600 hover:bg-cyan-700"
                >
                  {editingResult ? 'Update' : 'Add'} Exam Result
                </Button>
                {editingResult && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleDialogClose(false)}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </DialogContent>
        </Dialog>
        </div>
        </div>

      <Card>
        <CardHeader>
          <CardTitle>Exam Results Overview</CardTitle>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by class or exam name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Class</TableHead>
                <TableHead>Exam Name</TableHead>
                <TableHead>Pass %</TableHead>
                <TableHead>PDF URL</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResults.map((result) => (
                <TableRow key={result._id}>
                  <TableCell className="font-medium">{result.className}</TableCell>
                  <TableCell>{result.examName}</TableCell>
                  <TableCell className="font-semibold text-green-600">
                    {result.passPercentage}%
                  </TableCell>
                  <TableCell>
                    <a 
                      href={result.pdfUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      View PDF
                    </a>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(result)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(result._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      </div>
    </DashboardLayout>
  );
}

'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/admin/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pencil, Trash2, Plus, Search, AlertTriangle, Calendar } from 'lucide-react';
import PdfUploader from '@/components/common/PdfUploader';

interface NextExam {
  _id: string;
  className: string;
  examName: string;
  pdfUrl: string;
  totalPages?: number;
  isActive: boolean;
}

const classes = ['Play Group', 'Nursery', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7'];

export default function NextExamManagement() {
  const [exams, setExams] = useState<NextExam[]>([]);
  const [filteredExams, setFilteredExams] = useState<NextExam[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<NextExam | null>(null);
  const [formData, setFormData] = useState({
    className: '',
    examName: '',
    pdfUrl: '',
    totalPages: 15,
  });

  useEffect(() => {
    fetchExams();
  }, []);

  useEffect(() => {
    const filtered = exams.filter((exam) =>
      exam.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.examName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredExams(filtered);
  }, [searchTerm, exams]);

  const fetchExams = async () => {
    try {
      const response = await fetch('/api/next-exams');
      const data = await response.json();
      if (data.success) {
        setExams(data.exams);
        setFilteredExams(data.exams);
      }
    } catch (error) {
      console.error('Error fetching exams:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const examData = {
      className: formData.className,
      examName: formData.examName,
      pdfUrl: formData.pdfUrl,
      totalPages: formData.totalPages,
    };

    try {
      if (editingExam) {
        await fetch(`/api/next-exams?id=${editingExam._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(examData),
        });
      } else {
        await fetch('/api/next-exams', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(examData),
        });
      }
      
      fetchExams();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving exam:', error);
    }
  };

  const handleEdit = (exam: NextExam) => {
    setEditingExam(exam);
    setFormData({
      className: exam.className,
      examName: exam.examName,
      pdfUrl: exam.pdfUrl,
      totalPages: exam.totalPages || 15,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this exam routine?')) {
      try {
        await fetch(`/api/next-exams?id=${id}`, { method: 'DELETE' });
        fetchExams();
      } catch (error) {
        console.error('Error deleting exam:', error);
      }
    }
  };

  const handleDeleteAll = async () => {
    if (confirm('⚠️ WARNING: This will delete ALL exam routine records. Are you sure?')) {
      if (confirm('This action cannot be undone. Do you really want to delete all exam routine records?')) {
        try {
          const response = await fetch('/api/next-exams', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ deleteAll: true }),
          });
          
          if (response.ok) {
            alert('All exam routine records deleted successfully');
            fetchExams();
          }
        } catch (error) {
          console.error('Error deleting all exams:', error);
          alert('Failed to delete all records');
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
    });
    setEditingExam(null);
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
        <h1 className="text-3xl font-bold">Next Exam Routine Management</h1>
        <div className="flex gap-2">
          <Button 
            variant="destructive" 
            onClick={handleDeleteAll}
            className="bg-red-600 hover:bg-red-700"
          >
            <AlertTriangle className="mr-2 h-4 w-4" />
            Delete All
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Exam Routine
              </Button>
            </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingExam ? 'Edit Exam Routine' : 'Add New Exam Routine'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="className">Class</Label>
                <Select
                  value={formData.className}
                  onValueChange={(value) => setFormData({ ...formData, className: value })}
                  required
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
                  value={formData.examName}
                  onChange={(e) => setFormData({ ...formData, examName: e.target.value })}
                  placeholder="e.g., First Terminal Exam, Mid-Term Exam"
                  required
                />
              </div>

              <div>
                <PdfUploader
                  label="Exam Routine PDF"
                  value={formData.pdfUrl}
                  onChange={(url, pages) => setFormData({ ...formData, pdfUrl: url, totalPages: pages || formData.totalPages })}
                  folder="next-exam"
                />
              </div>

              <div>
                <Label htmlFor="totalPages">Total Pages</Label>
                <Input
                  id="totalPages"
                  type="number"
                  min="1"
                  value={formData.totalPages}
                  onChange={(e) => setFormData({ ...formData, totalPages: parseInt(e.target.value) || 15 })}
                  placeholder="Enter total number of pages"
                  required
                />
                <p className="text-sm text-slate-500 mt-1">
                  Number of pages in the PDF for proper viewer display
                </p>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => handleDialogClose(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingExam ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-6 w-6 text-cyan-600" />
            Exam Routine Overview
          </CardTitle>
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
                <TableHead>PDF URL</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExams.map((exam) => (
                <TableRow key={exam._id}>
                  <TableCell className="font-medium">{exam.className}</TableCell>
                  <TableCell>{exam.examName}</TableCell>
                  <TableCell>
                    <a 
                      href={exam.pdfUrl} 
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
                        onClick={() => handleEdit(exam)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(exam._id)}
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

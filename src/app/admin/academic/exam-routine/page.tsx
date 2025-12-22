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
import { Pencil, Trash2, Plus, Search } from 'lucide-react';
import PdfUploader from '@/components/common/PdfUploader';

interface ExamRoutine {
  _id: string;
  className: string;
  examName: string;
  pdfUrl: string;
  isActive: boolean;
}

const classes = ['Play Group', 'Nursery', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7'];

export default function ExamRoutineManagement() {
  const [examRoutines, setExamRoutines] = useState<ExamRoutine[]>([]);
  const [filteredExamRoutines, setFilteredExamRoutines] = useState<ExamRoutine[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExamRoutine, setEditingExamRoutine] = useState<ExamRoutine | null>(null);
  const [formData, setFormData] = useState({
    className: '',
    examName: '',
    pdfUrl: '',
  });

  useEffect(() => {
    fetchExamRoutines();
  }, []);

  useEffect(() => {
    const filtered = examRoutines.filter((exam) =>
      exam.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.examName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredExamRoutines(filtered);
  }, [searchTerm, examRoutines]);

  const fetchExamRoutines = async () => {
    try {
      const response = await fetch('/api/exam-routine');
      const data = await response.json();
      setExamRoutines(data);
      setFilteredExamRoutines(data);
    } catch (error) {
      console.error('Error fetching exam routines:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const examRoutineData = {
      className: formData.className,
      examName: formData.examName,
      pdfUrl: formData.pdfUrl,
    };

    try {
      if (editingExamRoutine) {
        await fetch('/api/exam-routine', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...examRoutineData, _id: editingExamRoutine._id }),
        });
      } else {
        await fetch('/api/exam-routine', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(examRoutineData),
        });
      }
      
      fetchExamRoutines();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving exam routine:', error);
    }
  };

  const handleEdit = (examRoutine: ExamRoutine) => {
    setEditingExamRoutine(examRoutine);
    setFormData({
      className: examRoutine.className,
      examName: examRoutine.examName,
      pdfUrl: examRoutine.pdfUrl,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this exam routine?')) {
      try {
        await fetch(`/api/exam-routine?id=${id}`, { method: 'DELETE' });
        fetchExamRoutines();
      } catch (error) {
        console.error('Error deleting exam routine:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      className: '',
      examName: '',
      pdfUrl: '',
    });
    setEditingExamRoutine(null);
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
        <h1 className="text-3xl font-bold">Exam Routine Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Exam Routine
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingExamRoutine ? 'Edit Exam Routine' : 'Add New Exam Routine'}</DialogTitle>
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
                  placeholder="e.g., Midterm Examination 2025, Final Exam"
                  required
                />
              </div>

              <div>
                <PdfUploader
                  label="Exam Routine PDF"
                  value={formData.pdfUrl}
                  onChange={(url) => setFormData({ ...formData, pdfUrl: url })}
                  folder="exam-routines"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => handleDialogClose(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingExamRoutine ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Exam Routine Overview</CardTitle>
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
              {filteredExamRoutines.map((exam) => (
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

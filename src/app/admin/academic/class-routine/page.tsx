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
import { Pencil, Trash2, Plus, Search, AlertTriangle } from 'lucide-react';
import PdfUploader from '@/components/common/PdfUploader';

interface ClassRoutine {
  _id: string;
  className: string;
  routineName: string;
  pdfUrl: string;
  totalPages?: number;
  isActive: boolean;
}

const classes = ['Play Group', 'Nursery', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7'];

export default function ClassRoutineManagement() {
  const [classRoutines, setClassRoutines] = useState<ClassRoutine[]>([]);
  const [filteredClassRoutines, setFilteredClassRoutines] = useState<ClassRoutine[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClassRoutine, setEditingClassRoutine] = useState<ClassRoutine | null>(null);
  const [formData, setFormData] = useState({
    className: '',
    routineName: '',
    pdfUrl: '',
    totalPages: 15,
  });

  useEffect(() => {
    fetchClassRoutines();
  }, []);

  useEffect(() => {
    const filtered = classRoutines.filter((routine) =>
      routine.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
      routine.routineName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredClassRoutines(filtered);
  }, [searchTerm, classRoutines]);

  const fetchClassRoutines = async () => {
    try {
      const response = await fetch('/api/class-routine');
      const data = await response.json();
      setClassRoutines(data);
      setFilteredClassRoutines(data);
    } catch (error) {
      console.error('Error fetching class routines:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const classRoutineData = {
      className: formData.className,
      routineName: formData.routineName,
      pdfUrl: formData.pdfUrl,
      totalPages: formData.totalPages,
    };

    try {
      if (editingClassRoutine) {
        await fetch('/api/class-routine', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...classRoutineData, _id: editingClassRoutine._id }),
        });
      } else {
        await fetch('/api/class-routine', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(classRoutineData),
        });
      }
      
      fetchClassRoutines();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving class routine:', error);
    }
  };

  const handleEdit = (classRoutine: ClassRoutine) => {
    setEditingClassRoutine(classRoutine);
    setFormData({
      className: classRoutine.className,
      routineName: classRoutine.routineName,
      pdfUrl: classRoutine.pdfUrl,
      totalPages: classRoutine.totalPages || 15,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this class routine?')) {
      try {
        await fetch(`/api/class-routine?id=${id}`, { method: 'DELETE' });
        fetchClassRoutines();
      } catch (error) {
        console.error('Error deleting class routine:', error);
      }
    }
  };

  const handleDeleteAll = async () => {
    if (confirm('⚠️ WARNING: This will delete ALL class routine records. Are you sure?')) {
      if (confirm('This action cannot be undone. Do you really want to delete all class routine records?')) {
        try {
          const response = await fetch('/api/class-routine', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ deleteAll: true }),
          });
          
          if (response.ok) {
            alert('All class routine records deleted successfully');
            fetchClassRoutines();
          }
        } catch (error) {
          console.error('Error deleting all class routines:', error);
          alert('Failed to delete all records');
        }
      }
    }
  };

  const resetForm = () => {
    setFormData({
      className: '',
      routineName: '',
      pdfUrl: '',
      totalPages: 15,
    });
    setEditingClassRoutine(null);
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
          <h1 className="text-3xl font-bold">Class Routine Management</h1>
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
              Add Class Routine
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingClassRoutine ? 'Edit Class Routine' : 'Add New Class Routine'}</DialogTitle>
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
                <Label htmlFor="routineName">Routine Name</Label>
                <Input
                  id="routineName"
                  value={formData.routineName}
                  onChange={(e) => setFormData({ ...formData, routineName: e.target.value })}
                  placeholder="e.g., Weekly Schedule, Fall 2025 Routine"
                  required
                />
              </div>

              <div>
                <PdfUploader
                  label="Class Routine PDF"
                  value={formData.pdfUrl}
                  onChange={(url) => setFormData({ ...formData, pdfUrl: url })}
                  folder="class-routines"
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

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => handleDialogClose(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingClassRoutine ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
          </div>
        </div>

        <Card>
        <CardHeader>
          <CardTitle>Class Routine Overview</CardTitle>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by class or routine name..."
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
                <TableHead>Routine Name</TableHead>
                <TableHead>PDF URL</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClassRoutines.map((routine) => (
                <TableRow key={routine._id}>
                  <TableCell className="font-medium">{routine.className}</TableCell>
                  <TableCell>{routine.routineName}</TableCell>
                  <TableCell>
                    <a 
                      href={routine.pdfUrl} 
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
                        onClick={() => handleEdit(routine)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(routine._id)}
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

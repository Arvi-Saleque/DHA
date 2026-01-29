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

interface Syllabus {
  _id: string;
  className: string;
  subject: string;
  pdfUrl: string;
  totalPages?: number;
  isActive: boolean;
}

const classes = ['Play Group', 'Nursery', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7'];

export default function SyllabusManagement() {
  const [syllabuses, setSyllabuses] = useState<Syllabus[]>([]);
  const [filteredSyllabuses, setFilteredSyllabuses] = useState<Syllabus[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSyllabus, setEditingSyllabus] = useState<Syllabus | null>(null);
  const [formData, setFormData] = useState({
    className: '',
    subject: '',
    pdfUrl: '',
    totalPages: 15,
  });

  useEffect(() => {
    fetchSyllabuses();
  }, []);

  useEffect(() => {
    const filtered = syllabuses.filter((syllabus) =>
      syllabus.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
      syllabus.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSyllabuses(filtered);
  }, [searchTerm, syllabuses]);

  const fetchSyllabuses = async () => {
    try {
      const response = await fetch('/api/syllabus');
      const data = await response.json();
      setSyllabuses(data);
      setFilteredSyllabuses(data);
    } catch (error) {
      console.error('Error fetching syllabuses:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const syllabusData = {
      className: formData.className,
      subject: formData.subject,
      pdfUrl: formData.pdfUrl,
      totalPages: formData.totalPages,
    };

    try {
      if (editingSyllabus) {
        await fetch('/api/syllabus', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...syllabusData, _id: editingSyllabus._id }),
        });
      } else {
        await fetch('/api/syllabus', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(syllabusData),
        });
      }
      
      fetchSyllabuses();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving syllabus:', error);
    }
  };

  const handleEdit = (syllabus: Syllabus) => {
    setEditingSyllabus(syllabus);
    setFormData({
      className: syllabus.className,
      subject: syllabus.subject,
      pdfUrl: syllabus.pdfUrl,
      totalPages: syllabus.totalPages || 15,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this syllabus?')) {
      try {
        await fetch(`/api/syllabus?id=${id}`, { method: 'DELETE' });
        fetchSyllabuses();
      } catch (error) {
        console.error('Error deleting syllabus:', error);
      }
    }
  };

  const handleDeleteAll = async () => {
    if (confirm('⚠️ WARNING: This will delete ALL syllabus records. Are you sure?')) {
      if (confirm('This action cannot be undone. Do you really want to delete all syllabus records?')) {
        try {
          const response = await fetch('/api/syllabus', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ deleteAll: true }),
          });
          
          if (response.ok) {
            alert('All syllabus records deleted successfully');
            fetchSyllabuses();
          }
        } catch (error) {
          console.error('Error deleting all syllabuses:', error);
          alert('Failed to delete all records');
        }
      }
    }
  };

  const resetForm = () => {
    setFormData({
      className: '',
      subject: '',
      pdfUrl: '',
      totalPages: 15,
    });
    setEditingSyllabus(null);
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
        <h1 className="text-3xl font-bold">Syllabus Management</h1>
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
                Add Syllabus
              </Button>
            </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingSyllabus ? 'Edit Syllabus' : 'Add New Syllabus'}</DialogTitle>
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
                <Label htmlFor="subject">Subject Name</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g., Quran & Tajweed, Arabic Language"
                  required
                />
              </div>

              <div>
                <PdfUploader
                  label="Syllabus PDF"
                  value={formData.pdfUrl}
                  onChange={(url, pages) => setFormData({ ...formData, pdfUrl: url, totalPages: pages || formData.totalPages })}
                  folder="syllabus"
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
                  {editingSyllabus ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Syllabus Overview</CardTitle>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by class or subject..."
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
                <TableHead>Subject Name</TableHead>
                <TableHead>PDF URL</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSyllabuses.map((syllabus) => (
                <TableRow key={syllabus._id}>
                  <TableCell className="font-medium">{syllabus.className}</TableCell>
                  <TableCell>{syllabus.subject}</TableCell>
                  <TableCell>
                    <a 
                      href={syllabus.pdfUrl} 
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
                        onClick={() => handleEdit(syllabus)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(syllabus._id)}
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

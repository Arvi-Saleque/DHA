'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/admin/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pencil, Trash2, Plus, Search } from 'lucide-react';
import PdfUploader from '@/components/common/PdfUploader';

interface Curriculum {
  _id: string;
  category: string;
  pdfUrl: string;
  totalPages?: number;
}

const CATEGORIES = ['Pre Hifz', 'Hifz', 'Post Hifz'];

export default function CurriculumManagement() {
  const [curriculums, setCurriculums] = useState<Curriculum[]>([]);
  const [filteredCurriculums, setFilteredCurriculums] = useState<Curriculum[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCurriculum, setEditingCurriculum] = useState<Curriculum | null>(null);
  const [formData, setFormData] = useState({
    category: '',
    pdfUrl: '',
    totalPages: 15,
  });

  useEffect(() => {
    fetchCurriculums();
  }, []);

  useEffect(() => {
    const filtered = curriculums.filter((curriculum) =>
      curriculum.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCurriculums(filtered);
  }, [searchTerm, curriculums]);

  const fetchCurriculums = async () => {
    try {
      const response = await fetch('/api/curriculum');
      const data = await response.json();
      setCurriculums(data);
      setFilteredCurriculums(data);
    } catch (error) {
      console.error('Error fetching curriculums:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const curriculumData = {
      category: formData.category,
      pdfUrl: formData.pdfUrl,
      totalPages: formData.totalPages,
    };

    try {
      if (editingCurriculum) {
        await fetch('/api/curriculum', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...curriculumData, _id: editingCurriculum._id }),
        });
      } else {
        await fetch('/api/curriculum', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(curriculumData),
        });
      }
      
      fetchCurriculums();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving curriculum:', error);
    }
  };

  const handleEdit = (curriculum: Curriculum) => {
    setEditingCurriculum(curriculum);
    setFormData({
      category: curriculum.category,
      pdfUrl: curriculum.pdfUrl,
      totalPages: curriculum.totalPages || 15,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this curriculum?')) {
      try {
        await fetch(`/api/curriculum?id=${id}`, { method: 'DELETE' });
        fetchCurriculums();
      } catch (error) {
        console.error('Error deleting curriculum:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      category: '',
      pdfUrl: '',
      totalPages: 15,
    });
    setEditingCurriculum(null);
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
        <h1 className="text-3xl font-bold">Curriculum Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Curriculum
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingCurriculum ? 'Edit Curriculum' : 'Add New Curriculum'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <PdfUploader
                  label="Curriculum PDF"
                  value={formData.pdfUrl}
                  onChange={(url) => setFormData({ ...formData, pdfUrl: url })}
                  folder="curriculum"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Total Pages
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={formData.totalPages}
                  onChange={(e) => setFormData({ ...formData, totalPages: parseInt(e.target.value) || 15 })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter total number of pages"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Number of pages in the PDF (required for flipbook viewer)
                </p>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => handleDialogClose(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingCurriculum ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Curriculum Overview</CardTitle>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by category..."
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
                <TableHead>Category</TableHead>
                <TableHead>PDF URL</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCurriculums.map((curriculum) => (
                <TableRow key={curriculum._id}>
                  <TableCell className="font-medium">
                    <Badge variant="outline" className="text-base">
                      {curriculum.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <a 
                      href={curriculum.pdfUrl} 
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
                        onClick={() => handleEdit(curriculum)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(curriculum._id)}
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

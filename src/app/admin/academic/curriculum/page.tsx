'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/admin/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pencil, Trash2, Plus, Search } from 'lucide-react';
import PdfUploader from '@/components/common/PdfUploader';

interface Curriculum {
  _id: string;
  className: string;
  title: string;
  points: string[];
  pdfUrl: string;
  isActive: boolean;
}

const classes = ['Play Group', 'Nursery', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7'];

export default function CurriculumManagement() {
  const [curriculums, setCurriculums] = useState<Curriculum[]>([]);
  const [filteredCurriculums, setFilteredCurriculums] = useState<Curriculum[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCurriculum, setEditingCurriculum] = useState<Curriculum | null>(null);
  const [formData, setFormData] = useState({
    className: '',
    title: '',
    points: '',
    pdfUrl: '',
  });

  useEffect(() => {
    fetchCurriculums();
  }, []);

  useEffect(() => {
    const filtered = curriculums.filter((curriculum) =>
      curriculum.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
      curriculum.title.toLowerCase().includes(searchTerm.toLowerCase())
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
    
    const pointsArray = formData.points
      .split('\n')
      .map(p => p.trim())
      .filter(p => p.length > 0);

    const curriculumData = {
      className: formData.className,
      title: formData.title,
      points: pointsArray,
      pdfUrl: formData.pdfUrl,
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
      className: curriculum.className,
      title: curriculum.title,
      points: curriculum.points.join('\n'),
      pdfUrl: curriculum.pdfUrl,
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
      className: '',
      title: '',
      points: '',
      pdfUrl: '',
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
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Core Subjects & Enrichment"
                  required
                />
              </div>

              <div>
                <Label htmlFor="points">Key Points (one per line)</Label>
                <Textarea
                  id="points"
                  value={formData.points}
                  onChange={(e) => setFormData({ ...formData, points: e.target.value })}
                  placeholder="Enter key points, one per line"
                  rows={6}
                  required
                />
              </div>

              <div>
                <PdfUploader
                  label="Curriculum PDF"
                  value={formData.pdfUrl}
                  onChange={(url) => setFormData({ ...formData, pdfUrl: url })}
                  folder="curriculum"
                />
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
              placeholder="Search by class or title..."
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
                <TableHead>Title</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>PDF URL</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCurriculums.map((curriculum) => (
                <TableRow key={curriculum._id}>
                  <TableCell className="font-medium">{curriculum.className}</TableCell>
                  <TableCell>{curriculum.title}</TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      {curriculum.points.slice(0, 2).map((point, idx) => (
                        <div key={idx} className="text-sm text-gray-600">• {point}</div>
                      ))}
                      {curriculum.points.length > 2 && (
                        <div className="text-sm text-gray-400">+{curriculum.points.length - 2} more</div>
                      )}
                    </div>
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

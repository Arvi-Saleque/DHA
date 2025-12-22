"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/admin/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, Save, GraduationCap, Users, Quote, ArrowUp, ArrowDown } from "lucide-react";
import ImageUploader from "@/components/common/ImageUploader";

interface Category {
  name: string;
  order: number;
}

interface Teacher {
  name: string;
  position: string;
  qualification: string;
  experience: string;
  specialization: string;
  imageUrl: string;
  email: string;
  phone: string;
  category: string;
  achievements: string[];
  order: number;
}

interface FacultyData {
  _id?: string;
  pageTitle: string;
  pageSubtitle: string;
  sectionTitle: string;
  sectionDescription: string;
  categories: Category[];
  teachers: Teacher[];
  quote: string;
  quoteAuthor: string;
}

export default function FacultyAdmin() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FacultyData>({
    pageTitle: "Our Distinguished Teachers",
    pageSubtitle: "Learn from experienced scholars dedicated to your success",
    sectionTitle: "Faculty Members",
    sectionDescription: "Dedicated educators combining traditional scholarship with modern teaching methods",
    categories: [],
    teachers: [],
    quote: "",
    quoteAuthor: "",
  });

  useEffect(() => {
    fetchFaculty();
  }, []);

  const fetchFaculty = async () => {
    try {
      const response = await fetch("/api/faculty");
      const result = await response.json();
      if (result.success && result.data) {
        setFormData(result.data);
      }
    } catch (error) {
      console.error("Error fetching faculty:", error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const url = "/api/faculty";
      const method = formData._id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        alert("Faculty data saved successfully!");
        fetchFaculty();
      } else {
        alert("Failed to save: " + result.error);
      }
    } catch (error) {
      console.error("Error saving faculty:", error);
      alert("Failed to save faculty");
    } finally {
      setLoading(false);
    }
  };

  // Category handlers
  const addCategory = () => {
    setFormData({
      ...formData,
      categories: [
        ...formData.categories,
        { name: "", order: formData.categories.length },
      ],
    });
  };

  const updateCategory = (index: number, field: keyof Category, value: any) => {
    const updatedCategories = [...formData.categories];
    updatedCategories[index] = { ...updatedCategories[index], [field]: value };
    setFormData({ ...formData, categories: updatedCategories });
  };

  const removeCategory = (index: number) => {
    const updatedCategories = formData.categories.filter((_, i) => i !== index);
    setFormData({ ...formData, categories: updatedCategories });
  };

  const moveCategoryUp = (index: number) => {
    if (index === 0) return;
    const updatedCategories = [...formData.categories];
    [updatedCategories[index - 1], updatedCategories[index]] = 
    [updatedCategories[index], updatedCategories[index - 1]];
    updatedCategories.forEach((cat, i) => cat.order = i);
    setFormData({ ...formData, categories: updatedCategories });
  };

  const moveCategoryDown = (index: number) => {
    if (index === formData.categories.length - 1) return;
    const updatedCategories = [...formData.categories];
    [updatedCategories[index], updatedCategories[index + 1]] = 
    [updatedCategories[index + 1], updatedCategories[index]];
    updatedCategories.forEach((cat, i) => cat.order = i);
    setFormData({ ...formData, categories: updatedCategories });
  };

  // Teacher handlers
  const addTeacher = () => {
    setFormData({
      ...formData,
      teachers: [
        ...formData.teachers,
        {
          name: "",
          position: "",
          qualification: "",
          experience: "",
          specialization: "",
          imageUrl: "",
          email: "",
          phone: "",
          category: formData.categories[0]?.name || "",
          achievements: [],
          order: formData.teachers.length,
        },
      ],
    });
  };

  const updateTeacher = (index: number, field: keyof Teacher, value: any) => {
    const updatedTeachers = [...formData.teachers];
    updatedTeachers[index] = { ...updatedTeachers[index], [field]: value };
    setFormData({ ...formData, teachers: updatedTeachers });
  };

  const removeTeacher = (index: number) => {
    const updatedTeachers = formData.teachers.filter((_, i) => i !== index);
    setFormData({ ...formData, teachers: updatedTeachers });
  };

  const addAchievement = (teacherIndex: number) => {
    const updatedTeachers = [...formData.teachers];
    updatedTeachers[teacherIndex].achievements.push("");
    setFormData({ ...formData, teachers: updatedTeachers });
  };

  const updateAchievement = (teacherIndex: number, achievementIndex: number, value: string) => {
    const updatedTeachers = [...formData.teachers];
    updatedTeachers[teacherIndex].achievements[achievementIndex] = value;
    setFormData({ ...formData, teachers: updatedTeachers });
  };

  const removeAchievement = (teacherIndex: number, achievementIndex: number) => {
    const updatedTeachers = [...formData.teachers];
    updatedTeachers[teacherIndex].achievements = updatedTeachers[teacherIndex].achievements.filter(
      (_, i) => i !== achievementIndex
    );
    setFormData({ ...formData, teachers: updatedTeachers });
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Faculty Management
          </h1>
          <p className="text-slate-600">
            Manage faculty page content, categories, and teacher profiles
          </p>
        </div>

      <Tabs defaultValue="page" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="page" className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            Page Settings
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Categories
          </TabsTrigger>
          <TabsTrigger value="teachers" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Teachers
          </TabsTrigger>
          <TabsTrigger value="quote" className="flex items-center gap-2">
            <Quote className="w-4 h-4" />
            Quote
          </TabsTrigger>
        </TabsList>

        {/* Page Settings Tab */}
        <TabsContent value="page">
          <Card>
            <CardHeader>
              <CardTitle>Page Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="pageTitle">Page Title *</Label>
                <Input
                  id="pageTitle"
                  value={formData.pageTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, pageTitle: e.target.value })
                  }
                  placeholder="e.g., Our Distinguished Teachers"
                />
              </div>

              <div>
                <Label htmlFor="pageSubtitle">Page Subtitle</Label>
                <Input
                  id="pageSubtitle"
                  value={formData.pageSubtitle}
                  onChange={(e) =>
                    setFormData({ ...formData, pageSubtitle: e.target.value })
                  }
                  placeholder="e.g., Learn from experienced scholars..."
                />
              </div>

              <div>
                <Label htmlFor="sectionTitle">Section Title *</Label>
                <Input
                  id="sectionTitle"
                  value={formData.sectionTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, sectionTitle: e.target.value })
                  }
                  placeholder="e.g., Faculty Members"
                />
              </div>

              <div>
                <Label htmlFor="sectionDescription">Section Description</Label>
                <Textarea
                  id="sectionDescription"
                  value={formData.sectionDescription}
                  onChange={(e) =>
                    setFormData({ ...formData, sectionDescription: e.target.value })
                  }
                  placeholder="Enter section description..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Category Tabs</CardTitle>
              <p className="text-sm text-slate-500">
                Add category tabs. Only filled categories will be shown on the page.
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <Label>Categories</Label>
                <Button
                  type="button"
                  onClick={addCategory}
                  size="sm"
                  variant="outline"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Category
                </Button>
              </div>

              <div className="space-y-3">
                {formData.categories.map((category, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <div className="flex flex-col gap-1">
                      <Button
                        type="button"
                        onClick={() => moveCategoryUp(index)}
                        size="sm"
                        variant="ghost"
                        disabled={index === 0}
                        className="h-5 px-1"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </Button>
                      <Button
                        type="button"
                        onClick={() => moveCategoryDown(index)}
                        size="sm"
                        variant="ghost"
                        disabled={index === formData.categories.length - 1}
                        className="h-5 px-1"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </Button>
                    </div>
                    <Input
                      value={category.name}
                      onChange={(e) => updateCategory(index, "name", e.target.value)}
                      placeholder={`Category ${index + 1} name`}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      onClick={() => removeCategory(index)}
                      size="sm"
                      variant="ghost"
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}

                {formData.categories.length === 0 && (
                  <p className="text-center text-slate-500 py-8">
                    No categories added yet. Click "Add Category" to create one.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Teachers Tab */}
        <TabsContent value="teachers">
          <Card>
            <CardHeader>
              <CardTitle>Faculty Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <Label>Teachers</Label>
                <Button
                  type="button"
                  onClick={addTeacher}
                  size="sm"
                  variant="outline"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Teacher
                </Button>
              </div>

              <div className="space-y-6">
                {formData.teachers.map((teacher, tIndex) => (
                  <Card key={tIndex} className="p-4 border-2">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-semibold text-sm">Teacher {tIndex + 1}</h4>
                      <Button
                        type="button"
                        onClick={() => removeTeacher(tIndex)}
                        size="sm"
                        variant="ghost"
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Name *</Label>
                        <Input
                          value={teacher.name}
                          onChange={(e) => updateTeacher(tIndex, "name", e.target.value)}
                          placeholder="Teacher name"
                        />
                      </div>

                      <div>
                        <Label>Position *</Label>
                        <Input
                          value={teacher.position}
                          onChange={(e) => updateTeacher(tIndex, "position", e.target.value)}
                          placeholder="e.g., Principal"
                        />
                      </div>

                      <div>
                        <Label>Qualification *</Label>
                        <Input
                          value={teacher.qualification}
                          onChange={(e) => updateTeacher(tIndex, "qualification", e.target.value)}
                          placeholder="e.g., Ph.D in Islamic Studies"
                        />
                      </div>

                      <div>
                        <Label>Experience *</Label>
                        <Input
                          value={teacher.experience}
                          onChange={(e) => updateTeacher(tIndex, "experience", e.target.value)}
                          placeholder="e.g., 25 years"
                        />
                      </div>

                      <div>
                        <Label>Specialization *</Label>
                        <Input
                          value={teacher.specialization}
                          onChange={(e) => updateTeacher(tIndex, "specialization", e.target.value)}
                          placeholder="e.g., Quranic Sciences"
                        />
                      </div>

                      <div>
                        <Label>Category *</Label>
                        <select
                          value={teacher.category}
                          onChange={(e) => updateTeacher(tIndex, "category", e.target.value)}
                          className="w-full px-3 py-2 border rounded-md"
                        >
                          <option value="">Select category</option>
                          {formData.categories.map((cat, i) => (
                            <option key={i} value={cat.name}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <ImageUploader
                          label="Teacher Photo"
                          value={teacher.imageUrl}
                          onChange={(url) => updateTeacher(tIndex, "imageUrl", url)}
                          folder="teachers"
                        />
                      </div>

                      <div>
                        <Label>Email</Label>
                        <Input
                          value={teacher.email}
                          onChange={(e) => updateTeacher(tIndex, "email", e.target.value)}
                          placeholder="email@example.com"
                        />
                      </div>

                      <div>
                        <Label>Phone</Label>
                        <Input
                          value={teacher.phone}
                          onChange={(e) => updateTeacher(tIndex, "phone", e.target.value)}
                          placeholder="+880 XXX XXX XXX"
                        />
                      </div>
                    </div>

                    {/* Achievements */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <Label>Achievements</Label>
                        <Button
                          type="button"
                          onClick={() => addAchievement(tIndex)}
                          size="sm"
                          variant="outline"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Add
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {teacher.achievements.map((achievement, aIndex) => (
                          <div key={aIndex} className="flex gap-2">
                            <Input
                              value={achievement}
                              onChange={(e) => updateAchievement(tIndex, aIndex, e.target.value)}
                              placeholder="Achievement"
                            />
                            <Button
                              type="button"
                              onClick={() => removeAchievement(tIndex, aIndex)}
                              size="sm"
                              variant="ghost"
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}

                {formData.teachers.length === 0 && (
                  <p className="text-center text-slate-500 py-8">
                    No teachers added yet. Click "Add Teacher" to create one.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Quote Tab */}
        <TabsContent value="quote">
          <Card>
            <CardHeader>
              <CardTitle>Inspirational Quote</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="quote">Quote</Label>
                <Textarea
                  id="quote"
                  value={formData.quote}
                  onChange={(e) =>
                    setFormData({ ...formData, quote: e.target.value })
                  }
                  placeholder="Enter inspirational quote..."
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="quoteAuthor">Quote Description</Label>
                <Input
                  id="quoteAuthor"
                  value={formData.quoteAuthor}
                  onChange={(e) =>
                    setFormData({ ...formData, quoteAuthor: e.target.value })
                  }
                  placeholder="e.g., Our educators are lifelong learners..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="mt-8 flex justify-end">
        <Button
          onClick={handleSave}
          disabled={loading}
          size="lg"
          className="bg-cyan-600 hover:bg-cyan-700"
        >
          <Save className="w-4 h-4 mr-2" />
          {loading ? "Saving..." : "Save All Changes"}
        </Button>
      </div>
      </div>
    </DashboardLayout>
  );
}

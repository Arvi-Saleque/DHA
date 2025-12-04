"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/admin/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Save, Plus, Trash2, GripVertical } from "lucide-react";

interface Item {
  title: string;
  description: string;
  icon: string;
  order: number;
}

interface AdmissionData {
  _id?: string;
  title: string;
  description: string;
  requirements: Item[];
  documents: Item[];
  admissionProcess: string;
  contactInfo: {
    phone: string;
    email: string;
    officeHours: string;
  };
}

const iconOptions = [
  "Users",
  "FileText",
  "ClipboardList",
  "FileCheck",
  "Image",
  "Award",
  "Calendar",
  "CheckCircle",
  "BookOpen",
  "GraduationCap",
  "Shield",
  "Star",
];

export default function AdmissionAdminPage() {
  const [data, setData] = useState<AdmissionData>({
    title: "Admission Information",
    description: "Join our institution and embark on a journey of excellence",
    requirements: [],
    documents: [],
    admissionProcess: "",
    contactInfo: {
      phone: "",
      email: "",
      officeHours: "",
    },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admission");
      if (res.ok) {
        const admissionData = await res.json();
        setData(admissionData);
      }
    } catch (error) {
      console.error("Error fetching admission data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await fetch("/api/admission", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        alert("Admission information updated successfully!");
        fetchData();
      } else {
        alert("Failed to update admission information");
      }
    } catch (error) {
      console.error("Error saving:", error);
      alert("Error saving admission information");
    } finally {
      setSaving(false);
    }
  };

  const addRequirement = () => {
    setData({
      ...data,
      requirements: [
        ...data.requirements,
        {
          title: "",
          description: "",
          icon: "Users",
          order: data.requirements.length + 1,
        },
      ],
    });
  };

  const removeRequirement = (index: number) => {
    const newRequirements = data.requirements.filter((_, i) => i !== index);
    setData({ ...data, requirements: newRequirements });
  };

  const updateRequirement = (index: number, field: keyof Item, value: string | number) => {
    const newRequirements = [...data.requirements];
    newRequirements[index] = { ...newRequirements[index], [field]: value };
    setData({ ...data, requirements: newRequirements });
  };

  const addDocument = () => {
    setData({
      ...data,
      documents: [
        ...data.documents,
        {
          title: "",
          description: "",
          icon: "FileCheck",
          order: data.documents.length + 1,
        },
      ],
    });
  };

  const removeDocument = (index: number) => {
    const newDocuments = data.documents.filter((_, i) => i !== index);
    setData({ ...data, documents: newDocuments });
  };

  const updateDocument = (index: number, field: keyof Item, value: string | number) => {
    const newDocuments = [...data.documents];
    newDocuments[index] = { ...newDocuments[index], [field]: value };
    setData({ ...data, documents: newDocuments });
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admission Management</h1>
          <p className="text-gray-600 mt-2">
            Manage admission requirements and documents
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="space-y-6">
        {/* General Information */}
        <Card>
          <CardHeader>
            <CardTitle>General Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Page Title</Label>
              <Input
                id="title"
                value={data.title}
                onChange={(e) => setData({ ...data, title: e.target.value })}
                placeholder="Admission Information"
              />
            </div>
            <div>
              <Label htmlFor="description">Page Description</Label>
              <Textarea
                id="description"
                value={data.description}
                onChange={(e) =>
                  setData({ ...data, description: e.target.value })
                }
                placeholder="Join our institution..."
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="process">Admission Process</Label>
              <Textarea
                id="process"
                value={data.admissionProcess}
                onChange={(e) =>
                  setData({ ...data, admissionProcess: e.target.value })
                }
                placeholder="Describe the admission process..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={data.contactInfo.phone}
                onChange={(e) =>
                  setData({
                    ...data,
                    contactInfo: { ...data.contactInfo, phone: e.target.value },
                  })
                }
                placeholder="+880 1234-567890"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={data.contactInfo.email}
                onChange={(e) =>
                  setData({
                    ...data,
                    contactInfo: { ...data.contactInfo, email: e.target.value },
                  })
                }
                placeholder="admission@example.com"
              />
            </div>
            <div>
              <Label htmlFor="hours">Office Hours</Label>
              <Input
                id="hours"
                value={data.contactInfo.officeHours}
                onChange={(e) =>
                  setData({
                    ...data,
                    contactInfo: {
                      ...data.contactInfo,
                      officeHours: e.target.value,
                    },
                  })
                }
                placeholder="Sat-Thu, 9AM-4PM"
              />
            </div>
          </CardContent>
        </Card>

        {/* Admission Requirements */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Admission Requirements</CardTitle>
            <Button onClick={addRequirement} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Requirement
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.requirements.map((req, index) => (
                <Card key={index} className="border-2">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="flex items-center gap-2 text-gray-400">
                        <GripVertical className="w-5 h-5" />
                        <Badge variant="outline">{index + 1}</Badge>
                      </div>
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <Label>Icon</Label>
                          <Select
                            value={req.icon}
                            onValueChange={(value) =>
                              updateRequirement(index, "icon", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {iconOptions.map((icon) => (
                                <SelectItem key={icon} value={icon}>
                                  {icon}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="md:col-span-3">
                          <Label>Title</Label>
                          <Input
                            value={req.title}
                            onChange={(e) =>
                              updateRequirement(index, "title", e.target.value)
                            }
                            placeholder="Requirement title"
                          />
                        </div>
                        <div className="md:col-span-4">
                          <Label>Description</Label>
                          <Textarea
                            value={req.description}
                            onChange={(e) =>
                              updateRequirement(
                                index,
                                "description",
                                e.target.value
                              )
                            }
                            placeholder="Requirement description"
                            rows={2}
                          />
                        </div>
                      </div>
                      <Button
                        onClick={() => removeRequirement(index)}
                        variant="ghost"
                        size="icon"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {data.requirements.length === 0 && (
                <p className="text-center text-gray-500 py-8">
                  No requirements added yet. Click "Add Requirement" to get started.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Required Documents */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Required Documents</CardTitle>
            <Button onClick={addDocument} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Document
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.documents.map((doc, index) => (
                <Card key={index} className="border-2">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="flex items-center gap-2 text-gray-400">
                        <GripVertical className="w-5 h-5" />
                        <Badge variant="outline">{index + 1}</Badge>
                      </div>
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <Label>Icon</Label>
                          <Select
                            value={doc.icon}
                            onValueChange={(value) =>
                              updateDocument(index, "icon", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {iconOptions.map((icon) => (
                                <SelectItem key={icon} value={icon}>
                                  {icon}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="md:col-span-3">
                          <Label>Title</Label>
                          <Input
                            value={doc.title}
                            onChange={(e) =>
                              updateDocument(index, "title", e.target.value)
                            }
                            placeholder="Document title"
                          />
                        </div>
                        <div className="md:col-span-4">
                          <Label>Description</Label>
                          <Textarea
                            value={doc.description}
                            onChange={(e) =>
                              updateDocument(
                                index,
                                "description",
                                e.target.value
                              )
                            }
                            placeholder="Document description"
                            rows={2}
                          />
                        </div>
                      </div>
                      <Button
                        onClick={() => removeDocument(index)}
                        variant="ghost"
                        size="icon"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {data.documents.length === 0 && (
                <p className="text-center text-gray-500 py-8">
                  No documents added yet. Click "Add Document" to get started.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </DashboardLayout>
  );
}

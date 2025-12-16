"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/admin/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Save, Target, Eye, CheckCircle2 } from "lucide-react";

// Available icons for mission and vision points
const availableIcons = [
  "BookOpen", "Heart", "Users", "Lightbulb", "Award", "TrendingUp", 
  "Target", "Eye", "Globe", "Star", "CheckCircle", "Shield", 
  "Zap", "Sparkles", "Compass", "Flag", "MessageCircle", "Clock"
];

// Color options for core values
const colorOptions = [
  { label: "Cyan", value: "bg-cyan-500" },
  { label: "Blue", value: "bg-blue-500" },
  { label: "Purple", value: "bg-purple-500" },
  { label: "Pink", value: "bg-pink-500" },
  { label: "Indigo", value: "bg-indigo-500" },
  { label: "Teal", value: "bg-teal-500" },
  { label: "Green", value: "bg-green-500" },
  { label: "Orange", value: "bg-orange-500" },
  { label: "Red", value: "bg-red-500" },
  { label: "Yellow", value: "bg-yellow-500" },
];

interface MissionPoint {
  icon: string;
  title: string;
  description: string;
}

interface VisionPoint {
  icon: string;
  title: string;
  description: string;
}

interface CoreValue {
  name: string;
  color: string;
}

interface MissionVisionData {
  _id?: string;
  missionTitle: string;
  missionDescription: string;
  missionImageUrl: string;
  missionPoints: MissionPoint[];
  visionTitle: string;
  visionDescription: string;
  visionImageUrl: string;
  visionPoints: VisionPoint[];
  coreValues: CoreValue[];
}

export default function MissionVisionAdmin() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<MissionVisionData>({
    missionTitle: "Our Mission",
    missionDescription: "",
    missionImageUrl: "",
    missionPoints: [],
    visionTitle: "Our Vision",
    visionDescription: "",
    visionImageUrl: "",
    visionPoints: [],
    coreValues: [],
  });

  useEffect(() => {
    fetchMissionVision();
  }, []);

  const fetchMissionVision = async () => {
    try {
      const response = await fetch("/api/mission-vision");
      const result = await response.json();
      if (result.success && result.data) {
        setFormData(result.data);
      }
    } catch (error) {
      console.error("Error fetching mission vision:", error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const url = "/api/mission-vision";
      const method = formData._id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        alert("Mission & Vision saved successfully!");
        fetchMissionVision();
      } else {
        alert("Failed to save: " + result.error);
      }
    } catch (error) {
      console.error("Error saving mission vision:", error);
      alert("Failed to save mission vision");
    } finally {
      setLoading(false);
    }
  };

  // Mission Points handlers
  const addMissionPoint = () => {
    setFormData({
      ...formData,
      missionPoints: [
        ...formData.missionPoints,
        { icon: "BookOpen", title: "", description: "" },
      ],
    });
  };

  const updateMissionPoint = (index: number, field: keyof MissionPoint, value: string) => {
    const updatedPoints = [...formData.missionPoints];
    updatedPoints[index] = { ...updatedPoints[index], [field]: value };
    setFormData({ ...formData, missionPoints: updatedPoints });
  };

  const removeMissionPoint = (index: number) => {
    const updatedPoints = formData.missionPoints.filter((_, i) => i !== index);
    setFormData({ ...formData, missionPoints: updatedPoints });
  };

  // Vision Points handlers
  const addVisionPoint = () => {
    setFormData({
      ...formData,
      visionPoints: [
        ...formData.visionPoints,
        { icon: "Eye", title: "", description: "" },
      ],
    });
  };

  const updateVisionPoint = (index: number, field: keyof VisionPoint, value: string) => {
    const updatedPoints = [...formData.visionPoints];
    updatedPoints[index] = { ...updatedPoints[index], [field]: value };
    setFormData({ ...formData, visionPoints: updatedPoints });
  };

  const removeVisionPoint = (index: number) => {
    const updatedPoints = formData.visionPoints.filter((_, i) => i !== index);
    setFormData({ ...formData, visionPoints: updatedPoints });
  };

  // Core Values handlers
  const addCoreValue = () => {
    setFormData({
      ...formData,
      coreValues: [
        ...formData.coreValues,
        { name: "", color: "bg-cyan-500" },
      ],
    });
  };

  const updateCoreValue = (index: number, field: keyof CoreValue, value: string) => {
    const updatedValues = [...formData.coreValues];
    updatedValues[index] = { ...updatedValues[index], [field]: value };
    setFormData({ ...formData, coreValues: updatedValues });
  };

  const removeCoreValue = (index: number) => {
    const updatedValues = formData.coreValues.filter((_, i) => i !== index);
    setFormData({ ...formData, coreValues: updatedValues });
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Mission & Vision Management
          </h1>
          <p className="text-slate-600">
            Manage mission, vision, and core values content
          </p>
        </div>

      <Tabs defaultValue="mission" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="mission" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Mission
          </TabsTrigger>
          <TabsTrigger value="vision" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Vision
          </TabsTrigger>
          <TabsTrigger value="values" className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Core Values
          </TabsTrigger>
        </TabsList>

        {/* Mission Tab */}
        <TabsContent value="mission">
          <Card>
            <CardHeader>
              <CardTitle>Mission Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="missionTitle">Mission Title</Label>
                <Input
                  id="missionTitle"
                  value={formData.missionTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, missionTitle: e.target.value })
                  }
                  placeholder="e.g., Our Mission"
                />
              </div>

              <div>
                <Label htmlFor="missionDescription">Mission Description</Label>
                <Textarea
                  id="missionDescription"
                  value={formData.missionDescription}
                  onChange={(e) =>
                    setFormData({ ...formData, missionDescription: e.target.value })
                  }
                  placeholder="Enter mission description..."
                  rows={4}
                />
                <p className="text-sm text-slate-500 mt-1">
                  Use \n for line breaks (e.g., Bengali text\nEnglish text)
                </p>
              </div>

              <div>
                <Label htmlFor="missionImageUrl">Mission Image URL</Label>
                <Input
                  id="missionImageUrl"
                  value={formData.missionImageUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, missionImageUrl: e.target.value })
                  }
                  placeholder="Use Unsplash URL or make Google Drive file public"
                />
                <p className="text-sm text-slate-500 mt-1">
                  For Google Drive: Share → Anyone with the link → Copy link
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <Label>Mission Points</Label>
                  <Button
                    type="button"
                    onClick={addMissionPoint}
                    size="sm"
                    variant="outline"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Point
                  </Button>
                </div>

                <div className="space-y-4">
                  {formData.missionPoints.map((point, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-semibold text-sm">Point {index + 1}</h4>
                        <Button
                          type="button"
                          onClick={() => removeMissionPoint(index)}
                          size="sm"
                          variant="ghost"
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <Label>Icon</Label>
                          <Select
                            value={point.icon}
                            onValueChange={(value) =>
                              updateMissionPoint(index, "icon", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {availableIcons.map((icon) => (
                                <SelectItem key={icon} value={icon}>
                                  {icon}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Title</Label>
                          <Input
                            value={point.title}
                            onChange={(e) =>
                              updateMissionPoint(index, "title", e.target.value)
                            }
                            placeholder="Point title"
                          />
                        </div>

                        <div>
                          <Label>Description</Label>
                          <Input
                            value={point.description}
                            onChange={(e) =>
                              updateMissionPoint(index, "description", e.target.value)
                            }
                            placeholder="Point description"
                          />
                        </div>
                      </div>
                    </Card>
                  ))}

                  {formData.missionPoints.length === 0 && (
                    <p className="text-center text-slate-500 py-8">
                      No mission points added yet. Click "Add Point" to create one.
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vision Tab */}
        <TabsContent value="vision">
          <Card>
            <CardHeader>
              <CardTitle>Vision Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="visionTitle">Vision Title</Label>
                <Input
                  id="visionTitle"
                  value={formData.visionTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, visionTitle: e.target.value })
                  }
                  placeholder="e.g., Our Vision"
                />
              </div>

              <div>
                <Label htmlFor="visionDescription">Vision Description</Label>
                <Textarea
                  id="visionDescription"
                  value={formData.visionDescription}
                  onChange={(e) =>
                    setFormData({ ...formData, visionDescription: e.target.value })
                  }
                  placeholder="Enter vision description..."
                  rows={4}
                />
                <p className="text-sm text-slate-500 mt-1">
                  Use \n for line breaks (e.g., Bengali text\nEnglish text)
                </p>
              </div>

              <div>
                <Label htmlFor="visionImageUrl">Vision Image URL</Label>
                <Input
                  id="visionImageUrl"
                  value={formData.visionImageUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, visionImageUrl: e.target.value })
                  }
                  placeholder="Use Unsplash URL or make Google Drive file public"
                />
                <p className="text-sm text-slate-500 mt-1">
                  For Google Drive: Share → Anyone with the link → Copy link
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <Label>Vision Points</Label>
                  <Button
                    type="button"
                    onClick={addVisionPoint}
                    size="sm"
                    variant="outline"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Point
                  </Button>
                </div>

                <div className="space-y-4">
                  {formData.visionPoints.map((point, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-semibold text-sm">Point {index + 1}</h4>
                        <Button
                          type="button"
                          onClick={() => removeVisionPoint(index)}
                          size="sm"
                          variant="ghost"
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <Label>Icon</Label>
                          <Select
                            value={point.icon}
                            onValueChange={(value) =>
                              updateVisionPoint(index, "icon", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {availableIcons.map((icon) => (
                                <SelectItem key={icon} value={icon}>
                                  {icon}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Title</Label>
                          <Input
                            value={point.title}
                            onChange={(e) =>
                              updateVisionPoint(index, "title", e.target.value)
                            }
                            placeholder="Point title"
                          />
                        </div>

                        <div>
                          <Label>Description</Label>
                          <Input
                            value={point.description}
                            onChange={(e) =>
                              updateVisionPoint(index, "description", e.target.value)
                            }
                            placeholder="Point description"
                          />
                        </div>
                      </div>
                    </Card>
                  ))}

                  {formData.visionPoints.length === 0 && (
                    <p className="text-center text-slate-500 py-8">
                      No vision points added yet. Click "Add Point" to create one.
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Core Values Tab */}
        <TabsContent value="values">
          <Card>
            <CardHeader>
              <CardTitle>Core Values Section</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <Label>Core Values</Label>
                <Button
                  type="button"
                  onClick={addCoreValue}
                  size="sm"
                  variant="outline"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Value
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.coreValues.map((value, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-semibold text-sm">Value {index + 1}</h4>
                      <Button
                        type="button"
                        onClick={() => removeCoreValue(index)}
                        size="sm"
                        variant="ghost"
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <Label>Name</Label>
                        <Input
                          value={value.name}
                          onChange={(e) =>
                            updateCoreValue(index, "name", e.target.value)
                          }
                          placeholder="e.g., Faith"
                        />
                      </div>

                      <div>
                        <Label>Color</Label>
                        <Select
                          value={value.color}
                          onValueChange={(val) =>
                            updateCoreValue(index, "color", val)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {colorOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                <div className="flex items-center gap-2">
                                  <div
                                    className={`w-4 h-4 rounded ${option.value}`}
                                  ></div>
                                  {option.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {formData.coreValues.length === 0 && (
                <p className="text-center text-slate-500 py-8">
                  No core values added yet. Click "Add Value" to create one.
                </p>
              )}
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

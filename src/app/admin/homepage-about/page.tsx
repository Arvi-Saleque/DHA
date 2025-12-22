"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/admin/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Save, Eye } from "lucide-react";
import ImageUploader from "@/components/common/ImageUploader";

interface CoreValue {
  icon: string;
  title: string;
  description: string;
}

interface AboutUsData {
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  establishedYear: string;
  features: string[];
  coreValues: CoreValue[];
}

const iconOptions = [
  "Target", "Heart", "Shield", "Trophy", "Award", "Star",
  "CheckCircle", "BookOpen", "GraduationCap", "Users",
  "Globe", "Lightbulb", "Rocket", "BadgeCheck", "Sparkles"
];

export default function AdminHomepageAboutUs() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [aboutUsData, setAboutUsData] = useState<AboutUsData>({
    title: "",
    subtitle: "",
    description: "",
    imageUrl: "",
    establishedYear: "",
    features: [],
    coreValues: [],
  });
  const [hasExistingData, setHasExistingData] = useState(false);
  const [existingId, setExistingId] = useState<string | null>(null);

  useEffect(() => {
    fetchAboutUs();
  }, []);

  const fetchAboutUs = async () => {
    try {
      const response = await fetch("/api/about-us");
      if (response.ok) {
        const data = await response.json();
        if (data && data._id) {
          setAboutUsData({
            title: data.title || "",
            subtitle: data.subtitle || "",
            description: data.description || "",
            imageUrl: data.imageUrl || "",
            establishedYear: data.establishedYear || "",
            features: data.features || [],
            coreValues: data.coreValues || [],
          });
          setExistingId(data._id);
          setHasExistingData(true);
        }
      }
    } catch (error) {
      console.error("Error fetching about us:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Validation
      if (!aboutUsData.title.trim()) {
        alert("Please enter a title");
        setSaving(false);
        return;
      }
      if (!aboutUsData.description.trim()) {
        alert("Please enter a description");
        setSaving(false);
        return;
      }

      const method = hasExistingData ? "PUT" : "POST";
      const payload = hasExistingData 
        ? { ...aboutUsData, id: existingId }
        : aboutUsData;
      
      const response = await fetch("/api/about-us", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Homepage About Us section updated successfully!");
        setHasExistingData(true);
        fetchAboutUs();
      } else {
        const error = await response.json();
        throw new Error(error.error || error.details || "Failed to update");
      }
    } catch (error) {
      console.error("Error saving about us:", error);
      alert("Failed to save: " + (error as Error).message);
    } finally {
      setSaving(false);
    }
  };

  // Feature Handlers
  const addFeature = () => {
    setAboutUsData({
      ...aboutUsData,
      features: [...aboutUsData.features, ""],
    });
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...aboutUsData.features];
    newFeatures[index] = value;
    setAboutUsData({ ...aboutUsData, features: newFeatures });
  };

  const removeFeature = (index: number) => {
    const newFeatures = aboutUsData.features.filter((_, i) => i !== index);
    setAboutUsData({ ...aboutUsData, features: newFeatures });
  };

  // Core Value Handlers
  const addCoreValue = () => {
    setAboutUsData({
      ...aboutUsData,
      coreValues: [
        ...aboutUsData.coreValues,
        { icon: "Target", title: "", description: "" },
      ],
    });
  };

  const updateCoreValue = (index: number, field: keyof CoreValue, value: string) => {
    const newCoreValues = [...aboutUsData.coreValues];
    newCoreValues[index] = { ...newCoreValues[index], [field]: value };
    setAboutUsData({ ...aboutUsData, coreValues: newCoreValues });
  };

  const removeCoreValue = (index: number) => {
    const newCoreValues = aboutUsData.coreValues.filter((_, i) => i !== index);
    setAboutUsData({ ...aboutUsData, coreValues: newCoreValues });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Homepage About Us</h1>
            <p className="text-slate-600 mt-1">
              Manage the About Us section displayed on the homepage
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => window.open("/", "_blank")}
              variant="outline"
              className="gap-2"
            >
              <Eye className="w-4 h-4" />
              Preview
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-cyan-600 hover:bg-cyan-700 gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Main content displayed in the About Us section
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title *</label>
              <Input
                value={aboutUsData.title}
                onChange={(e) => setAboutUsData({ ...aboutUsData, title: e.target.value })}
                placeholder="e.g., Welcome to Darul Hikmah Academy"
                className="text-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Subtitle</label>
              <Textarea
                value={aboutUsData.subtitle}
                onChange={(e) => setAboutUsData({ ...aboutUsData, subtitle: e.target.value })}
                placeholder="Additional context or secondary message"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description *</label>
              <Textarea
                value={aboutUsData.description}
                onChange={(e) => setAboutUsData({ ...aboutUsData, description: e.target.value })}
                placeholder="Main description about your institution"
                rows={5}
              />
              <p className="text-sm text-slate-500 mt-1">
                Use \n for line breaks (e.g., Bengali text\nEnglish text)
              </p>
            </div>

            <div>
              <ImageUploader
                label="About Us Image"
                value={aboutUsData.imageUrl}
                onChange={(url) => setAboutUsData({ ...aboutUsData, imageUrl: url })}
                folder="homepage-about"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Established Year</label>
              <Input
                value={aboutUsData.establishedYear}
                onChange={(e) => setAboutUsData({ ...aboutUsData, establishedYear: e.target.value })}
                placeholder="e.g., 2010"
              />
            </div>
          </CardContent>
        </Card>

        {/* Features Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Key Features</CardTitle>
                <CardDescription>
                  Highlight the main features of your institution (up to 4 will be displayed)
                </CardDescription>
              </div>
              <Button onClick={addFeature} size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                Add Feature
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {aboutUsData.features.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-8">
                  No features added yet. Click "Add Feature" to get started.
                </p>
              ) : (
                aboutUsData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                      placeholder="e.g., Islamic Education"
                      className="flex-1"
                    />
                    <Button
                      onClick={() => removeFeature(index)}
                      variant="destructive"
                      size="icon"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Core Values Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Core Values</CardTitle>
                <CardDescription>
                  Define the core values displayed on the right side (up to 3 will be displayed)
                </CardDescription>
              </div>
              <Button onClick={addCoreValue} size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                Add Core Value
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {aboutUsData.coreValues.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-8">
                  No core values added yet. Click "Add Core Value" to get started.
                </p>
              ) : (
                aboutUsData.coreValues.map((value, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">Value {index + 1}</Badge>
                      <Button
                        onClick={() => removeCoreValue(index)}
                        variant="destructive"
                        size="sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Icon</label>
                      <select
                        value={value.icon}
                        onChange={(e) => updateCoreValue(index, "icon", e.target.value)}
                        className="w-full p-2 border rounded-md"
                      >
                        {iconOptions.map((icon) => (
                          <option key={icon} value={icon}>
                            {icon}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Title</label>
                      <Input
                        value={value.title}
                        onChange={(e) => updateCoreValue(index, "title", e.target.value)}
                        placeholder="e.g., Our Mission"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Description</label>
                      <Textarea
                        value={value.description}
                        onChange={(e) => updateCoreValue(index, "description", e.target.value)}
                        placeholder="Describe this core value"
                        rows={3}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Save Button at Bottom */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-cyan-600 hover:bg-cyan-700 gap-2"
            size="lg"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}

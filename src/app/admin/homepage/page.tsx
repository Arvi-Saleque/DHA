"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/admin/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { GripVertical, Plus, Trash2 } from "lucide-react";

interface Stat {
  value: string;
  label: string;
  order: number;
}

interface Feature {
  icon: string;
  title: string;
  description: string;
  order: number;
}

interface HomePageData {
  statsSection: Stat[];
  excellenceSection: {
    badge: string;
    title: string;
    description: string;
    features: Feature[];
  };
}

const featureIcons = [
  "GraduationCap", "BookOpen", "Trophy", "Target", "Heart", "Shield", 
  "Users", "Clock", "CheckCircle", "Star", "Award", "Sparkles",
  "BadgeCheck", "Globe", "Lightbulb", "Rocket"
];

export default function AdminHomePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [homePageData, setHomePageData] = useState<HomePageData>({
    statsSection: [],
    excellenceSection: {
      badge: "Why Choose Us",
      title: "Excellence in Education",
      description: "",
      features: [],
    },
  });

  useEffect(() => {
    fetchHomePage();
  }, []);

  const fetchHomePage = async () => {
    try {
      const response = await fetch("/api/homepage");
      if (response.ok) {
        const data = await response.json();
        setHomePageData(data);
      }
    } catch (error) {
      console.error("Error fetching homepage:", error);
      alert("Failed to load homepage data");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await fetch("/api/homepage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(homePageData),
      });

      if (response.ok) {
        alert("Homepage updated successfully!");
      } else {
        throw new Error("Failed to update");
      }
    } catch (error) {
      console.error("Error saving homepage:", error);
      alert("Failed to save homepage");
    } finally {
      setSaving(false);
    }
  };

  // Stats Section Handlers
  const addStat = () => {
    const newStat: Stat = {
      value: "",
      label: "",
      order: homePageData.statsSection.length + 1,
    };
    setHomePageData({
      ...homePageData,
      statsSection: [...homePageData.statsSection, newStat],
    });
  };

  const updateStat = (index: number, field: keyof Stat, value: string | number) => {
    const updatedStats = [...homePageData.statsSection];
    updatedStats[index] = { ...updatedStats[index], [field]: value };
    setHomePageData({ ...homePageData, statsSection: updatedStats });
  };

  const removeStat = (index: number) => {
    const updatedStats = homePageData.statsSection.filter((_, i) => i !== index);
    setHomePageData({ ...homePageData, statsSection: updatedStats });
  };

  // Excellence Section Handlers
  const addFeature = () => {
    const newFeature: Feature = {
      icon: "GraduationCap",
      title: "",
      description: "",
      order: homePageData.excellenceSection.features.length + 1,
    };
    setHomePageData({
      ...homePageData,
      excellenceSection: {
        ...homePageData.excellenceSection,
        features: [...homePageData.excellenceSection.features, newFeature],
      },
    });
  };

  const updateFeature = (index: number, field: keyof Feature, value: string | number) => {
    const updatedFeatures = [...homePageData.excellenceSection.features];
    updatedFeatures[index] = { ...updatedFeatures[index], [field]: value };
    setHomePageData({
      ...homePageData,
      excellenceSection: { ...homePageData.excellenceSection, features: updatedFeatures },
    });
  };

  const removeFeature = (index: number) => {
    const updatedFeatures = homePageData.excellenceSection.features.filter((_, i) => i !== index);
    setHomePageData({
      ...homePageData,
      excellenceSection: { ...homePageData.excellenceSection, features: updatedFeatures },
    });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Homepage Management</h1>
          <p className="text-gray-600 mt-1">Manage statistics and excellence sections</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-cyan-600 hover:bg-cyan-700">
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <Tabs defaultValue="stats" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="stats">Statistics</TabsTrigger>
          <TabsTrigger value="excellence">Excellence</TabsTrigger>
        </TabsList>

        {/* Stats Tab */}
        <TabsContent value="stats" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Statistics Section</CardTitle>
              <CardDescription>Manage the statistics displayed on the homepage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Statistics</h3>
                <Button onClick={addStat} size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Statistic
                </Button>
              </div>

              <div className="space-y-3">
                {homePageData.statsSection.map((stat, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center gap-4">
                      <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-sm font-medium mb-1">Value</label>
                          <Input
                            value={stat.value}
                            onChange={(e) => updateStat(index, "value", e.target.value)}
                            placeholder="500+"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Label</label>
                          <Input
                            value={stat.label}
                            onChange={(e) => updateStat(index, "label", e.target.value)}
                            placeholder="Students"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Order</label>
                          <Input
                            type="number"
                            value={stat.order}
                            onChange={(e) => updateStat(index, "order", parseInt(e.target.value) || 0)}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Badge variant="outline">{stat.order}</Badge>
                        <Button
                          onClick={() => removeStat(index)}
                          size="sm"
                          variant="destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Excellence Tab */}
        <TabsContent value="excellence" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Excellence Section</CardTitle>
              <CardDescription>Configure the excellence features section</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Badge Text</label>
                  <Input
                    value={homePageData.excellenceSection.badge}
                    onChange={(e) =>
                      setHomePageData({
                        ...homePageData,
                        excellenceSection: { ...homePageData.excellenceSection, badge: e.target.value },
                      })
                    }
                    placeholder="Why Choose Us"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Section Title</label>
                  <Input
                    value={homePageData.excellenceSection.title}
                    onChange={(e) =>
                      setHomePageData({
                        ...homePageData,
                        excellenceSection: { ...homePageData.excellenceSection, title: e.target.value },
                      })
                    }
                    placeholder="Excellence in Education"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <Input
                    value={homePageData.excellenceSection.description}
                    onChange={(e) =>
                      setHomePageData({
                        ...homePageData,
                        excellenceSection: { ...homePageData.excellenceSection, description: e.target.value },
                      })
                    }
                    placeholder="Brief description"
                  />
                </div>
              </div>

              <div className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Features</h3>
                  <Button onClick={addFeature} size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Feature
                  </Button>
                </div>

                <div className="space-y-4">
                  {homePageData.excellenceSection.features.map((feature, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-start gap-4">
                        <GripVertical className="w-5 h-5 text-gray-400 mt-2 cursor-move" />
                        <div className="flex-1 space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-sm font-medium mb-1">Icon</label>
                              <select
                                value={feature.icon}
                                onChange={(e) => updateFeature(index, "icon", e.target.value)}
                                className="w-full border rounded-md px-3 py-2"
                              >
                                {featureIcons.map((icon) => (
                                  <option key={icon} value={icon}>
                                    {icon}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Title</label>
                              <Input
                                value={feature.title}
                                onChange={(e) => updateFeature(index, "title", e.target.value)}
                                placeholder="Feature title"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Order</label>
                              <Input
                                type="number"
                                value={feature.order}
                                onChange={(e) => updateFeature(index, "order", parseInt(e.target.value) || 0)}
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <Textarea
                              value={feature.description}
                              onChange={(e) => updateFeature(index, "description", e.target.value)}
                              placeholder="Feature description"
                              rows={2}
                            />
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Badge variant="outline">{feature.order}</Badge>
                          <Button
                            onClick={() => removeFeature(index)}
                            size="sm"
                            variant="destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
      </div>
    </DashboardLayout>
  );
}

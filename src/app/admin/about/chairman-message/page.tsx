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
import { Plus, Trash2, Save, User, MessageCircle, Award, Quote } from "lucide-react";
import ImageUploader from "@/components/common/ImageUploader";

// Available icons for core values
const availableIcons = [
  "BookOpen", "Heart", "Users", "Target", "Award", "Lightbulb",
  "Star", "CheckCircle", "Shield", "Zap", "Sparkles", "Compass",
  "Flag", "MessageCircle", "Clock", "TrendingUp", "Globe", "Eye"
];

interface CoreValue {
  icon: string;
  title: string;
  description: string;
}

interface ChairmanMessageData {
  _id?: string;
  chairmanName: string;
  chairmanTitle: string;
  servingSince: string;
  chairmanImageUrl: string;
  signatureImageUrl: string;
  messageTitle: string;
  messageParagraphs: string[];
  closingMessage: string;
  closingRegards: string;
  coreValues: CoreValue[];
  achievements: string[];
  inspirationalQuote: string;
  quoteAuthor: string;
}

export default function ChairmanMessageAdmin() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ChairmanMessageData>({
    chairmanName: "",
    chairmanTitle: "Chairman, Board of Trustees",
    servingSince: "",
    chairmanImageUrl: "",
    signatureImageUrl: "",
    messageTitle: "Assalamu Alaikum & Greetings",
    messageParagraphs: [],
    closingMessage: "",
    closingRegards: "Warm regards,",
    coreValues: [],
    achievements: [],
    inspirationalQuote: "",
    quoteAuthor: "",
  });

  useEffect(() => {
    fetchChairmanMessage();
  }, []);

  const fetchChairmanMessage = async () => {
    try {
      const response = await fetch("/api/chairman-message");
      const result = await response.json();
      if (result.success && result.data) {
        setFormData(result.data);
      }
    } catch (error) {
      console.error("Error fetching chairman message:", error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const url = "/api/chairman-message";
      const method = formData._id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        alert("Chairman's Message saved successfully!");
        fetchChairmanMessage();
      } else {
        alert("Failed to save: " + result.error);
      }
    } catch (error) {
      console.error("Error saving chairman message:", error);
      alert("Failed to save chairman message");
    } finally {
      setLoading(false);
    }
  };

  // Message Paragraphs handlers
  const addParagraph = () => {
    setFormData({
      ...formData,
      messageParagraphs: [...formData.messageParagraphs, ""],
    });
  };

  const updateParagraph = (index: number, value: string) => {
    const updatedParagraphs = [...formData.messageParagraphs];
    updatedParagraphs[index] = value;
    setFormData({ ...formData, messageParagraphs: updatedParagraphs });
  };

  const removeParagraph = (index: number) => {
    const updatedParagraphs = formData.messageParagraphs.filter((_, i) => i !== index);
    setFormData({ ...formData, messageParagraphs: updatedParagraphs });
  };

  // Core Values handlers
  const addCoreValue = () => {
    setFormData({
      ...formData,
      coreValues: [
        ...formData.coreValues,
        { icon: "BookOpen", title: "", description: "" },
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

  // Achievements handlers
  const addAchievement = () => {
    setFormData({
      ...formData,
      achievements: [...formData.achievements, ""],
    });
  };

  const updateAchievement = (index: number, value: string) => {
    const updatedAchievements = [...formData.achievements];
    updatedAchievements[index] = value;
    setFormData({ ...formData, achievements: updatedAchievements });
  };

  const removeAchievement = (index: number) => {
    const updatedAchievements = formData.achievements.filter((_, i) => i !== index);
    setFormData({ ...formData, achievements: updatedAchievements });
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Chairman's Message Management
          </h1>
          <p className="text-slate-600">
            Manage chairman profile, message, and values
          </p>
        </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="message" className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            Message
          </TabsTrigger>
          <TabsTrigger value="values" className="flex items-center gap-2">
            <Award className="w-4 h-4" />
            Values & Achievements
          </TabsTrigger>
          <TabsTrigger value="quote" className="flex items-center gap-2">
            <Quote className="w-4 h-4" />
            Quote
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Chairman Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="chairmanName">Chairman Name *</Label>
                <Input
                  id="chairmanName"
                  value={formData.chairmanName}
                  onChange={(e) =>
                    setFormData({ ...formData, chairmanName: e.target.value })
                  }
                  placeholder="e.g., Haji Abdul Malik"
                />
              </div>

              <div>
                <Label htmlFor="chairmanTitle">Title *</Label>
                <Input
                  id="chairmanTitle"
                  value={formData.chairmanTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, chairmanTitle: e.target.value })
                  }
                  placeholder="e.g., Chairman, Board of Trustees"
                />
              </div>

              <div>
                <Label htmlFor="servingSince">Serving Since *</Label>
                <Input
                  id="servingSince"
                  value={formData.servingSince}
                  onChange={(e) =>
                    setFormData({ ...formData, servingSince: e.target.value })
                  }
                  placeholder="e.g., 2010"
                />
              </div>

              <div>
                <ImageUploader
                  label="Chairman Photo"
                  value={formData.chairmanImageUrl}
                  onChange={(url) =>
                    setFormData({ ...formData, chairmanImageUrl: url })
                  }
                  folder="chairman"
                />
              </div>

              <div>
                <ImageUploader
                  label="Signature Image (Optional)"
                  value={formData.signatureImageUrl}
                  onChange={(url) =>
                    setFormData({ ...formData, signatureImageUrl: url })
                  }
                  folder="chairman"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Message Tab */}
        <TabsContent value="message">
          <Card>
            <CardHeader>
              <CardTitle>Chairman's Message</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="messageTitle">Message Title *</Label>
                <Input
                  id="messageTitle"
                  value={formData.messageTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, messageTitle: e.target.value })
                  }
                  placeholder="e.g., Assalamu Alaikum & Greetings"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <Label>Message Paragraphs</Label>
                  <Button
                    type="button"
                    onClick={addParagraph}
                    size="sm"
                    variant="outline"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Paragraph
                  </Button>
                </div>

                <div className="space-y-4">
                  {formData.messageParagraphs.map((paragraph, index) => (
                    <div key={index} className="relative">
                      <div className="flex justify-between items-start mb-2">
                        <Label>Paragraph {index + 1}</Label>
                        <Button
                          type="button"
                          onClick={() => removeParagraph(index)}
                          size="sm"
                          variant="ghost"
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <Textarea
                        value={paragraph}
                        onChange={(e) => updateParagraph(index, e.target.value)}
                        placeholder="Enter paragraph text..."
                        rows={4}
                      />
                    </div>
                  ))}

                  {formData.messageParagraphs.length === 0 && (
                    <p className="text-center text-slate-500 py-8">
                      No paragraphs added yet. Click "Add Paragraph" to create one.
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="closingMessage">Closing Message</Label>
                <Input
                  id="closingMessage"
                  value={formData.closingMessage}
                  onChange={(e) =>
                    setFormData({ ...formData, closingMessage: e.target.value })
                  }
                  placeholder="e.g., May Allah guide us all..."
                />
              </div>

              <div>
                <Label htmlFor="closingRegards">Closing Regards</Label>
                <Input
                  id="closingRegards"
                  value={formData.closingRegards}
                  onChange={(e) =>
                    setFormData({ ...formData, closingRegards: e.target.value })
                  }
                  placeholder="e.g., Warm regards,"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Values & Achievements Tab */}
        <TabsContent value="values">
          <div className="space-y-6">
            {/* Core Values */}
            <Card>
              <CardHeader>
                <CardTitle>Core Values</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <Label>Values</Label>
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
                          <Label>Icon</Label>
                          <Select
                            value={value.icon}
                            onValueChange={(val) =>
                              updateCoreValue(index, "icon", val)
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
                            value={value.title}
                            onChange={(e) =>
                              updateCoreValue(index, "title", e.target.value)
                            }
                            placeholder="Value title"
                          />
                        </div>

                        <div>
                          <Label>Description</Label>
                          <Input
                            value={value.description}
                            onChange={(e) =>
                              updateCoreValue(index, "description", e.target.value)
                            }
                            placeholder="Value description"
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {formData.coreValues.length === 0 && (
                  <p className="text-center text-slate-500 py-8">
                    No values added yet. Click "Add Value" to create one.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle>Key Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <Label>Achievements</Label>
                  <Button
                    type="button"
                    onClick={addAchievement}
                    size="sm"
                    variant="outline"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Achievement
                  </Button>
                </div>

                <div className="space-y-4">
                  {formData.achievements.map((achievement, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={achievement}
                        onChange={(e) => updateAchievement(index, e.target.value)}
                        placeholder={`Achievement ${index + 1}`}
                      />
                      <Button
                        type="button"
                        onClick={() => removeAchievement(index)}
                        size="sm"
                        variant="ghost"
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}

                  {formData.achievements.length === 0 && (
                    <p className="text-center text-slate-500 py-8">
                      No achievements added yet. Click "Add Achievement" to create one.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Quote Tab */}
        <TabsContent value="quote">
          <Card>
            <CardHeader>
              <CardTitle>Inspirational Quote</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="inspirationalQuote">Quote</Label>
                <Textarea
                  id="inspirationalQuote"
                  value={formData.inspirationalQuote}
                  onChange={(e) =>
                    setFormData({ ...formData, inspirationalQuote: e.target.value })
                  }
                  placeholder="Enter inspirational quote..."
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="quoteAuthor">Quote Author</Label>
                <Input
                  id="quoteAuthor"
                  value={formData.quoteAuthor}
                  onChange={(e) =>
                    setFormData({ ...formData, quoteAuthor: e.target.value })
                  }
                  placeholder="e.g., Haji Abdul Malik, Chairman"
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

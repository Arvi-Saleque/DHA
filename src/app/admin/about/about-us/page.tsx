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
import {
  BookOpen,
  Plus,
  Pencil,
  X,
  Info,
  Loader2,
  Heart,
  HelpCircle,
  Trash2,
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import ImageUploader from "@/components/common/ImageUploader";

interface CoreValue {
  icon: string;
  title: string;
  description: string;
}

interface FAQ {
  question: string;
  answer: string;
}

interface AboutUs {
  _id: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  establishedYear: string;
  features: string[];
  coreValues: CoreValue[];
  faqs: FAQ[];
}

export default function AboutUsAdminPage() {
  const [aboutData, setAboutData] = useState<AboutUs | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("about");

  // About Us Form
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    imageUrl: '',
    establishedYear: '',
    features: [] as string[],
  });
  const [newFeature, setNewFeature] = useState('');

  // Core Values Form
  const [coreValues, setCoreValues] = useState<CoreValue[]>([]);
  const [newValue, setNewValue] = useState({
    icon: 'Heart',
    title: '',
    description: '',
  });

  // FAQ Form
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [newFaq, setNewFaq] = useState({
    question: '',
    answer: '',
  });

  const [editingId, setEditingId] = useState<string | null>(null);

  // List of common Lucide icons for selection
  const iconOptions = [
    'Heart', 'BookOpen', 'Users', 'Globe', 'Award', 'Target', 
    'Sparkles', 'Star', 'CheckCircle', 'Shield', 'Zap', 'TrendingUp',
    'Lightbulb', 'Compass', 'Flag', 'MessageCircle', 'Clock', 'Calendar'
  ];

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const response = await fetch('/api/about-us');
      const data = await response.json();
      if (data) {
        setAboutData(data);
        setFormData({
          title: data.title,
          subtitle: data.subtitle,
          description: data.description,
          imageUrl: data.imageUrl,
          establishedYear: data.establishedYear,
          features: data.features || [],
        });
        setCoreValues(data.coreValues || []);
        setFaqs(data.faqs || []);
        setEditingId(data._id);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching about data:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = '/api/about-us';
      const method = editingId ? 'PUT' : 'POST';
      const body = {
        ...formData,
        coreValues,
        faqs,
        ...(editingId && { id: editingId })
      };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        await fetchAboutData();
      }
    } catch (error) {
      console.error('Error saving about data:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, newFeature.trim()]
      });
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index)
    });
  };

  const addCoreValue = () => {
    if (newValue.title && newValue.description) {
      setCoreValues([...coreValues, newValue]);
      setNewValue({ icon: 'Heart', title: '', description: '' });
    }
  };

  const removeCoreValue = (index: number) => {
    setCoreValues(coreValues.filter((_, i) => i !== index));
  };

  const addFaq = () => {
    if (newFaq.question && newFaq.answer) {
      setFaqs([...faqs, newFaq]);
      setNewFaq({ question: '', answer: '' });
    }
  };

  const removeFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const getIconComponent = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent || LucideIcons.Heart;
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <BookOpen className="h-10 w-10 text-cyan-600" />
              About Us Management
            </h1>
            <p className="text-gray-600">Manage about us, core values, and FAQ sections</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-cyan-600" />
            </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 bg-cyan-100">
                <TabsTrigger value="about" className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white">
                  <BookOpen className="h-4 w-4 mr-2" />
                  About Us
                </TabsTrigger>
                <TabsTrigger value="values" className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white">
                  <Heart className="h-4 w-4 mr-2" />
                  Core Values
                </TabsTrigger>
                <TabsTrigger value="faq" className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  FAQ
                </TabsTrigger>
              </TabsList>

              {/* About Us Tab */}
              <TabsContent value="about" className="space-y-6">
                <Card className="shadow-xl border-none">
                  <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50">
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      About Us Content
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="title">Main Title</Label>
                        <Input
                          id="title"
                          placeholder="e.g., Building a Legacy of Islamic Education"
                          value={formData.title}
                          onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                          }
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="subtitle">Subtitle</Label>
                        <Input
                          id="subtitle"
                          placeholder="e.g., Nurturing Islamic Knowledge & Excellence Since 1999"
                          value={formData.subtitle}
                          onChange={(e) =>
                            setFormData({ ...formData, subtitle: e.target.value })
                          }
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Enter detailed description about the madrasa..."
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({ ...formData, description: e.target.value })
                        }
                        rows={6}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <ImageUploader
                          label="About Us Image"
                          value={formData.imageUrl}
                          onChange={(url) =>
                            setFormData({ ...formData, imageUrl: url })
                          }
                          folder="about-us"
                        />
                      </div>

                      <div>
                        <Label htmlFor="establishedYear">Established Year</Label>
                        <Input
                          id="establishedYear"
                          placeholder="e.g., 1999"
                          value={formData.establishedYear}
                          onChange={(e) =>
                            setFormData({ ...formData, establishedYear: e.target.value })
                          }
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="features">Key Features</Label>
                      <div className="flex gap-2 mb-3">
                        <Input
                          id="features"
                          placeholder="e.g., Accredited Islamic curriculum"
                          value={newFeature}
                          onChange={(e) => setNewFeature(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addFeature();
                            }
                          }}
                        />
                        <Button
                          type="button"
                          onClick={addFeature}
                          className="bg-cyan-600 hover:bg-cyan-700"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      {formData.features.length > 0 && (
                        <div className="space-y-2">
                          {formData.features.map((feature, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between bg-cyan-50 p-3 rounded-lg"
                            >
                              <span className="text-sm text-gray-700">{feature}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFeature(index)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Core Values Tab */}
              <TabsContent value="values" className="space-y-6">
                <Card className="shadow-xl border-none">
                  <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50">
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5" />
                      Core Values
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="valueIcon">Icon</Label>
                        <Select
                          value={newValue.icon}
                          onValueChange={(value) =>
                            setNewValue({ ...newValue, icon: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {iconOptions.map((icon) => {
                              const IconComponent = getIconComponent(icon);
                              return (
                                <SelectItem key={icon} value={icon}>
                                  <div className="flex items-center gap-2">
                                    <IconComponent className="h-4 w-4" />
                                    {icon}
                                  </div>
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="valueTitle">Title</Label>
                        <Input
                          id="valueTitle"
                          placeholder="e.g., Faith & Character"
                          value={newValue.title}
                          onChange={(e) =>
                            setNewValue({ ...newValue, title: e.target.value })
                          }
                        />
                      </div>

                      <div>
                        <Label htmlFor="valueDesc">Description</Label>
                        <Input
                          id="valueDesc"
                          placeholder="Short description"
                          value={newValue.description}
                          onChange={(e) =>
                            setNewValue({ ...newValue, description: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <Button
                      type="button"
                      onClick={addCoreValue}
                      className="w-full bg-cyan-600 hover:bg-cyan-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Core Value
                    </Button>

                    {coreValues.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {coreValues.map((value, index) => {
                          const IconComponent = getIconComponent(value.icon);
                          return (
                            <Card key={index} className="border-2 border-cyan-200">
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex items-center gap-3">
                                    <div className="p-2 bg-cyan-100 rounded-lg">
                                      <IconComponent className="h-5 w-5 text-cyan-600" />
                                    </div>
                                    <div>
                                      <h4 className="font-semibold text-gray-900">{value.title}</h4>
                                      <p className="text-xs text-gray-500">Icon: {value.icon}</p>
                                    </div>
                                  </div>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeCoreValue(index)}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                                <p className="text-sm text-gray-600">{value.description}</p>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* FAQ Tab */}
              <TabsContent value="faq" className="space-y-6">
                <Card className="shadow-xl border-none">
                  <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50">
                    <CardTitle className="flex items-center gap-2">
                      <HelpCircle className="h-5 w-5" />
                      Frequently Asked Questions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="question">Question</Label>
                        <Input
                          id="question"
                          placeholder="e.g., What is the admission process?"
                          value={newFaq.question}
                          onChange={(e) =>
                            setNewFaq({ ...newFaq, question: e.target.value })
                          }
                        />
                      </div>

                      <div>
                        <Label htmlFor="answer">Answer</Label>
                        <Textarea
                          id="answer"
                          placeholder="Enter the answer..."
                          value={newFaq.answer}
                          onChange={(e) =>
                            setNewFaq({ ...newFaq, answer: e.target.value })
                          }
                          rows={4}
                        />
                      </div>

                      <Button
                        type="button"
                        onClick={addFaq}
                        className="w-full bg-cyan-600 hover:bg-cyan-700"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add FAQ
                      </Button>
                    </div>

                    {faqs.length > 0 && (
                      <div className="space-y-3">
                        {faqs.map((faq, index) => (
                          <Card key={index} className="border-2 border-cyan-200">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-semibold text-gray-900 flex-1">
                                  {index + 1}. {faq.question}
                                </h4>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeFaq(index)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                              <p className="text-sm text-gray-600">{faq.answer}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Save Button */}
            <Card className="mt-6 shadow-xl border-none">
              <CardContent className="p-6">
                <Button
                  type="submit"
                  className="w-full bg-cyan-600 hover:bg-cyan-700 h-12 text-lg"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Saving All Changes...
                    </>
                  ) : (
                    <>
                      <Pencil className="mr-2 h-5 w-5" />
                      Save All Changes
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </form>
        )}
        </div>
      </div>
    </DashboardLayout>
  );
}

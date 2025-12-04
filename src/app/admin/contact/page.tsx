"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/admin/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

interface ContactInfoItem {
  icon: string;
  title: string;
  details: string[];
  order: number;
}

interface ContactData {
  _id?: string;
  title: string;
  description: string;
  contactInfo: ContactInfoItem[];
  mapUrl: string;
  officeHours: {
    weekdays: string;
    weekdaysTime: string;
    weekends: string;
    weekendsTime: string;
    additionalInfo: string;
  };
  quickTips: string[];
}

const iconOptions = [
  "Phone",
  "Mail",
  "MapPin",
  "Clock",
  "Building2",
  "Globe",
  "MessageSquare",
  "Users",
];

export default function ContactAdminPage() {
  const [data, setData] = useState<ContactData>({
    title: "Contact Us",
    description: "We're here to help. Reach out to us anytime",
    contactInfo: [],
    mapUrl: "",
    officeHours: {
      weekdays: "",
      weekdaysTime: "",
      weekends: "",
      weekendsTime: "",
      additionalInfo: "",
    },
    quickTips: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/contact");
      if (res.ok) {
        const contactData = await res.json();
        setData(contactData);
      }
    } catch (error) {
      console.error("Error fetching contact data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await fetch("/api/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        alert("Contact information updated successfully!");
        fetchData();
      } else {
        alert("Failed to update contact information");
      }
    } catch (error) {
      console.error("Error saving:", error);
      alert("Error saving contact information");
    } finally {
      setSaving(false);
    }
  };

  const addContactInfo = () => {
    setData({
      ...data,
      contactInfo: [
        ...data.contactInfo,
        {
          icon: "Phone",
          title: "",
          details: [""],
          order: data.contactInfo.length + 1,
        },
      ],
    });
  };

  const removeContactInfo = (index: number) => {
    const newContactInfo = data.contactInfo.filter((_, i) => i !== index);
    setData({ ...data, contactInfo: newContactInfo });
  };

  const updateContactInfo = (
    index: number,
    field: keyof ContactInfoItem,
    value: string | string[] | number
  ) => {
    const newContactInfo = [...data.contactInfo];
    newContactInfo[index] = { ...newContactInfo[index], [field]: value };
    setData({ ...data, contactInfo: newContactInfo });
  };

  const addDetail = (contactIndex: number) => {
    const newContactInfo = [...data.contactInfo];
    newContactInfo[contactIndex].details.push("");
    setData({ ...data, contactInfo: newContactInfo });
  };

  const updateDetail = (contactIndex: number, detailIndex: number, value: string) => {
    const newContactInfo = [...data.contactInfo];
    newContactInfo[contactIndex].details[detailIndex] = value;
    setData({ ...data, contactInfo: newContactInfo });
  };

  const removeDetail = (contactIndex: number, detailIndex: number) => {
    const newContactInfo = [...data.contactInfo];
    newContactInfo[contactIndex].details = newContactInfo[
      contactIndex
    ].details.filter((_, i) => i !== detailIndex);
    setData({ ...data, contactInfo: newContactInfo });
  };

  const addQuickTip = () => {
    setData({
      ...data,
      quickTips: [...data.quickTips, ""],
    });
  };

  const updateQuickTip = (index: number, value: string) => {
    const newQuickTips = [...data.quickTips];
    newQuickTips[index] = value;
    setData({ ...data, quickTips: newQuickTips });
  };

  const removeQuickTip = (index: number) => {
    const newQuickTips = data.quickTips.filter((_, i) => i !== index);
    setData({ ...data, quickTips: newQuickTips });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div>
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">Loading...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contact Us Management</h1>
          <p className="text-gray-600 mt-2">
            Manage contact information and page content
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
            <CardTitle>Page Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Page Title</Label>
              <Input
                id="title"
                value={data.title}
                onChange={(e) => setData({ ...data, title: e.target.value })}
                placeholder="Contact Us"
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
                placeholder="We're here to help..."
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Information Cards */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Contact Information Cards</CardTitle>
            <Button onClick={addContactInfo} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Card
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.contactInfo.map((info, index) => (
                <Card key={index} className="border-2">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="flex items-center gap-2 text-gray-400">
                        <GripVertical className="w-5 h-5" />
                        <Badge variant="outline">{index + 1}</Badge>
                      </div>
                      <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Icon</Label>
                            <Select
                              value={info.icon}
                              onValueChange={(value) =>
                                updateContactInfo(index, "icon", value)
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
                          <div>
                            <Label>Title</Label>
                            <Input
                              value={info.title}
                              onChange={(e) =>
                                updateContactInfo(index, "title", e.target.value)
                              }
                              placeholder="Phone Number"
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <Label>Details</Label>
                            <Button
                              onClick={() => addDetail(index)}
                              size="sm"
                              variant="outline"
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              Add Detail
                            </Button>
                          </div>
                          <div className="space-y-2">
                            {info.details.map((detail, detailIndex) => (
                              <div
                                key={detailIndex}
                                className="flex items-center gap-2"
                              >
                                <Input
                                  value={detail}
                                  onChange={(e) =>
                                    updateDetail(index, detailIndex, e.target.value)
                                  }
                                  placeholder="Detail line"
                                />
                                <Button
                                  onClick={() => removeDetail(index, detailIndex)}
                                  size="icon"
                                  variant="ghost"
                                  className="text-red-600"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => removeContactInfo(index)}
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
              {data.contactInfo.length === 0 && (
                <p className="text-center text-gray-500 py-8">
                  No contact information cards added yet.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Map URL */}
        <Card>
          <CardHeader>
            <CardTitle>Google Maps Embed</CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="mapUrl">Map Embed URL</Label>
            <Textarea
              id="mapUrl"
              value={data.mapUrl}
              onChange={(e) => setData({ ...data, mapUrl: e.target.value })}
              placeholder="https://www.google.com/maps/embed?pb=..."
              rows={3}
            />
            <p className="text-sm text-gray-500 mt-2">
              Get the embed URL from Google Maps: Share → Embed a map → Copy HTML
            </p>
          </CardContent>
        </Card>

        {/* Office Hours */}
        <Card>
          <CardHeader>
            <CardTitle>Office Hours</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="weekdays">Weekdays</Label>
                <Input
                  id="weekdays"
                  value={data.officeHours.weekdays}
                  onChange={(e) =>
                    setData({
                      ...data,
                      officeHours: {
                        ...data.officeHours,
                        weekdays: e.target.value,
                      },
                    })
                  }
                  placeholder="Sunday - Thursday"
                />
              </div>
              <div>
                <Label htmlFor="weekdaysTime">Weekdays Time</Label>
                <Input
                  id="weekdaysTime"
                  value={data.officeHours.weekdaysTime}
                  onChange={(e) =>
                    setData({
                      ...data,
                      officeHours: {
                        ...data.officeHours,
                        weekdaysTime: e.target.value,
                      },
                    })
                  }
                  placeholder="8:00 AM - 4:00 PM"
                />
              </div>
              <div>
                <Label htmlFor="weekends">Weekends</Label>
                <Input
                  id="weekends"
                  value={data.officeHours.weekends}
                  onChange={(e) =>
                    setData({
                      ...data,
                      officeHours: {
                        ...data.officeHours,
                        weekends: e.target.value,
                      },
                    })
                  }
                  placeholder="Friday - Saturday"
                />
              </div>
              <div>
                <Label htmlFor="weekendsTime">Weekends Status</Label>
                <Input
                  id="weekendsTime"
                  value={data.officeHours.weekendsTime}
                  onChange={(e) =>
                    setData({
                      ...data,
                      officeHours: {
                        ...data.officeHours,
                        weekendsTime: e.target.value,
                      },
                    })
                  }
                  placeholder="Closed"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="additionalInfo">Additional Information</Label>
              <Textarea
                id="additionalInfo"
                value={data.officeHours.additionalInfo}
                onChange={(e) =>
                  setData({
                    ...data,
                    officeHours: {
                      ...data.officeHours,
                      additionalInfo: e.target.value,
                    },
                  })
                }
                placeholder="For urgent matters..."
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Quick Tips */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Quick Tips</CardTitle>
            <Button onClick={addQuickTip} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Tip
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.quickTips.map((tip, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={tip}
                    onChange={(e) => updateQuickTip(index, e.target.value)}
                    placeholder="Quick tip..."
                  />
                  <Button
                    onClick={() => removeQuickTip(index)}
                    size="icon"
                    variant="ghost"
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {data.quickTips.length === 0 && (
                <p className="text-center text-gray-500 py-8">
                  No quick tips added yet.
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

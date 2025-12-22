"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/admin/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Shield,
  Users,
  Target,
  ArrowUp,
  ArrowDown,
  Trash2,
  Plus,
  Save,
  BookOpen,
  Heart,
  Award,
  Globe,
  Lightbulb,
  Star,
  Briefcase,
  Calendar,
  Building2,
  Sparkles,
  TrendingUp,
  Mail,
  Phone,
} from "lucide-react";
import ImageUploader from "@/components/common/ImageUploader";

const availableIcons = [
  { name: "Shield", component: Shield },
  { name: "Users", component: Users },
  { name: "Target", component: Target },
  { name: "BookOpen", component: BookOpen },
  { name: "Heart", component: Heart },
  { name: "Award", component: Award },
  { name: "Globe", component: Globe },
  { name: "Lightbulb", component: Lightbulb },
  { name: "Star", component: Star },
  { name: "Briefcase", component: Briefcase },
  { name: "Calendar", component: Calendar },
  { name: "Building2", component: Building2 },
  { name: "Sparkles", component: Sparkles },
  { name: "TrendingUp", component: TrendingUp },
];

const availableColors = [
  "cyan",
  "blue",
  "purple",
  "amber",
  "pink",
  "indigo",
  "emerald",
  "rose",
];

interface Category {
  name: string;
  order: number;
}

interface Member {
  name: string;
  position: string;
  organization: string;
  imageUrl: string;
  tenure: string;
  description: string;
  email: string;
  phone: string;
  icon: string;
  color: string;
  category: string;
  order: number;
}

interface Responsibility {
  icon: string;
  title: string;
  description: string;
}

interface CommitteeData {
  _id?: string;
  sectionTitle: string;
  sectionDescription: string;
  categories: Category[];
  members: Member[];
  responsibilitiesTitle: string;
  responsibilitiesSubtitle: string;
  responsibilities: Responsibility[];
}

export default function CommitteeAdminPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [committeeData, setCommitteeData] = useState<CommitteeData>({
    sectionTitle: "Committed to Excellence",
    sectionDescription:
      "Our management committee comprises accomplished professionals from diverse fields, united by a shared commitment to advancing Islamic education and serving the community.",
    categories: [],
    members: [],
    responsibilitiesTitle: "Committee Responsibilities",
    responsibilitiesSubtitle:
      "Our committee ensures effective governance and sustainable growth",
    responsibilities: [],
  });

  useEffect(() => {
    fetchCommitteeData();
  }, []);

  const fetchCommitteeData = async () => {
    try {
      const res = await fetch("/api/committee");
      if (res.ok) {
        const data = await res.json();
        setCommitteeData(data);
      }
    } catch (error) {
      console.error("Error fetching committee data:", error);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");

    try {
      const method = committeeData._id ? "PUT" : "POST";
      const res = await fetch("/api/committee", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(committeeData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Committee data saved successfully!");
        if (!committeeData._id && data.committee) {
          setCommitteeData(data.committee);
        }
      } else {
        setMessage(`Error: ${data.message}`);
      }
    } catch (error) {
      setMessage("Failed to save committee data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Category Management
  const addCategory = () => {
    setCommitteeData({
      ...committeeData,
      categories: [
        ...committeeData.categories,
        { name: "", order: committeeData.categories.length },
      ],
    });
  };

  const updateCategory = (index: number, field: string, value: string) => {
    const newCategories = [...committeeData.categories];
    newCategories[index] = { ...newCategories[index], [field]: value };
    setCommitteeData({ ...committeeData, categories: newCategories });
  };

  const removeCategory = (index: number) => {
    const newCategories = committeeData.categories.filter(
      (_, i) => i !== index
    );
    setCommitteeData({ ...committeeData, categories: newCategories });
  };

  const moveCategoryUp = (index: number) => {
    if (index === 0) return;
    const newCategories = [...committeeData.categories];
    [newCategories[index - 1], newCategories[index]] = [
      newCategories[index],
      newCategories[index - 1],
    ];
    newCategories.forEach((cat, i) => (cat.order = i));
    setCommitteeData({ ...committeeData, categories: newCategories });
  };

  const moveCategoryDown = (index: number) => {
    if (index === committeeData.categories.length - 1) return;
    const newCategories = [...committeeData.categories];
    [newCategories[index], newCategories[index + 1]] = [
      newCategories[index + 1],
      newCategories[index],
    ];
    newCategories.forEach((cat, i) => (cat.order = i));
    setCommitteeData({ ...committeeData, categories: newCategories });
  };

  // Member Management
  const addMember = () => {
    setCommitteeData({
      ...committeeData,
      members: [
        ...committeeData.members,
        {
          name: "",
          position: "",
          organization: "",
          imageUrl: "",
          tenure: "",
          description: "",
          email: "",
          phone: "",
          icon: "Shield",
          color: "cyan",
          category: committeeData.categories[0]?.name || "",
          order: committeeData.members.length,
        },
      ],
    });
  };

  const updateMember = (index: number, field: string, value: string) => {
    const newMembers = [...committeeData.members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setCommitteeData({ ...committeeData, members: newMembers });
  };

  const removeMember = (index: number) => {
    const newMembers = committeeData.members.filter((_, i) => i !== index);
    setCommitteeData({ ...committeeData, members: newMembers });
  };

  // Responsibility Management
  const addResponsibility = () => {
    setCommitteeData({
      ...committeeData,
      responsibilities: [
        ...committeeData.responsibilities,
        { icon: "Target", title: "", description: "" },
      ],
    });
  };

  const updateResponsibility = (
    index: number,
    field: string,
    value: string
  ) => {
    const newResponsibilities = [...committeeData.responsibilities];
    newResponsibilities[index] = {
      ...newResponsibilities[index],
      [field]: value,
    };
    setCommitteeData({
      ...committeeData,
      responsibilities: newResponsibilities,
    });
  };

  const removeResponsibility = (index: number) => {
    const newResponsibilities = committeeData.responsibilities.filter(
      (_, i) => i !== index
    );
    setCommitteeData({ ...committeeData, responsibilities: newResponsibilities });
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Committee Management</h1>
          <p className="text-slate-600">
            Manage committee members, categories, and responsibilities
          </p>
        </div>

      <Tabs defaultValue="section" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="section">Section Settings</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="responsibilities">Responsibilities</TabsTrigger>
        </TabsList>

        {/* Section Settings Tab */}
        <TabsContent value="section" className="space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div>
                <Label>Section Title</Label>
                <Input
                  value={committeeData.sectionTitle}
                  onChange={(e) =>
                    setCommitteeData({
                      ...committeeData,
                      sectionTitle: e.target.value,
                    })
                  }
                  placeholder="Enter section title"
                />
              </div>
              <div>
                <Label>Section Description</Label>
                <Textarea
                  value={committeeData.sectionDescription}
                  onChange={(e) =>
                    setCommitteeData({
                      ...committeeData,
                      sectionDescription: e.target.value,
                    })
                  }
                  placeholder="Enter section description"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Committee Categories</h3>
                <Button onClick={addCategory} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Category
                </Button>
              </div>

              {committeeData.categories.map((category, index) => (
                <div
                  key={index}
                  className="flex gap-2 items-center p-4 border rounded-lg"
                >
                  <div className="flex flex-col gap-1">
                    <Button
                      onClick={() => moveCategoryUp(index)}
                      size="sm"
                      variant="ghost"
                      disabled={index === 0}
                    >
                      <ArrowUp className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => moveCategoryDown(index)}
                      size="sm"
                      variant="ghost"
                      disabled={index === committeeData.categories.length - 1}
                    >
                      <ArrowDown className="w-4 h-4" />
                    </Button>
                  </div>
                  <Input
                    value={category.name}
                    onChange={(e) =>
                      updateCategory(index, "name", e.target.value)
                    }
                    placeholder="Category name (e.g., Executive Board)"
                    className="flex-1"
                  />
                  <Button
                    onClick={() => removeCategory(index)}
                    variant="destructive"
                    size="sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}

              {committeeData.categories.length === 0 && (
                <p className="text-center text-slate-500 py-8">
                  No categories added yet. Click "Add Category" to start.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Members Tab */}
        <TabsContent value="members" className="space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Committee Members</h3>
                <Button onClick={addMember} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Member
                </Button>
              </div>

              {committeeData.members.map((member, index) => (
                <Card key={index} className="border-2">
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold">
                        Member {index + 1}
                      </h4>
                      <Button
                        onClick={() => removeMember(index)}
                        variant="destructive"
                        size="sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Name</Label>
                        <Input
                          value={member.name}
                          onChange={(e) =>
                            updateMember(index, "name", e.target.value)
                          }
                          placeholder="Member name"
                        />
                      </div>
                      <div>
                        <Label>Position</Label>
                        <Input
                          value={member.position}
                          onChange={(e) =>
                            updateMember(index, "position", e.target.value)
                          }
                          placeholder="Position/Title"
                        />
                      </div>
                      <div>
                        <Label>Organization</Label>
                        <Input
                          value={member.organization}
                          onChange={(e) =>
                            updateMember(index, "organization", e.target.value)
                          }
                          placeholder="Organization/Profession"
                        />
                      </div>
                      <div>
                        <Label>Tenure</Label>
                        <Input
                          value={member.tenure}
                          onChange={(e) =>
                            updateMember(index, "tenure", e.target.value)
                          }
                          placeholder="e.g., 2020 - Present"
                        />
                      </div>
                      <div>
                        <Label>Email (Optional)</Label>
                        <Input
                          value={member.email}
                          onChange={(e) =>
                            updateMember(index, "email", e.target.value)
                          }
                          placeholder="Email address"
                          type="email"
                        />
                      </div>
                      <div>
                        <Label>Phone (Optional)</Label>
                        <Input
                          value={member.phone}
                          onChange={(e) =>
                            updateMember(index, "phone", e.target.value)
                          }
                          placeholder="Phone number"
                        />
                      </div>
                      <div>
                        <Label>Category</Label>
                        <Select
                          value={member.category}
                          onValueChange={(value) =>
                            updateMember(index, "category", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {committeeData.categories.map((cat) => (
                              <SelectItem key={cat.name} value={cat.name}>
                                {cat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Icon</Label>
                        <Select
                          value={member.icon}
                          onValueChange={(value) =>
                            updateMember(index, "icon", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select icon" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableIcons.map((icon) => (
                              <SelectItem key={icon.name} value={icon.name}>
                                {icon.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Color</Label>
                        <Select
                          value={member.color}
                          onValueChange={(value) =>
                            updateMember(index, "color", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select color" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableColors.map((color) => (
                              <SelectItem key={color} value={color}>
                                {color}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-2">
                        <ImageUploader
                          label="Member Photo"
                          value={member.imageUrl}
                          onChange={(url) =>
                            updateMember(index, "imageUrl", url)
                          }
                          folder="committee"
                        />
                      </div>
                      <div className="col-span-2">
                        <Label>Description</Label>
                        <Textarea
                          value={member.description}
                          onChange={(e) =>
                            updateMember(index, "description", e.target.value)
                          }
                          placeholder="Brief description"
                          rows={2}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {committeeData.members.length === 0 && (
                <p className="text-center text-slate-500 py-8">
                  No members added yet. Click "Add Member" to start.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Responsibilities Tab */}
        <TabsContent value="responsibilities" className="space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div>
                <Label>Responsibilities Section Title</Label>
                <Input
                  value={committeeData.responsibilitiesTitle}
                  onChange={(e) =>
                    setCommitteeData({
                      ...committeeData,
                      responsibilitiesTitle: e.target.value,
                    })
                  }
                  placeholder="Enter title"
                />
              </div>
              <div>
                <Label>Responsibilities Subtitle</Label>
                <Textarea
                  value={committeeData.responsibilitiesSubtitle}
                  onChange={(e) =>
                    setCommitteeData({
                      ...committeeData,
                      responsibilitiesSubtitle: e.target.value,
                    })
                  }
                  placeholder="Enter subtitle"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Responsibilities List</h3>
                <Button onClick={addResponsibility} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Responsibility
                </Button>
              </div>

              {committeeData.responsibilities.map((responsibility, index) => (
                <Card key={index} className="border-2">
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold">
                        Responsibility {index + 1}
                      </h4>
                      <Button
                        onClick={() => removeResponsibility(index)}
                        variant="destructive"
                        size="sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Icon</Label>
                        <Select
                          value={responsibility.icon}
                          onValueChange={(value) =>
                            updateResponsibility(index, "icon", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select icon" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableIcons.map((icon) => (
                              <SelectItem key={icon.name} value={icon.name}>
                                {icon.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Title</Label>
                        <Input
                          value={responsibility.title}
                          onChange={(e) =>
                            updateResponsibility(index, "title", e.target.value)
                          }
                          placeholder="Responsibility title"
                        />
                      </div>
                      <div className="col-span-2">
                        <Label>Description</Label>
                        <Textarea
                          value={responsibility.description}
                          onChange={(e) =>
                            updateResponsibility(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          placeholder="Responsibility description"
                          rows={2}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {committeeData.responsibilities.length === 0 && (
                <p className="text-center text-slate-500 py-8">
                  No responsibilities added yet. Click "Add Responsibility" to
                  start.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end gap-4 mt-6">
        {message && (
          <div
            className={`px-4 py-2 rounded ${
              message.includes("Error")
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {message}
          </div>
        )}
        <Button onClick={handleSubmit} disabled={loading} size="lg">
          <Save className="w-4 h-4 mr-2" />
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
      </div>
    </DashboardLayout>
  );
}

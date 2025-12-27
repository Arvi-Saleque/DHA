"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Shield,
  Briefcase,
  Calendar,
  ArrowLeft,
  Heart,
  Target,
  Award,
  Building2,
  BookOpen,
  Globe,
  Lightbulb,
  Star,
  Sparkles,
  TrendingUp,
  Mail,
  Phone,
  LucideIcon,
} from "lucide-react";

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  Shield,
  Users,
  Target,
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
};

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
  email?: string;
  phone?: string;
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
  sectionTitle: string;
  sectionDescription: string;
  categories: Category[];
  members: Member[];
  responsibilitiesTitle: string;
  responsibilitiesSubtitle: string;
  responsibilities: Responsibility[];
}

// Helper functions for Google Drive images
const isGoogleDriveUrl = (url: string) => {
  return url.includes("drive.google.com");
};

const getImageUrl = (url: string) => {
  if (isGoogleDriveUrl(url)) {
    const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (fileIdMatch) {
      return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
    }
  }
  return url;
};

export default function CommitteePage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [data, setData] = useState<CommitteeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCommitteeData();
  }, []);

  const fetchCommitteeData = async () => {
    try {
      const res = await fetch("/api/committee");
      if (res.ok) {
        const committeeData = await res.json();
        setData(committeeData);
      }
    } catch (error) {
      console.error("Error fetching committee data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading committee data...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-600">No committee data available</p>
      </div>
    );
  }

  // Filter to only show categories that have members
  const activeCategories = data.categories
    .filter((cat) => data.members.some((m) => m.category === cat.name))
    .sort((a, b) => a.order - b.order);

  // Get filtered members based on active category
  const getFilteredMembers = () => {
    if (activeCategory === "All") {
      return data.members.sort((a, b) => a.order - b.order);
    }
    return data.members
      .filter((m) => m.category === activeCategory)
      .sort((a, b) => a.order - b.order);
  };

  const getColorClasses = (color: string) => {
    const colors: {
      [key: string]: { bg: string; text: string; badge: string };
    } = {
      cyan: { bg: "bg-cyan-500", text: "text-cyan-600", badge: "bg-cyan-100" },
      blue: { bg: "bg-blue-500", text: "text-blue-600", badge: "bg-blue-100" },
      purple: {
        bg: "bg-purple-500",
        text: "text-purple-600",
        badge: "bg-purple-100",
      },
      amber: {
        bg: "bg-amber-500",
        text: "text-amber-600",
        badge: "bg-amber-100",
      },
      pink: { bg: "bg-pink-500", text: "text-pink-600", badge: "bg-pink-100" },
      indigo: {
        bg: "bg-indigo-500",
        text: "text-indigo-600",
        badge: "bg-indigo-100",
      },
    };
    return colors[color] || colors.cyan;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative h-[300px] sm:h-[350px] md:h-[400px] bg-cyan-600 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>

        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-white text-center">
          <Link href="/about">
            <Button
              variant="ghost"
              className="absolute top-4 left-4 sm:top-6 sm:left-6 md:top-8 md:left-8 text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Back to About</span>
              <span className="sm:hidden">Back</span>
            </Button>
          </Link>

          <Badge
            variant="secondary"
            className="mb-4 bg-white/20 backdrop-blur-sm text-white border-white/30"
          >
            <Users className="w-3 h-3 mr-1" />
            Leadership
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 drop-shadow-lg">
            Management Committee
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-cyan-50 max-w-3xl drop-shadow-md">
            Dedicated leaders guiding our institution towards excellence
          </p>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="container mx-auto px-4 py-20">
        {/* Committee Members Grid with Tabs */}
        
        {/* Mobile Dropdown */}
        <div className="md:hidden mb-8">
          <Select value={activeCategory} onValueChange={setActiveCategory}>
            <SelectTrigger className="w-full h-12 text-base">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Members</SelectItem>
              {activeCategories.map((cat) => (
                <SelectItem key={cat.name} value={cat.name}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Desktop Tabs */}
        <Tabs
          defaultValue="All"
          className="hidden md:block max-w-7xl mx-auto mb-20"
          onValueChange={(value) => setActiveCategory(value)}
        >
          <TabsList
            style={{
              gridTemplateColumns: `repeat(${Math.min(
                activeCategories.length + 1,
                5
              )}, minmax(0, 1fr))`,
            }}
            className="grid w-full gap-2 bg-slate-100 p-2 rounded-xl mb-8"
          >
            <TabsTrigger
              value="All"
              className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white"
            >
              All Members
            </TabsTrigger>
            {activeCategories.map((cat) => (
              <TabsTrigger
                key={cat.name}
                value={cat.name}
                className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white"
              >
                {cat.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeCategory} className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getFilteredMembers().length > 0 ? (
                getFilteredMembers().map((member, index) => (
                  <CommitteeMemberCard
                    key={index}
                    member={member}
                    getColorClasses={getColorClasses}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-slate-500">
                    No members found in this category
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Mobile Content (outside Tabs) */}
        <div className="md:hidden mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getFilteredMembers().length > 0 ? (
              getFilteredMembers().map((member, index) => (
                <CommitteeMemberCard
                  key={index}
                  member={member}
                  getColorClasses={getColorClasses}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-slate-500">
                  No members found in this category
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Responsibilities Section */}
        {data.responsibilities && data.responsibilities.length > 0 && (
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4">
                <Target className="w-3 h-3 mr-1" />
                Key Responsibilities
              </Badge>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                {data.responsibilitiesTitle}
              </h2>
              <p className="text-lg text-slate-600">
                {data.responsibilitiesSubtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.responsibilities.map((item, index) => {
                const IconComponent = iconMap[item.icon] || Target;
                return (
                  <Card
                    key={index}
                    className="border-none shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 bg-gradient-to-br from-white to-slate-50"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 mb-2">
                            {item.title}
                          </h3>
                          <p className="text-slate-600">{item.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

// Committee Member Card Component
function CommitteeMemberCard({
  member,
  getColorClasses,
}: {
  member: Member;
  getColorClasses: (color: string) => any;
}) {
  const colors = getColorClasses(member.color);
  const IconComponent = iconMap[member.icon] || Shield;

  return (
    <Card className="border-none shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 overflow-hidden group">
      {/* Member Image */}
      <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
        {isGoogleDriveUrl(member.imageUrl) ? (
          <iframe
            src={getImageUrl(member.imageUrl)}
            className="w-full h-full border-0 pointer-events-none"
            allow="autoplay"
          />
        ) : (
          <img
            src={member.imageUrl}
            alt={member.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent pointer-events-none"></div>

        {/* Position Badge */}
        <div className="absolute top-4 right-4">
          <div
            className={`w-12 h-12 ${colors.bg} rounded-full flex items-center justify-center shadow-lg`}
          >
            <IconComponent className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      {/* Member Info Card */}
      <CardContent className="p-6 -mt-12 relative z-10">
        <div className="bg-white rounded-xl p-5 shadow-xl">
          <h3 className="text-xl font-bold text-slate-900 mb-1">
            {member.name}
          </h3>
          <Badge className={`${colors.badge} ${colors.text} border-none mb-3`}>
            {member.position}
          </Badge>

          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Briefcase className="w-4 h-4 flex-shrink-0" />
              <span className="font-medium">{member.organization}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Calendar className="w-4 h-4 flex-shrink-0" />
              <span>Tenure: {member.tenure}</span>
            </div>
          </div>

          <p className="text-sm text-slate-600 italic mb-4">
            {member.description}
          </p>

          {/* Contact Information */}
          <div className="space-y-2 pt-4 border-t">
            {member.email && (
              <Button
                variant="outline"
                className="w-full group/btn hover:bg-cyan-50 hover:border-cyan-600"
                asChild
              >
                <a href={`mailto:${member.email}`}>
                  <Mail className="w-4 h-4 mr-2 group-hover/btn:text-cyan-600 transition-colors" />
                  <span className="text-sm truncate">{member.email}</span>
                </a>
              </Button>
            )}
            
            {member.phone && (
              <Button
                variant="outline"
                className="w-full group/btn hover:bg-cyan-50 hover:border-cyan-600"
                asChild
              >
                <a href={`tel:${member.phone}`}>
                  <Phone className="w-4 h-4 mr-2 group-hover/btn:text-cyan-600 transition-colors" />
                  <span className="text-sm truncate">{member.phone}</span>
                </a>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

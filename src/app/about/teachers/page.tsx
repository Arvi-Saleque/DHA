"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  GraduationCap,
  Award,
  BookOpen,
  Mail,
  Calendar,
  ArrowLeft,
  Star,
  Phone,
  Trophy,
} from "lucide-react";

// Helper function to check if URL is Google Drive
const isGoogleDriveUrl = (url: string): boolean => {
  return url.includes('drive.google.com');
};

// Helper function to convert Google Drive URL to embeddable format
const getImageUrl = (url: string): string => {
  if (!url) return url;
  
  const driveMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (driveMatch) {
    const fileId = driveMatch[1];
    return `https://drive.google.com/file/d/${fileId}/preview`;
  }
  
  return url;
};

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
}

interface Category {
  name: string;
  order: number;
}

interface FacultyData {
  pageTitle: string;
  pageSubtitle: string;
  sectionTitle: string;
  sectionDescription: string;
  categories: Category[];
  teachers: Teacher[];
  quote: string;
  quoteAuthor: string;
}

export default function TeachersPage() {
  const [facultyData, setFacultyData] = useState<FacultyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  useEffect(() => {
    fetchFaculty();
  }, []);

  const fetchFaculty = async () => {
    try {
      const response = await fetch("/api/faculty");
      const result = await response.json();
      if (result.success && result.data) {
        setFacultyData(result.data);
        setActiveCategory("All");
      }
    } catch (error) {
      console.error("Error fetching faculty:", error);
    } finally {
      setLoading(false);
    }
  };

  // Default fallback data
  const defaultData: FacultyData = {
    pageTitle: "Our Distinguished Teachers",
    pageSubtitle: "Learn from experienced scholars dedicated to your success",
    sectionTitle: "Faculty Members",
    sectionDescription: "Dedicated educators combining traditional scholarship with modern teaching methods",
    categories: [
      { name: "Senior Faculty", order: 0 },
      { name: "Quran Department", order: 1 },
      { name: "Islamic Studies", order: 2 },
      { name: "Administration", order: 3 },
    ],
    teachers: [],
    quote: "A teacher can never truly teach unless he is still learning himself",
    quoteAuthor: "Our educators are lifelong learners committed to continuous growth",
  };

  const data = facultyData || defaultData;

  // Get teachers filtered by active category
  const getFilteredTeachers = () => {
    if (activeCategory === "All") {
      return data.teachers;
    }
    return data.teachers.filter(t => t.category === activeCategory);
  };

  // Get only categories that have teachers (with values)
  const activeCategories = data.categories.filter(cat => 
    data.teachers.some(t => t.category === cat.name)
  ).sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="mb-20 relative h-[300px] sm:h-[350px] md:h-[400px] bg-cyan-600 overflow-hidden">
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
            <GraduationCap className="w-3 h-3 mr-1" />
            Our Faculty
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 drop-shadow-lg">
            {loading ? "Loading..." : data.pageTitle}
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-cyan-50 max-w-3xl drop-shadow-md">
            {data.pageSubtitle}
          </p>
        </div>
      </section>

      {/* Teachers Grid Section */}
      <section className="container mx-auto px-4 pb-20">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            <Star className="w-3 h-3 mr-1" />
            Meet Our Team
          </Badge>
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            {data.sectionTitle}
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {data.sectionDescription}
          </p>
        </div>

        {/* Category Tabs */}
        <Tabs defaultValue="All" className="max-w-7xl mx-auto mb-8" onValueChange={(value) => setActiveCategory(value)}>
          <TabsList className={`grid w-full gap-2 bg-slate-100 p-2 rounded-xl mb-8`} style={{ gridTemplateColumns: `repeat(${Math.min(activeCategories.length + 1, 5)}, minmax(0, 1fr))` }}>
            <TabsTrigger value="All" className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white">
              All Teachers
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {getFilteredTeachers().map((teacher, index) => (
                <TeacherCard key={index} teacher={teacher} />
              ))}
            </div>
            {getFilteredTeachers().length === 0 && (
              <p className="text-center text-slate-500 py-16">
                No teachers found in this category.
              </p>
            )}
          </TabsContent>
        </Tabs>
      </section>

      {/* Quote Section */}
      <section className="py-20 bg-cyan-900">
        <div className="container mx-auto px-4">
          <Card className="border-none shadow-2xl bg-white/10 backdrop-blur-sm overflow-hidden max-w-4xl mx-auto">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              {data.quote && (
                <>
                  <blockquote className="text-2xl md:text-3xl font-bold text-white mb-4 leading-relaxed">
                    "{data.quote}"
                  </blockquote>
                  {data.quoteAuthor && (
                    <p className="text-cyan-100 text-lg">
                      {data.quoteAuthor}
                    </p>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

// Teacher Card Component
function TeacherCard({ teacher }: { teacher: Teacher }) {
  return (
    <Card className="border-none shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 overflow-hidden group">
      {/* Teacher Image */}
      <div className="relative h-72 overflow-hidden">
        {isGoogleDriveUrl(teacher.imageUrl) ? (
          <iframe
            src={getImageUrl(teacher.imageUrl)}
            className="w-full h-full border-0 pointer-events-none"
            allow="autoplay"
          />
        ) : (
          <img
            src={teacher.imageUrl}
            alt={teacher.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none"></div>

        {/* Name and Position Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <Badge className="mb-2 bg-cyan-500 text-white border-none">
            {teacher.category}
          </Badge>
          <h3 className="text-2xl font-bold mb-1">{teacher.name}</h3>
          <p className="text-cyan-100 text-sm">{teacher.position}</p>
        </div>
      </div>

      {/* Teacher Details */}
      <CardContent className="p-6 space-y-4">
        {/* Qualification */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Award className="w-5 h-5 text-cyan-600" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Qualification
            </p>
            <p className="text-sm text-slate-900 font-medium">
              {teacher.qualification}
            </p>
          </div>
        </div>

        {/* Experience */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Experience
            </p>
            <p className="text-sm text-slate-900 font-medium">
              {teacher.experience}
            </p>
          </div>
        </div>

        {/* Specialization */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Specialization
            </p>
            <p className="text-sm text-slate-900 font-medium">
              {teacher.specialization}
            </p>
          </div>
        </div>

        {/* Achievements */}
        {teacher.achievements && teacher.achievements.length > 0 && (
          <div className="pt-4 border-t border-slate-200">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Key Achievements
            </p>
            <div className="space-y-2">
              {teacher.achievements.map((achievement: string, index: number) => (
                <div key={index} className="flex items-start gap-2">
                  <Trophy className="w-3 h-3 text-amber-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-slate-600">{achievement}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact Button */}
        {teacher.email && (
          <Button
            variant="outline"
            className="w-full mt-4 group/btn hover:bg-cyan-50 hover:border-cyan-600"
            asChild
          >
            <a href={`mailto:${teacher.email}`}>
              <Mail className="w-4 h-4 mr-2 group-hover/btn:text-cyan-600 transition-colors" />
              <span className="text-sm truncate">{teacher.email}</span>
            </a>
          </Button>
        )}
        
        {teacher.phone && (
          <Button
            variant="outline"
            className="w-full group/btn hover:bg-cyan-50 hover:border-cyan-600"
            asChild
          >
            <a href={`tel:${teacher.phone}`}>
              <Phone className="w-4 h-4 mr-2 group-hover/btn:text-cyan-600 transition-colors" />
              <span className="text-sm truncate">{teacher.phone}</span>
            </a>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

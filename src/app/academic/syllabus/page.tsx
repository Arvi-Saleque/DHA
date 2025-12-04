"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Download,
  Eye,
  GraduationCap,
  ArrowLeft,
  FileText,
  Target,
  Award,
  List,
} from "lucide-react";

interface Syllabus {
  _id: string;
  className: string;
  subject: string;
  pdfUrl: string;
  isActive: boolean;
}

// Convert Google Drive link to embed URL
const convertGoogleDriveUrl = (url: string): string => {
  const match = url.match(/\/file\/d\/([^\/]+)/);
  if (match && match[1]) {
    return `https://drive.google.com/file/d/${match[1]}/preview`;
  }
  return url;
};

export default function SyllabusPage() {
  const [syllabuses, setSyllabuses] = useState<Syllabus[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState("Play Group");

  const classes = ['Play Group', 'Nursery', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7'];

  useEffect(() => {
    fetchSyllabuses();
  }, []);

  const fetchSyllabuses = async () => {
    try {
      const response = await fetch('/api/syllabus');
      const data = await response.json();
      setSyllabuses(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching syllabuses:', error);
      setLoading(false);
    }
  };

  const handleViewDetails = (pdfUrl: string) => {
    const match = pdfUrl.match(/\/file\/d\/([^\/]+)/);
    if (match && match[1]) {
      window.open(`https://drive.google.com/file/d/${match[1]}/view`, '_blank');
    }
  };

  const handleDownload = (pdfUrl: string) => {
    const match = pdfUrl.match(/\/file\/d\/([^\/]+)/);
    if (match && match[1]) {
      window.open(`https://drive.google.com/uc?export=download&id=${match[1]}`, '_blank');
    }
  };

  const syllabusFeatures = [
    {
      icon: List,
      title: "Detailed Topics",
      description: "Comprehensive breakdown of all topics and subtopics",
    },
    {
      icon: Target,
      title: "Learning Outcomes",
      description: "Clear objectives and expected learning outcomes",
    },
    {
      icon: Award,
      title: "Assessment Methods",
      description: "Evaluation criteria and examination guidelines",
    },
    {
      icon: BookOpen,
      title: "Subject Coverage",
      description: "Complete coverage of all subjects and materials",
    },
  ];

  const classGroups = classes.map(cls => ({
    id: cls.toLowerCase().replace(' ', '-'),
    label: cls,
    syllabuses: syllabuses.filter((s) => s.className === cls),
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="mb-20 relative h-[300px] sm:h-[350px] md:h-[400px] bg-cyan-600 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>

        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-white text-center">
          <Link href="/">
            <Button
              variant="ghost"
              className="absolute top-4 left-4 sm:top-6 sm:left-6 md:top-8 md:left-8 text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Back to Home</span>
              <span className="sm:hidden">Back</span>
            </Button>
          </Link>

          <Badge
            variant="secondary"
            className="mb-4 bg-white/20 backdrop-blur-sm text-white border-white/30"
          >
            <FileText className="w-3 h-3 mr-1" />
            Academic Portal
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 drop-shadow-lg">
            Course Syllabus
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-cyan-50 max-w-3xl drop-shadow-md">
            Detailed syllabus for all subjects and class levels
          </p>
        </div>
      </section>

      {/* Syllabus Features */}
      <section className="container mx-auto px-4 mb-12">
        <div className="text-center mb-8">
          <Badge variant="outline" className="mb-4">
            <Target className="w-3 h-3 mr-1" />
            What's Included
          </Badge>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Syllabus Features
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Comprehensive syllabus with detailed content and learning objectives
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {syllabusFeatures.map((item, index) => (
            <Card
              key={index}
              className="border-none shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 bg-gradient-to-br from-white to-slate-50"
            >
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Main Content - Syllabus by Class */}
      <section className="container mx-auto px-4 pb-20">
        <Card className="border-none shadow-xl">
          <CardHeader className="border-b bg-slate-50/50">
            <CardTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-6 h-6 text-cyan-600" />
              Subject Syllabus by Class Level
            </CardTitle>
            <p className="text-sm text-slate-600 mt-2">
              Select a class to view and download subject syllabi
            </p>
          </CardHeader>

          <CardContent className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
                <p className="text-slate-600 mt-4">Loading syllabuses...</p>
              </div>
            ) : (
              <Tabs
                value={selectedClass}
                onValueChange={setSelectedClass}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2 bg-slate-100 p-2 rounded-xl mb-8 h-auto">
                  {classGroups.map((group) => (
                    <TabsTrigger
                      key={group.id}
                      value={group.label}
                      className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white text-xs sm:text-sm py-2"
                    >
                      {group.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {classGroups.map((group) => (
                  <TabsContent
                    key={group.id}
                    value={group.label}
                    className="space-y-6"
                  >
                    {group.syllabuses.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {group.syllabuses.map((syllabus) => (
                          <Card
                            key={syllabus._id}
                            className="border-2 hover:border-cyan-300 transition-all overflow-hidden group"
                          >
                            {/* PDF Preview Section */}
                            <div className="relative h-48 overflow-hidden bg-slate-100">
                              <iframe
                                src={convertGoogleDriveUrl(syllabus.pdfUrl)}
                                className="w-full h-full border-0 pointer-events-none"
                                allow="autoplay"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                              
                              
                            </div>

                            {/* Content Section */}
                            <CardContent className="p-6">
                              <div className="mb-4">
                                <Badge variant="outline" className="gap-1">
                                  <GraduationCap className="w-3 h-3" />
                                  {syllabus.subject}
                                </Badge>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="flex-1"
                                  onClick={() => handleViewDetails(syllabus.pdfUrl)}
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  View
                                </Button>
                                <Button
                                  size="sm"
                                  className="flex-1 bg-cyan-600 hover:bg-cyan-700"
                                  onClick={() => handleDownload(syllabus.pdfUrl)}
                                >
                                  <Download className="w-4 h-4 mr-1" />
                                  PDF
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">
                          No Syllabus Available
                        </h3>
                        <p className="text-slate-600">
                          Syllabus for {group.label} will be available soon.
                        </p>
                      </div>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            )}
          </CardContent>
        </Card>

        {/* Additional Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="border-l-4 border-l-cyan-500">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <List className="w-8 h-8 text-cyan-600 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">
                    Structured Content
                  </h3>
                  <p className="text-sm text-slate-600">
                    Each syllabus includes detailed chapter breakdowns with topics and subtopics for systematic learning.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Target className="w-8 h-8 text-blue-600 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">
                    Learning Objectives
                  </h3>
                  <p className="text-sm text-slate-600">
                    Clear learning outcomes and objectives for each unit to guide students and teachers effectively.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Award className="w-8 h-8 text-purple-600 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">
                    Assessment Guidelines
                  </h3>
                  <p className="text-sm text-slate-600">
                    Comprehensive evaluation methods and examination guidelines for each subject area.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notice Card */}
        <Card className="mt-8 border-2 border-amber-200 bg-amber-50/50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Important Information
                </h3>
                <p className="text-slate-700 mb-2">
                  • All syllabi are reviewed and updated at the beginning of each academic year
                </p>
                <p className="text-slate-700 mb-2">
                  • Teachers may adjust pace based on class progress while covering all topics
                </p>
                <p className="text-slate-700">
                  • Students are encouraged to review the syllabus regularly to track their progress
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

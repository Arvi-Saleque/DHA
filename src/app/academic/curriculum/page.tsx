"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BookOpen,
  Download,
  Eye,
  GraduationCap,
  ArrowLeft,
  FileText,
  Users,
  Target,
  Award,
  CheckCircle2,
  X,
} from "lucide-react";

interface Curriculum {
  _id: string;
  category: string;
  pdfUrl: string;
}

// Convert Google Drive link to embed URL
const convertGoogleDriveUrl = (url: string): string => {
  const match = url.match(/\/file\/d\/([^\/]+)/);
  if (match && match[1]) {
    return `https://drive.google.com/file/d/${match[1]}/preview`;
  }
  return url;
};

export default function CurriculumPage() {
  const [curriculums, setCurriculums] = useState<Curriculum[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Pre Hifz");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxPdfUrl, setLightboxPdfUrl] = useState("");

  const categories = ['Pre Hifz', 'Hifz', 'Post Hifz'];

  useEffect(() => {
    fetchCurriculums();
  }, []);

  const fetchCurriculums = async () => {
    try {
      const response = await fetch('/api/curriculum');
      const data = await response.json();
      setCurriculums(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching curriculums:', error);
      setLoading(false);
    }
  };

  const handleViewDetails = (pdfUrl: string) => {
    // Check if it's a Google Drive URL
    const match = pdfUrl.match(/\/file\/d\/([^\/]+)/);
    if (match && match[1]) {
      window.open(`https://drive.google.com/file/d/${match[1]}/view`, '_blank');
    } else {
      // For other URLs (Cloudinary, etc.), open directly
      window.open(pdfUrl, '_blank');
    }
  };

  const handleDownload = (pdfUrl: string) => {
    // Check if it's a Google Drive URL
    const match = pdfUrl.match(/\/file\/d\/([^\/]+)/);
    if (match && match[1]) {
      window.open(`https://drive.google.com/uc?export=download&id=${match[1]}`, '_blank');
    } else {
      // For other URLs, trigger download
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = 'curriculum.pdf';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const categoryGroups = categories.map(cat => ({
    id: cat.toLowerCase().replace(' ', '-'),
    label: cat,
    curriculum: curriculums.find((c) => c.category === cat),
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
            <BookOpen className="w-3 h-3 mr-1" />
            Academic Portal
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 drop-shadow-lg">
            Curriculum Overview
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-cyan-50 max-w-3xl drop-shadow-md">
            Comprehensive curriculum combining Islamic studies with modern education
          </p>
        </div>
      </section>

      {/* Curriculum Highlights */}
      <section className="container mx-auto px-4 mb-12">
        <div className="text-center mb-8">
          <Badge variant="outline" className="mb-4">
            <Target className="w-3 h-3 mr-1" />
            Our Focus
          </Badge>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Curriculum Highlights
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            A balanced approach to Islamic and contemporary education
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-none shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 bg-gradient-to-br from-white to-slate-50">
            <CardContent className="p-6 text-center">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Quranic Studies</h3>
              <p className="text-sm text-slate-600">Memorization, Tajweed, and Tafsir</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 bg-gradient-to-br from-white to-slate-50">
            <CardContent className="p-6 text-center">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Islamic Jurisprudence</h3>
              <p className="text-sm text-slate-600">Fiqh, Hadith, and Islamic Law</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 bg-gradient-to-br from-white to-slate-50">
            <CardContent className="p-6 text-center">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Arabic Language</h3>
              <p className="text-sm text-slate-600">Grammar, Literature, and Conversation</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 bg-gradient-to-br from-white to-slate-50">
            <CardContent className="p-6 text-center">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Award className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">General Education</h3>
              <p className="text-sm text-slate-600">Mathematics, Science, and Social Studies</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Main Content - Curriculum by Category */}
      <section className="container mx-auto px-4 pb-20">
        <Card className="border-none shadow-xl">
          <CardHeader className="border-b bg-slate-50/50">
            <CardTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-6 h-6 text-cyan-600" />
              Curriculum by Category
            </CardTitle>
            <p className="text-sm text-slate-600 mt-2">
              Select a category to view detailed curriculum information
            </p>
          </CardHeader>

          <CardContent className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
                <p className="text-slate-600 mt-4">Loading curriculums...</p>
              </div>
            ) : (
              <>
                {/* Mobile Dropdown Filter */}
                <div className="md:hidden mb-6">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryGroups.map((group) => (
                        <SelectItem key={group.id} value={group.label}>
                          {group.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Desktop Tabs Filter */}
                <Tabs
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                  className="w-full hidden md:block"
                >
                  <TabsList className="grid w-full grid-cols-3 gap-2 bg-slate-100 p-2 rounded-xl mb-8 h-auto">
                    {categoryGroups.map((group) => (
                      <TabsTrigger
                        key={group.id}
                        value={group.label}
                        className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white text-sm py-3"
                      >
                        {group.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>

                {/* Content for both mobile and desktop */}
                {categoryGroups.map((group) => (
                  selectedCategory === group.label && (
                    <div key={group.id} className="space-y-6">
                      {group.curriculum ? (
                        <Card className="border-2 hover:border-cyan-300 transition-all overflow-hidden">
                          <div className="relative">
                            {/* PDF Viewer Section */}
                            <div 
                              className="relative h-[400px] sm:h-[500px] md:h-[600px] bg-slate-100 cursor-pointer group"
                              onClick={() => {
                                setLightboxPdfUrl(group.curriculum!.pdfUrl);
                                setLightboxOpen(true);
                              }}
                            >
                            <iframe
                              src={convertGoogleDriveUrl(group.curriculum.pdfUrl)}
                              className="w-full h-full border-0 pointer-events-none"
                              allow="autoplay"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all flex items-center justify-center">
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-4">
                                <Eye className="w-8 h-8 text-cyan-600" />
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="p-4 sm:p-6 bg-slate-50 flex flex-col sm:flex-row gap-3">
                            <Button
                              variant="outline"
                              className="flex-1"
                              onClick={() => handleViewDetails(group.curriculum!.pdfUrl)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Full Details
                            </Button>
                            <Button
                              className="flex-1 bg-cyan-600 hover:bg-cyan-700"
                              onClick={() => handleDownload(group.curriculum!.pdfUrl)}
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download PDF
                            </Button>
                          </div>
                        </div>
                      </Card>
                      ) : (
                        <div className="text-center py-12">
                          <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                          <h3 className="text-xl font-semibold text-slate-900 mb-2">
                            No Curriculum Available
                          </h3>
                          <p className="text-slate-600">
                            Curriculum for {group.label} will be available soon.
                          </p>
                        </div>
                      )}
                    </div>
                  )
                ))}
              </>
            )}
          </CardContent>
        </Card>

        {/* Additional Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="border-l-4 border-l-cyan-500">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <BookOpen className="w-8 h-8 text-cyan-600 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">
                    Comprehensive Learning
                  </h3>
                  <p className="text-sm text-slate-600">
                    Our curriculum integrates Islamic education with modern
                    academic subjects for holistic development.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Award className="w-8 h-8 text-blue-600 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">
                    Certified Programs
                  </h3>
                  <p className="text-sm text-slate-600">
                    All programs are certified and follow established Islamic
                    educational standards and guidelines.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Users className="w-8 h-8 text-purple-600 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">
                    Expert Faculty
                  </h3>
                  <p className="text-sm text-slate-600">
                    Taught by qualified scholars and teachers with years of
                    experience in Islamic and academic education.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* PDF Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-full max-h-full w-screen h-screen p-0 border-0 m-0">
          <div className="relative w-full h-screen bg-black">
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 z-50 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all hover:scale-110"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
            {lightboxPdfUrl && (
              <iframe
                src={convertGoogleDriveUrl(lightboxPdfUrl)}
                className="w-full h-full border-0"
                allow="autoplay"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

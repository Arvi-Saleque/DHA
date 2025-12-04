"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Download,
  Eye,
  Clock,
  ArrowLeft,
  FileText,
  GraduationCap,
  AlertCircle,
  Award,
  TrendingUp,
  BarChart3,
  CheckCircle2,
  FileSpreadsheet,
  Loader2,
} from "lucide-react";

interface ExamResult {
  _id: string;
  className: string;
  examName: string;
  examType: string;
  publishedDate: string;
  pdfUrl: string;
  passPercentage: number;
}

export default function ResultsPage() {
  const [selectedGrade, setSelectedGrade] = useState<string>("all");
  const [selectedExamType, setSelectedExamType] = useState<string>("all");
  const [examResults, setExamResults] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const response = await fetch('/api/exam-results');
      const data = await response.json();
      setExamResults(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching results:', error);
      setLoading(false);
    }
  };

  const stats = [
    {
      icon: FileSpreadsheet,
      value: examResults.length.toString(),
      label: "Published Results",
      color: "text-cyan-600",
    },
    {
      icon: GraduationCap,
      value: new Set(examResults.map(r => r.className)).size.toString(),
      label: "Classes",
      color: "text-blue-600",
    },
    {
      icon: TrendingUp,
      value: examResults.length > 0 
        ? `${Math.round(examResults.reduce((sum, r) => sum + r.passPercentage, 0) / examResults.length)}%`
        : "0%",
      label: "Avg Pass Rate",
      color: "text-green-600",
    },
    {
      icon: Award,
      value: new Set(examResults.map(r => r.examType)).size.toString(),
      label: "Exam Types",
      color: "text-amber-600",
    },
  ];

  const getExamTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      Midterm: "bg-cyan-500",
      Final: "bg-purple-500",
      Terminal: "bg-amber-500",
    };
    return colors[type] || "bg-gray-500";
  };

  const getExamTypeBadge = (type: string) => {
    const badges: Record<string, { label: string; color: string }> = {
      Midterm: {
        label: "Midterm",
        color: "bg-cyan-100 text-cyan-700 border-cyan-300",
      },
      Final: {
        label: "Final",
        color: "bg-purple-100 text-purple-700 border-purple-300",
      },
      Terminal: {
        label: "Terminal",
        color: "bg-amber-100 text-amber-700 border-amber-300",
      },
    };
    return badges[type] || { label: type, color: "bg-gray-100 text-gray-700 border-gray-300" };
  };

  const getPassPercentageColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 75) return "text-blue-600";
    if (percentage >= 60) return "text-amber-600";
    return "text-rose-600";
  };

  const convertToViewUrl = (url: string) => {
    const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (fileIdMatch) {
      return `https://drive.google.com/file/d/${fileIdMatch[1]}/view`;
    }
    return url;
  };

  const convertToDownloadUrl = (url: string) => {
    const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (fileIdMatch) {
      return `https://drive.google.com/uc?export=download&id=${fileIdMatch[1]}`;
    }
    return url;
  };

  const handleDownload = (pdfUrl: string) => {
    const downloadUrl = convertToDownloadUrl(pdfUrl);
    window.open(downloadUrl, '_blank');
  };

  const filteredResults = examResults.filter((result) => {
    const matchesGrade =
      selectedGrade === "all" || result.className === selectedGrade;
    const matchesType =
      selectedExamType === "all" || result.examType === selectedExamType;
    return matchesGrade && matchesType;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative bg-cyan-600 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>

        <div className="relative container mx-auto px-4 flex flex-col justify-center items-center text-center z-10">
          <Link
            href="/academic"
            className="absolute top-6 left-6 inline-flex items-center text-white/90 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Academic
          </Link>

          <Badge
            variant="secondary"
            className="mb-4 bg-white/20 backdrop-blur-sm text-white border-white/30"
          >
            <BarChart3 className="w-3 h-3 mr-1" />
            Academic Results
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 drop-shadow-lg">
            Examination Results
          </h1>
          <p className="text-lg md:text-xl text-cyan-50 max-w-2xl drop-shadow-md">
            View and download exam results for all classes
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-cyan-600" />
            <span className="ml-3 text-lg text-gray-600">Loading results...</span>
          </div>
        ) : (
          <>
        <Card className="border-none shadow-xl">
          <CardHeader className="border-b bg-slate-50/50">
            <CardTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-6 h-6 text-cyan-600" />
              Published Exam Results
            </CardTitle>
            <CardDescription className="mt-2">
              Filter by class and exam type to view specific results
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6">
            {/* Filter Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 p-4 bg-slate-50 rounded-lg border">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-cyan-600" />
                  Filter by Class
                </label>
                <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    <SelectItem value="Play Group">Play Group</SelectItem>
                    <SelectItem value="Nursery">Nursery</SelectItem>
                    <SelectItem value="Class 1">Class 1</SelectItem>
                    <SelectItem value="Class 2">Class 2</SelectItem>
                    <SelectItem value="Class 3">Class 3</SelectItem>
                    <SelectItem value="Class 4">Class 4</SelectItem>
                    <SelectItem value="Class 5">Class 5</SelectItem>
                    <SelectItem value="Class 6">Class 6</SelectItem>
                    <SelectItem value="Class 7">Class 7</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-purple-600" />
                  Filter by Exam Type
                </label>
                <Select
                  value={selectedExamType}
                  onValueChange={setSelectedExamType}
                >
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Select exam type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Exam Types</SelectItem>
                    <SelectItem value="Midterm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                        Midterm Examination
                      </div>
                    </SelectItem>
                    <SelectItem value="Final">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                        Final Examination
                      </div>
                    </SelectItem>
                    <SelectItem value="Terminal">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                        Terminal Examination
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              {filteredResults.length > 0 ? (
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm text-slate-600">
                      Showing <strong>{filteredResults.length}</strong> result
                      {filteredResults.length !== 1 ? "s" : ""}
                    </p>
                    {(selectedGrade !== "all" ||
                      selectedExamType !== "all") && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedGrade("all");
                          setSelectedExamType("all");
                        }}
                      >
                        Clear Filters
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredResults.map((result) => {
                      const typeColor = getExamTypeColor(result.examType);
                      const typeBadge = getExamTypeBadge(result.examType);
                      const passColor = getPassPercentageColor(
                        result.passPercentage
                      );

                      return (
                        <Card
                          key={result._id}
                          className="border-2 hover:border-cyan-300 transition-all overflow-hidden group"
                        >
                          <CardHeader className="bg-gradient-to-r from-slate-50 to-cyan-50 border-b pb-4">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <div
                                    className={`w-1 h-8 rounded-full ${typeColor}`}
                                  ></div>
                                  <div>
                                    <CardTitle className="text-lg text-slate-900 leading-tight">
                                      {result.examName}
                                    </CardTitle>
                                    <p className="text-sm text-slate-600 mt-1">
                                      {result.className}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="mt-10 flex flex-col gap-2 items-end">
                                <Badge
                                  variant="outline"
                                  className={typeBadge.color}
                                >
                                  {typeBadge.label}
                                </Badge>
                              </div>
                            </div>

                            {/* Result Details */}
                            <div className="flex items-center gap-4 text-sm text-slate-600 mt-3">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  Published:{" "}
                                  {new Date(
                                    result.publishedDate
                                  ).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </span>
                              </div>
                              <Badge variant="secondary" className="ml-auto">
                                <TrendingUp
                                  className={`w-3 h-3 mr-1 ${passColor}`}
                                />
                                <span className={passColor}>
                                  {result.passPercentage}% Pass
                                </span>
                              </Badge>
                            </div>
                          </CardHeader>

                          <CardContent className="p-6">
                            <div className="flex gap-3">
                              <Button
                                className="flex-1 bg-cyan-600 hover:bg-cyan-700"
                                onClick={() =>
                                  window.open(convertToViewUrl(result.pdfUrl), "_blank")
                                }
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View Results
                              </Button>
                              <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => handleDownload(result.pdfUrl)}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download PDF
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    No Results Found
                  </h3>
                  <p className="text-slate-600">
                    No examination results match your current filters.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setSelectedGrade("all");
                      setSelectedExamType("all");
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
          </>
        )}

        {/* Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="border-l-4 border-l-cyan-500">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Eye className="w-8 h-8 text-cyan-600 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">View Online</h3>
                  <p className="text-sm text-slate-600">
                    Click "View Results" to see the complete result sheet in
                    your browser.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Download className="w-8 h-8 text-blue-600 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">
                    Download PDF
                  </h3>
                  <p className="text-sm text-slate-600">
                    Download exam results as PDF files for offline access and
                    printing.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Award className="w-8 h-8 text-green-600 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">
                    Pass Percentage
                  </h3>
                  <p className="text-sm text-slate-600">
                    Each result shows the overall class pass percentage for
                    quick insights.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Important Notice */}
        <Card className="mt-8 border-2 border-blue-200 bg-blue-50/50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">
                  Important Notice
                </h3>
                <div className="space-y-2 text-slate-700">
                  <p className="flex items-start gap-2">
                    <span className="font-bold text-blue-600 mt-0.5">•</span>
                    <span>
                      Results are published within <strong>2 weeks</strong>{" "}
                      after the examination ends
                    </span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="font-bold text-blue-600 mt-0.5">•</span>
                    <span>
                      Students can <strong>collect original mark sheets</strong>{" "}
                      from the administrative office
                    </span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="font-bold text-blue-600 mt-0.5">•</span>
                    <span>
                      For any <strong>discrepancies or queries</strong>, contact
                      your class teacher within 7 days
                    </span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="font-bold text-blue-600 mt-0.5">•</span>
                    <span>
                      Re-evaluation requests must be submitted with the{" "}
                      <strong>prescribed fee</strong>
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Legend */}
        <Card className="mt-6 bg-slate-50">
          <CardContent className="p-4">
            <p className="text-sm font-semibold text-slate-900 mb-3">
              Pass Rate Indicators:
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <span className="text-sm text-slate-700">
                  90% or above - Excellent
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                <span className="text-sm text-slate-700">
                  75-89% - Very Good
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-amber-500"></div>
                <span className="text-sm text-slate-700">60-74% - Good</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-rose-500"></div>
                <span className="text-sm text-slate-700">
                  Below 60% - Needs Improvement
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

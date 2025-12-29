"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  GraduationCap,
  FileText,
  CheckCircle2,
  Phone,
  Mail,
  Clock,
  Users,
  ClipboardList,
  FileCheck,
  Image,
  Award,
  Calendar,
  BookOpen,
  Shield,
  Star,
  LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Users,
  FileText,
  ClipboardList,
  FileCheck,
  Image,
  Award,
  Calendar,
  CheckCircle2,
  BookOpen,
  GraduationCap,
  Shield,
  Star,
};

interface Item {
  title: string;
  description: string;
  icon: string;
  order: number;
}

interface AdmissionData {
  title: string;
  description: string;
  requirements: Item[];
  documents: Item[];
  admissionProcess: string;
  contactInfo: {
    phone: string;
    email: string;
    officeHours: string;
  };
}

export default function AdmissionPage() {
  const [data, setData] = useState<AdmissionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admission");
      if (res.ok) {
        const admissionData = await res.json();
        setData(admissionData);
      }
    } catch (error) {
      console.error("Error fetching admission data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
          <p className="text-lg text-gray-600 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">No admission information available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative h-[300px] sm:h-[350px] md:h-[400px] bg-cyan-600 overflow-hidden">
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
            <GraduationCap className="w-3 h-3 mr-1" />
            Enrollment
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 drop-shadow-lg">
            {data.title}
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-cyan-50 max-w-3xl drop-shadow-md">
            {data.description}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-16">
        {/* Admission Requirements */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Requirements
            </Badge>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Admission Requirements
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Please ensure you meet the following criteria before applying
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="border-none shadow-xl">
              <CardContent className="p-8">
                <div className="space-y-6">
                  {data.requirements
                    .sort((a, b) => a.order - b.order)
                    .map((req, index) => {
                      const Icon = iconMap[req.icon] || FileText;
                      return (
                        <div
                          key={index}
                          className="flex items-start gap-4 pb-6 border-b border-slate-200 last:border-0 last:pb-0"
                        >
                          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-slate-900 mb-2">
                              {req.title}
                            </h3>
                            <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                              {req.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Required Documents */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              <FileText className="w-3 h-3 mr-1" />
              Documents
            </Badge>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Required Documents
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Prepare these documents for your admission application
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="border-none shadow-xl">
              <CardContent className="p-8">
                <div className="space-y-6">
                  {data.documents
                    .sort((a, b) => a.order - b.order)
                    .map((doc, index) => {
                      const Icon = iconMap[doc.icon] || FileCheck;
                      return (
                        <div
                          key={index}
                          className="flex items-start gap-4 pb-6 border-b border-slate-200 last:border-0 last:pb-0"
                        >
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-slate-900 mb-2">
                              {doc.title}
                            </h3>
                            <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                              {doc.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Admission Process */}
        {data.admissionProcess && (
          <div className="mb-16">
            <div className="text-center mb-8">
              <Badge variant="outline" className="mb-4">
                <ClipboardList className="w-3 h-3 mr-1" />
                Process
              </Badge>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Admission Process
              </h2>
            </div>
            <Card className="border-none shadow-xl max-w-4xl mx-auto">
              <CardContent className="p-8">
                <p className="text-slate-700 text-lg leading-relaxed">
                  {data.admissionProcess}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Contact Information */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <Badge variant="outline" className="mb-4">
              <Phone className="w-3 h-3 mr-1" />
              Contact
            </Badge>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Contact Information
            </h2>
            <p className="text-slate-600">
              Get in touch with our admission office for any queries
            </p>
          </div>
          <Card className="border-none shadow-xl">
            <CardContent className="p-8">
              <div className="space-y-6">
                {data.contactInfo.phone && (
                  <div className="flex items-start gap-4 pb-6 border-b border-slate-200">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900 mb-2">
                        Phone
                      </h3>
                      <p className="text-slate-600">{data.contactInfo.phone}</p>
                    </div>
                  </div>
                )}

                {data.contactInfo.email && (
                  <div className="flex items-start gap-4 pb-6 border-b border-slate-200">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900 mb-2">
                        Email
                      </h3>
                      <p className="text-slate-600">{data.contactInfo.email}</p>
                    </div>
                  </div>
                )}

                {data.contactInfo.officeHours && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900 mb-2">
                        Office Hours
                      </h3>
                      <p className="text-slate-600">
                        {data.contactInfo.officeHours}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

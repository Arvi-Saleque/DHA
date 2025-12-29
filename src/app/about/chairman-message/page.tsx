"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Quote,
  ArrowLeft,
  Heart,
  BookOpen,
  Users,
  Target,
  Award,
  Sparkles,
  MessageCircle,
  Globe,
  Star,
  CheckCircle,
  Shield,
  Zap,
  Compass,
  Flag,
  Clock,
  TrendingUp,
  Eye,
  Lightbulb,
} from "lucide-react";

// Helper function to get icon component from string name
const getIconComponent = (iconName: string) => {
  const icons: { [key: string]: any } = {
    BookOpen,
    Heart,
    Users,
    Target,
    Award,
    Lightbulb,
    Star,
    CheckCircle,
    Shield,
    Zap,
    Sparkles,
    Compass,
    Flag,
    MessageCircle,
    Clock,
    TrendingUp,
    Globe,
    Eye,
  };
  return icons[iconName] || BookOpen;
};

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

interface CoreValue {
  icon: string;
  title: string;
  description: string;
}

interface ChairmanMessageData {
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

export default function ChairmanMessagePage() {
  const [chairmanData, setChairmanData] = useState<ChairmanMessageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChairmanMessage();
  }, []);

  const fetchChairmanMessage = async () => {
    try {
      const response = await fetch("/api/chairman-message");
      const result = await response.json();
      if (result.success && result.data) {
        setChairmanData(result.data);
      }
    } catch (error) {
      console.error("Error fetching chairman message:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-cyan-600 mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Loading Chairman's Message...</p>
        </div>
      </div>
    );
  }

  if (!chairmanData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-center px-4">
          <MessageCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            No Message Available
          </h3>
          <p className="text-slate-600 mb-6">
            The chairman's message has not been set up yet.
          </p>
          <Link href="/about">
            <Button className="bg-cyan-600 hover:bg-cyan-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to About
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const data = chairmanData;

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
            <MessageCircle className="w-3 h-3 mr-1" />
            Leadership Message
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 drop-shadow-lg">
            Chairman's Message
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-cyan-50 max-w-3xl drop-shadow-md">
            A message from our esteemed Chairman
          </p>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="container mx-auto px-4 -mt-12 sm:-mt-16 md:-mt-20 relative z-10 pb-20">
        {/* Chairman Profile Card */}
        <Card className="border-none shadow-2xl bg-white overflow-hidden mb-12 sm:mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Profile Image Section */}
            <div className="lg:col-span-1 relative">
              <div className="relative h-[400px] sm:h-[500px] lg:h-full overflow-hidden bg-gradient-to-br from-cyan-100 to-blue-100">
                {isGoogleDriveUrl(data.chairmanImageUrl) ? (
                  <iframe
                    src={getImageUrl(data.chairmanImageUrl)}
                    className="w-full h-full border-0 pointer-events-none"
                    allow="autoplay"
                  />
                ) : (
                  <img
                    src={data.chairmanImageUrl}
                    alt={data.chairmanName}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
                
                {/* Chairman Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/50">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <Badge className="bg-cyan-500 text-white border-none">
                      Chairman
                    </Badge>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold mb-2">
                    {data.chairmanName}
                  </h3>
                  <p className="text-cyan-100 text-sm sm:text-base">
                    {data.chairmanTitle}
                  </p>
                  <p className="text-cyan-100 text-sm mt-2">
                    Serving Since {data.servingSince}
                  </p>
                </div>
              </div>
            </div>

            {/* Message Content Section */}
            <div className="lg:col-span-2 p-6 sm:p-8 lg:p-12">
              {/* Quote Icon */}
              <div className="flex justify-start mb-6">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-6">
                  <Quote className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
              </div>

              {/* Message Title */}
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6">
                {data.messageTitle}
              </h2>

              {/* Message Content */}
              <div className="prose prose-lg max-w-none text-slate-700 space-y-4 sm:space-y-6">
                {data.messageParagraphs.map((paragraph, index) => (
                  <p key={index} className="text-base sm:text-lg leading-relaxed">
                    {paragraph}
                  </p>
                ))}

                {data.closingMessage && (
                  <div className="pt-6 border-t border-slate-200 mt-8">
                    <p className="text-base sm:text-lg font-semibold text-slate-900 mb-2">
                      {data.closingMessage}
                    </p>
                    <p className="text-base sm:text-lg text-slate-600 italic">
                      {data.closingRegards}
                    </p>
                    <div className="mt-4 flex items-center gap-4">
                      {data.signatureImageUrl && (
                        <div className="relative">
                          {isGoogleDriveUrl(data.signatureImageUrl) ? (
                            <iframe
                              src={getImageUrl(data.signatureImageUrl)}
                              className="w-[150px] h-[60px] border-0 pointer-events-none opacity-70"
                              allow="autoplay"
                            />
                          ) : (
                            <img
                              src={data.signatureImageUrl}
                              alt="Signature"
                              width={150}
                              height={60}
                              className="opacity-70"
                            />
                          )}
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-lg text-slate-900">
                          {data.chairmanName}
                        </p>
                        <p className="text-sm text-slate-600">Chairman</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Core Values Section */}
        <div className="mb-12 sm:mb-16">
          <div className="text-center mb-8 sm:mb-12">
            <Badge variant="outline" className="mb-4">
              <Sparkles className="w-3 h-3 mr-1" />
              Our Guiding Principles
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Chairman's Vision & Values
            </h2>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
              The principles that guide our institution's mission and growth
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {data.coreValues.map((value, index) => {
              const IconComponent = getIconComponent(value.icon);
              return (
                <Card
                  key={index}
                  className="border-none shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 bg-gradient-to-br from-white to-slate-50"
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">
                      {value.title}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Achievements Section */}
        <div>
          <div className="text-center mb-8 sm:mb-12">
            <Badge variant="outline" className="mb-4">
              <Award className="w-3 h-3 mr-1" />
              Our Journey
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Key Achievements Under Leadership
            </h2>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
              Milestones achieved through dedicated leadership and teamwork
            </p>
          </div>

          <Card className="border-none shadow-xl bg-white">
            <CardContent className="p-6 sm:p-8 lg:p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {data.achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 sm:gap-4 p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {index + 1}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700 font-medium pt-1">
                      {achievement}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Inspirational Quote Section */}
      <section className="bg-cyan-900 py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <Card className="border-none shadow-2xl bg-white/10 backdrop-blur-sm overflow-hidden max-w-4xl mx-auto">
            <CardContent className="p-8 sm:p-12 text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Quote className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </div>
              {data.inspirationalQuote && (
                <>
                  <blockquote className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6 leading-relaxed">
                    "{data.inspirationalQuote}"
                  </blockquote>
                  <p className="text-base sm:text-lg text-cyan-100">
                    - {data.quoteAuthor || data.chairmanName}
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

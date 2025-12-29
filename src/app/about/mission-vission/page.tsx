"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Target,
  Eye,
  BookOpen,
  Users,
  Award,
  Heart,
  Lightbulb,
  TrendingUp,
  ArrowLeft,
  CheckCircle2,
  Globe,
  Star,
  CheckCircle,
  Shield,
  Zap,
  Sparkles,
  Compass,
  Flag,
  MessageCircle,
  Clock,
} from "lucide-react";

// Helper function to get icon component from string name
const getIconComponent = (iconName: string) => {
  const icons: { [key: string]: any } = {
    BookOpen,
    Heart,
    Users,
    Lightbulb,
    Award,
    TrendingUp,
    Target,
    Eye,
    Globe,
    Star,
    CheckCircle,
    Shield,
    Zap,
    Sparkles,
    Compass,
    Flag,
    MessageCircle,
    Clock,
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
  
  // Check if it's a Google Drive link
  const driveMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (driveMatch) {
    const fileId = driveMatch[1];
    // Use preview format for iframe display like exam page
    return `https://drive.google.com/file/d/${fileId}/preview`;
  }
  
  return url;
};

interface MissionPoint {
  icon: string;
  title: string;
  description: string;
}

interface VisionPoint {
  icon: string;
  title: string;
  description: string;
}

interface CoreValue {
  name: string;
  color: string;
}

interface MissionVisionData {
  missionTitle: string;
  missionDescription: string;
  missionImageUrl: string;
  missionPoints: MissionPoint[];
  visionTitle: string;
  visionDescription: string;
  visionImageUrl: string;
  visionPoints: VisionPoint[];
  coreValues: CoreValue[];
}

export default function MissionVisionPage() {
  const [missionVisionData, setMissionVisionData] = useState<MissionVisionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMissionVision();
  }, []);

  const fetchMissionVision = async () => {
    try {
      const response = await fetch("/api/mission-vision");
      const result = await response.json();
      if (result.success && result.data) {
        setMissionVisionData(result.data);
      }
    } catch (error) {
      console.error("Error fetching mission vision:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-cyan-600 mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Loading Mission & Vision...</p>
        </div>
      </div>
    );
  }

  if (!missionVisionData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-center px-4">
          <Target className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            No Mission & Vision Available
          </h3>
          <p className="text-slate-600 mb-6">
            The mission and vision content has not been set up yet.
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

  const data = missionVisionData;

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
            <Target className="w-3 h-3 mr-1" />
            Our Purpose
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 drop-shadow-lg">
            {loading ? "Loading..." : "Mission & Vision"}
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-cyan-50 max-w-3xl drop-shadow-md">
            Guiding Principles That Drive Our Commitment to Excellence
          </p>
        </div>
      </section>

      {/* Mission & Vision Cards */}
      <section className="container mx-auto px-4 -mt-12 sm:-mt-16 md:-mt-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16 md:mb-20">
          {/* Mission Card */}
          <Card className="border-none shadow-2xl bg-white overflow-hidden group hover:shadow-cyan-200/50 transition-all">
            <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
              {isGoogleDriveUrl(data.missionImageUrl) ? (
                <iframe
                  src={getImageUrl(data.missionImageUrl)}
                  className="w-full h-full border-0 pointer-events-none"
                  allow="autoplay"
                />
              ) : (
                <img
                  src={data.missionImageUrl}
                  alt={data.missionTitle}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/90 to-transparent pointer-events-none"></div>
              <div className="absolute bottom-6 left-6">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-3">
                  <Target className="w-8 h-8 text-cyan-600" />
                </div>
                <h2 className="text-3xl font-bold text-white">{data.missionTitle}</h2>
              </div>
            </div>
            <CardContent className="p-8">
              <p className="text-lg text-slate-700 mb-6 leading-relaxed">
                {data.missionDescription.split('\n').map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < data.missionDescription.split('\n').length - 1 && <br />}
                  </span>
                ))}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.missionPoints.map((point, index) => {
                  const IconComponent = getIconComponent(point.icon);
                  return (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-cyan-50 transition-colors"
                    >
                      <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-5 h-5 text-cyan-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 text-sm mb-1">
                          {point.title}
                        </h4>
                        <p className="text-xs text-slate-600">
                          {point.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Vision Card */}
          <Card className="border-none shadow-2xl bg-white overflow-hidden group hover:shadow-purple-200/50 transition-all">
            <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
              {isGoogleDriveUrl(data.visionImageUrl) ? (
                <iframe
                  src={getImageUrl(data.visionImageUrl)}
                  className="w-full h-full border-0 pointer-events-none"
                  allow="autoplay"
                />
              ) : (
                <img
                  src={data.visionImageUrl}
                  alt={data.visionTitle}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/90 to-transparent pointer-events-none"></div>
              <div className="absolute bottom-6 left-6">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-3">
                  <Eye className="w-8 h-8 text-purple-600" />
                </div>
                <h2 className="text-3xl font-bold text-white">{data.visionTitle}</h2>
              </div>
            </div>
            <CardContent className="p-8">
              <p className="text-lg text-slate-700 mb-6 leading-relaxed">
                {data.visionDescription.split('\n').map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < data.visionDescription.split('\n').length - 1 && <br />}
                  </span>
                ))}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.visionPoints.map((point, index) => {
                  const IconComponent = getIconComponent(point.icon);
                  return (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-purple-50 transition-colors"
                    >
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 text-sm mb-1">
                          {point.title}
                        </h4>
                        <p className="text-xs text-slate-600">
                          {point.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-cyan-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Our Foundation
            </Badge>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Core Values
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              The principles that shape our identity and guide our actions
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {data.coreValues.map((value, index) => (
                <Card
                  key={index}
                  className="border-none shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer group"
                >
                  <CardContent className="p-6 text-center">
                    <div
                      className={`w-16 h-16 ${value.color} rounded-2xl mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform`}
                    >
                      <CheckCircle2 className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {value.name}
                    </h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

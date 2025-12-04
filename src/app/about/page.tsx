"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  BookOpen,
  Users,
  Award,
  GraduationCap,
  Trophy,
  Target,
  Heart,
  Globe,
  Mail,
  Phone,
  Calendar,
  ArrowRight,
  ArrowLeft,
  Loader2,
  HelpCircle,
} from "lucide-react";
import * as LucideIcons from "lucide-react";

interface CoreValue {
  icon: string;
  title: string;
  description: string;
}

interface FAQ {
  question: string;
  answer: string;
}

interface AboutData {
  _id: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  establishedYear: string;
  features: string[];
  coreValues: CoreValue[];
  faqs: FAQ[];
}

export default function AboutPage() {
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const response = await fetch('/api/about-us');
      const data = await response.json();
      setAboutData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching about data:', error);
      setLoading(false);
    }
  };

  const getIconComponent = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent || LucideIcons.Heart;
  };

  const getImageUrl = (url: string) => {
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

  const isGoogleDriveUrl = (url: string) => {
    return url.includes('drive.google.com');
  };

  const stats = [
    { icon: Users, value: "2000+", label: "Students", color: "text-cyan-600" },
    {
      icon: GraduationCap,
      value: "150+",
      label: "Teachers",
      color: "text-blue-600",
    },
    {
      icon: Award,
      value: "25+",
      label: "Years Experience",
      color: "text-purple-600",
    },
    {
      icon: Trophy,
      value: "50+",
      label: "Awards Won",
      color: "text-amber-600",
    },
  ];

  const defaultValues = [
    {
      icon: "Heart",
      title: "Faith & Character",
      description: "Building strong Islamic character and values in every student",
    },
    {
      icon: "BookOpen",
      title: "Quality Education",
      description: "Providing comprehensive Islamic and modern education",
    },
    {
      icon: "Users",
      title: "Community Focus",
      description: "Serving the community through knowledge and service",
    },
    {
      icon: "Globe",
      title: "Global Perspective",
      description: "Preparing students for success in a global context",
    },
  ];

  const values = aboutData?.coreValues && aboutData.coreValues.length > 0 
    ? aboutData.coreValues 
    : defaultValues;

  const quickLinks = [
    {
      title: "Our Mission & Vision",
      description: "Learn about our goals and aspirations",
      icon: Target,
      href: "/about/mission-vission",
      color: "from-cyan-500 to-blue-600",
    },
    {
      title: "Our Teachers",
      description: "Meet our distinguished faculty members",
      icon: GraduationCap,
      href: "/about/teachers",
      color: "from-blue-500 to-purple-600",
    },
    {
      title: "Management Committee",
      description: "Our dedicated leadership team",
      icon: Users,
      href: "/about/committee",
      color: "from-purple-500 to-pink-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative h-[300px] sm:h-[350px] md:h-[400px] bg-cyan-600 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>

        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-white text-center">
          <Badge
            variant="secondary"
            className="mb-4 bg-white/20 backdrop-blur-sm text-white border-white/30"
          >
            <BookOpen className="w-3 h-3 mr-1" />
            About Madrasa MX
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 drop-shadow-lg">
            About Our Madrasa
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-cyan-50 max-w-3xl drop-shadow-md">
            {aboutData ? aboutData.subtitle : "Nurturing Islamic Knowledge & Excellence Since 1999"}
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="container mx-auto px-4 py-20">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-cyan-600" />
            <span className="ml-3 text-lg text-gray-600">Loading content...</span>
          </div>
        ) : aboutData ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
          <div className="relative h-[300px] sm:h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl bg-gray-200">
            {aboutData.imageUrl ? (
              isGoogleDriveUrl(aboutData.imageUrl) ? (
                <iframe
                  src={getImageUrl(aboutData.imageUrl)}
                  className="w-full h-full border-0"
                  allow="autoplay"
                />
              ) : (
                <img
                  src={aboutData.imageUrl}
                  alt="Madrasa Building"
                  className="w-full h-full object-cover"
                />
              )
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <BookOpen className="h-20 w-20" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <Badge className="mb-2 bg-cyan-500">Established {aboutData.establishedYear}</Badge>
              <h3 className="text-2xl font-bold">{new Date().getFullYear() - parseInt(aboutData.establishedYear)}+ Years of Excellence</h3>
            </div>
          </div>

          <div>
            <Badge variant="outline" className="mb-4">
              <BookOpen className="w-3 h-3 mr-1" />
              Our Story
            </Badge>
            <h2 className="text-4xl font-bold text-slate-900 mb-6">
              {aboutData.title}
            </h2>
            <p className="text-lg text-slate-600 mb-6 whitespace-pre-line">
              {aboutData.description}
            </p>
            {aboutData.features.length > 0 && (
              <div className="space-y-3">
                {aboutData.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-cyan-600 rounded-full"></div>
                    <p className="text-slate-700">{feature}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        ) : (
          <div className="text-center py-20 text-gray-500">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No content available yet.</p>
          </div>
        )}
      </section>

      {/* Core Values Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            <Heart className="w-3 h-3 mr-1" />
            What We Stand For
          </Badge>
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Our Core Values
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            The fundamental principles that guide everything we do
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {values.map((value, index) => {
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
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-slate-600">{value.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-cyan-900 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 bg-white/10 text-white">
              Common Questions
            </Badge>
            <h2 className="text-4xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Find answers to common questions about our madrasa
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {aboutData && aboutData.faqs && aboutData.faqs.length > 0 ? (
              <Accordion type="single" collapsible className="space-y-4">
                {aboutData.faqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index + 1}`}
                    className="bg-white/10 backdrop-blur-sm border-white/20 rounded-lg px-6"
                  >
                    <AccordionTrigger className="text-white hover:text-cyan-200">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-slate-300">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="text-center py-8 text-slate-300">
                <HelpCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No FAQs available yet.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

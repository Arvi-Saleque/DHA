"use client";

import { useState, useEffect } from "react";
import Header from "@/components/common/header";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import * as Icons from "lucide-react";
import {
  BookOpen,
  Users,
  Calendar,
  Trophy,
  GraduationCap,
  Clock,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  CheckCircle,
  Newspaper,
  Target,
  Heart,
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  Shield,
  UserCircle2,
} from "lucide-react";

export default function Home() {
  const [currentReview, setCurrentReview] = useState(0);
  const [reviews, setReviews] = useState<Array<{
    _id?: string;
    name: string;
    relation: string;
    image: string;
    gender?: string;
    rating: number;
    review: string;
    order: number;
    isActive: boolean;
  }>>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [reviewStats, setReviewStats] = useState<{
    ratingDistribution: { 5: number; 4: number; 3: number; 2: number; 1: number };
    totalReviews: number;
    averageRating: string;
  } | null>(null);
  const [reviewSettings, setReviewSettings] = useState({
    trustedByText: "Trusted by",
    familiesCount: "500+ Families",
    averageRatingText: "Average Rating",
    averageRatingValue: "5.0/5.0",
  });
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [newsEvents, setNewsEvents] = useState<Array<{
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    imageUrl: string;
    category: string;
    date: string;
    time?: string;
    author: string;
    tags: string[];
    isActive?: boolean;
  }>>([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [galleryImages, setGalleryImages] = useState<Array<{
    _id: string;
    title: string;
    category: string;
    imageUrl: string;
    date: Date;
    location: string;
    description: string;
    order: number;
  }>>([]);
  const [loadingGallery, setLoadingGallery] = useState(true);
  const [aboutUsData, setAboutUsData] = useState<{
    title: string;
    subtitle: string;
    description: string;
    imageUrl: string;
    establishedYear: string;
    features: string[];
    coreValues: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
  } | null>(null);
  const [loadingAboutUs, setLoadingAboutUs] = useState(true);
  const [homePageData, setHomePageData] = useState<{
    statsSection: Array<{
      value: string;
      label: string;
      order: number;
    }>;
    excellenceSection: {
      badge: string;
      title: string;
      description: string;
      features: Array<{
        icon: string;
        title: string;
        description: string;
        order: number;
      }>;
    };
  } | null>(null);
  const [loadingHomePage, setLoadingHomePage] = useState(true);

  useEffect(() => {
    fetchHomePage();
    fetchReviews();
    fetchNewsEvents();
    fetchGallery();
    fetchAboutUs();
    fetchReviewSettings();
  }, []);

  const fetchHomePage = async () => {
    try {
      const response = await fetch("/api/homepage");
      if (response.ok) {
        const data = await response.json();
        setHomePageData(data);
      }
    } catch (error) {
      console.error("Error fetching homepage:", error);
    } finally {
      setLoadingHomePage(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await fetch("/api/reviews");
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews || data);
        if (data.stats) {
          setReviewStats(data.stats);
        }
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoadingReviews(false);
    }
  };

  const fetchNewsEvents = async () => {
    try {
      const response = await fetch("/api/homepage-news");
      if (response.ok) {
        const data = await response.json();
        if (data.newsEvents) {
          setNewsEvents(data.newsEvents);
        }
      }
    } catch (error) {
      console.error("Error fetching news events:", error);
    } finally {
      setLoadingNews(false);
    }
  };

  const fetchGallery = async () => {
    try {
      const response = await fetch("/api/homepage-gallery");
      if (response.ok) {
        const data = await response.json();
        if (data.images) {
          setGalleryImages(data.images);
        }
      }
    } catch (error) {
      console.error("Error fetching gallery:", error);
    } finally {
      setLoadingGallery(false);
    }
  };

  const fetchAboutUs = async () => {
    try {
      const response = await fetch("/api/about-us");
      if (response.ok) {
        const data = await response.json();
        setAboutUsData(data);
      }
    } catch (error) {
      console.error("Error fetching about us:", error);
    } finally {
      setLoadingAboutUs(false);
    }
  };

  const fetchReviewSettings = async () => {
    try {
      const response = await fetch("/api/review-settings");
      if (response.ok) {
        const data = await response.json();
        setReviewSettings(data);
      }
    } catch (error) {
      console.error("Error fetching review settings:", error);
    }
  };

  const getIcon = (iconName: string) => {
    const Icon = (Icons as any)[iconName];
    return Icon || BookOpen;
  };

  const nextReview = () => {
    if (reviews.length > 0) {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }
  };

  const prevReview = () => {
    if (reviews.length > 0) {
      setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length);
    }
  };

  const goToReview = (index: number) => {
    setCurrentReview(index);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentReview < reviews.length - 1) {
      nextReview();
    }
    if (isRightSwipe && currentReview > 0) {
      prevReview();
    }
    
    setTouchStart(0);
    setTouchEnd(0);
  };

  return (
    <div>
      <Header />

      {/* About Us Section */}
      <section className="container mx-auto px-4 py-16 sm:py-20">
        {loadingAboutUs ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
          </div>
        ) : aboutUsData ? (
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <Badge className="bg-cyan-100 text-cyan-700 border-cyan-300">
                <GraduationCap className="w-3 h-3 mr-1" />
                About Our Institution
              </Badge>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
                {aboutUsData.title}
              </h2>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                {aboutUsData.description.split('\n').map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < aboutUsData.description.split('\n').length - 1 && <br />}
                  </span>
                ))}
              </p>
              {aboutUsData.subtitle && (
                <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                  {aboutUsData.subtitle}
                </p>
              )}
              
              {/* Key Highlights */}
              {aboutUsData.features && aboutUsData.features.length > 0 && (
                <div className="grid sm:grid-cols-2 gap-4 pt-4">
                  {aboutUsData.features.slice(0, 4).map((feature, index) => {
                    const colors = [
                      { bg: 'bg-green-100', icon: 'text-green-600' },
                      { bg: 'bg-blue-100', icon: 'text-blue-600' },
                      { bg: 'bg-purple-100', icon: 'text-purple-600' },
                      { bg: 'bg-amber-100', icon: 'text-amber-600' },
                    ];
                    const color = colors[index % colors.length];
                    
                    return (
                      <div key={index} className="flex items-start gap-3">
                        <div className={`w-10 h-10 ${color.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <CheckCircle className={`w-5 h-5 ${color.icon}`} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-1">{feature}</h4>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/about">
                  <Button className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-6 text-base">
                    Learn More About Us
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/admission">
                  <Button variant="outline" className="border-2 border-cyan-600 text-cyan-600 hover:bg-cyan-50 px-6 py-6 text-base">
                    Apply for Admission
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Image/Visual */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-3xl transform rotate-3"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 space-y-6">
                {/* Core Values */}
                {aboutUsData.coreValues && aboutUsData.coreValues.length > 0 && aboutUsData.coreValues.slice(0, 3).map((value, index) => {
                  const gradients = [
                    'bg-gradient-to-br from-cyan-500 to-blue-600',
                    'bg-gradient-to-br from-purple-500 to-pink-600',
                    'bg-gradient-to-br from-green-500 to-emerald-600',
                  ];
                  const gradient = gradients[index % gradients.length];
                  
                  // Get icon component from lucide-react
                  const IconComponent = (Icons as any)[value.icon] || Target;
                  
                  return (
                    <div key={index} className="flex items-start gap-4">
                      <div className={`w-12 h-12 ${gradient} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-900 mb-2">{value.title}</h4>
                        <p className="text-sm text-slate-600">
                          {value.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-10 text-slate-600">
            <p>No About Us content available.</p>
          </div>
        )}
      </section>

      {/* Divider */}
      <div className="container mx-auto px-4">
        <Separator className="bg-gradient-to-r from-transparent via-cyan-200 to-transparent" />
      </div>

      {/* Why Choose Us Section */}
      <section className="container mx-auto px-4 py-20">
        {loadingHomePage ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
          </div>
        ) : homePageData ? (
          <>
            <div className="text-center space-y-4 mb-16">
              <Badge className="bg-purple-100 text-purple-700 border-purple-300">
                {homePageData.excellenceSection.badge}
              </Badge>
              <h2 className="text-4xl font-bold text-slate-900">
                {homePageData.excellenceSection.title}
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                {homePageData.excellenceSection.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {homePageData.excellenceSection.features
                .sort((a, b) => a.order - b.order)
                .map((feature, index) => {
                  const FeatureIcon = getIcon(feature.icon);
                  const colors = [
                    { bg: "bg-cyan-100", text: "text-cyan-600" },
                    { bg: "bg-blue-100", text: "text-blue-600" },
                    { bg: "bg-purple-100", text: "text-purple-600" },
                    { bg: "bg-amber-100", text: "text-amber-600" },
                    { bg: "bg-rose-100", text: "text-rose-600" },
                    { bg: "bg-green-100", text: "text-green-600" },
                  ];
                  const color = colors[index % colors.length];

                  return (
                    <Card key={index} className="border-2 border-slate-200 hover:border-cyan-300 transition-colors">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 ${color.bg} rounded-full flex items-center justify-center flex-shrink-0`}>
                            <FeatureIcon className={`w-6 h-6 ${color.text}`} />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">
                              {feature.title}
                            </h3>
                            <p className="text-sm text-slate-600">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
            </div>
          </>
        ) : null}
      </section>

      {/* Stats Section */}
      <section className="bg-cyan-600 py-12 sm:py-16">
        <div className="container mx-auto px-4">
          {loadingHomePage ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          ) : homePageData ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 text-center text-white">
              {homePageData.statsSection
                .sort((a, b) => a.order - b.order)
                .map((stat, index) => (
                  <div key={index}>
                    <div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
                    <p className="text-cyan-100 text-sm sm:text-base md:text-lg">{stat.label}</p>
                  </div>
                ))}
            </div>
          ) : null}
        </div>
      </section>

      {/* Parent & Guardian Reviews Section */}
      <section className="bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-50 py-16 sm:py-20">
        <div className="container mx-auto px-4">
          {loadingReviews ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
            </div>
          ) : reviews.length > 0 ? (
            <>
              <div className="text-center space-y-4 mb-12 sm:mb-16">
                <Badge className="bg-cyan-500 text-white border-none shadow-md">
                  <Heart className="w-3 h-3 mr-1" />
                  Parent & Guardian Testimonials
                </Badge>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900">
                  Trusted by Our Community
                </h2>
                <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
                  Real experiences from parents and guardians who trust us with their children's education
                </p>
              </div>

              <div className="relative max-w-6xl mx-auto">
                {/* Review Cards */}
                <div className="overflow-hidden rounded-2xl">
                  <div
                    className="transition-transform duration-700 ease-in-out"
                    style={{ transform: `translateX(-${currentReview * 100}%)` }}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                  >
                    <div className="flex">
                      {reviews
                        .sort((a, b) => a.order - b.order)
                        .map((review, index) => (
                            <div
                              key={index}
                              className="w-full flex-shrink-0 px-2 sm:px-4"
                              style={{ minWidth: "100%" }}
                            >
                              <div className="relative">
                                {/* Decorative Quote Background */}
                                <div className="absolute -top-6 -left-4 sm:-left-8 w-24 h-24 sm:w-32 sm:h-32 bg-cyan-100 rounded-full opacity-20 blur-2xl"></div>
                                <div className="absolute -bottom-6 -right-4 sm:-right-8 w-24 h-24 sm:w-32 sm:h-32 bg-blue-100 rounded-full opacity-20 blur-2xl"></div>

                                <Card className="relative border-none shadow-2xl bg-white/95 backdrop-blur-sm overflow-hidden">
                                  {/* Top Gradient Bar */}
                                  <div className="h-1.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500"></div>

                                  <CardContent className="p-6 sm:p-8 lg:p-12">
                                    {/* Reviewer Profile Section */}
                                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-6 sm:mb-8">
                                      {/* Profile Image with decorative ring */}
                                      <div className="relative flex-shrink-0">
                                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full animate-pulse opacity-20"></div>
                                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-white shadow-xl ring-4 ring-cyan-100">
                                          {review.image ? (
                                            <img
                                              src={review.image}
                                              alt={review.name}
                                              className="w-full h-full object-cover"
                                            />
                                          ) : (
                                            <div className={`w-full h-full flex items-center justify-center ${
                                              review.gender === "female" ? "bg-pink-100" : "bg-blue-100"
                                            }`}>
                                              <UserCircle2 className={`w-16 h-16 sm:w-20 sm:h-20 ${
                                                review.gender === "female" ? "text-pink-400" : "text-blue-400"
                                              }`} />
                                            </div>
                                          )}
                                        </div>
                                        {/* Verified Badge */}
                                        <div className="absolute -bottom-1 -right-1 w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                                          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                        </div>
                                      </div>

                                      {/* Name and Relation */}
                                      <div className="flex-1 text-center sm:text-left">
                                        <h4 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">
                                          {review.name}
                                        </h4>
                                        <p className="text-sm sm:text-base text-cyan-600 font-medium mb-3">
                                          {review.relation}
                                        </p>
                                        {/* Rating Stars */}
                                        <div className="flex justify-center sm:justify-start gap-1">
                                          {[...Array(review.rating)].map((_, i) => (
                                            <Star
                                              key={i}
                                              className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400 text-amber-400"
                                            />
                                          ))}
                                        </div>
                                      </div>

                                      {/* Floating Quote Icon */}
                                      <div className="hidden sm:block flex-shrink-0">
                                        <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg rotate-6 hover:rotate-0 transition-transform duration-300">
                                          <Quote className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                                        </div>
                                      </div>
                                    </div>

                                    {/* Divider */}
                                    <div className="relative mb-6 sm:mb-8">
                                      <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-slate-200"></div>
                                      </div>
                                      <div className="relative flex justify-center">
                                        <div className="bg-white px-4">
                                          <Quote className="w-5 h-5 text-cyan-400" />
                                        </div>
                                      </div>
                                    </div>

                                    {/* Review Text */}
                                    <blockquote className="relative">
                                      <p className="text-base sm:text-lg lg:text-xl text-slate-700 leading-relaxed text-center sm:text-left">
                                        {review.review}
                                      </p>
                                    </blockquote>
                                  </CardContent>

                                  {/* Bottom Decorative Element */}
                                  <div className="h-2 bg-gradient-to-r from-transparent via-cyan-200 to-transparent"></div>
                                </Card>
                              </div>
                            </div>
                        ))}
                    </div>
                  </div>
                </div>

                {reviews.length > 1 && (
                    <>
                      {/* Navigation Arrows - Desktop */}
                      <button
                        onClick={prevReview}
                        className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 xl:-translate-x-20 w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full shadow-xl hover:shadow-2xl items-center justify-center text-white hover:scale-110 transition-all duration-300 group"
                        aria-label="Previous review"
                      >
                        <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
                      </button>
                      <button
                        onClick={nextReview}
                        className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 xl:translate-x-20 w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full shadow-xl hover:shadow-2xl items-center justify-center text-white hover:scale-110 transition-all duration-300 group"
                        aria-label="Next review"
                      >
                        <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
                      </button>

                      {/* Navigation Arrows - Mobile/Tablet */}
                      <div className="flex lg:hidden justify-center gap-4 mt-6">
                        <button
                          onClick={prevReview}
                          className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center text-white active:scale-95 transition-all"
                          aria-label="Previous review"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={nextReview}
                          className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center text-white active:scale-95 transition-all"
                          aria-label="Next review"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Dots Navigation */}
                      <div className="flex justify-center gap-2 sm:gap-3 mt-8">
                        {reviews.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => goToReview(index)}
                            className={`transition-all duration-300 ${
                              currentReview === index
                                ? "w-10 sm:w-12 h-2.5 sm:h-3 bg-gradient-to-r from-cyan-500 to-blue-600 shadow-md"
                                : "w-2.5 sm:w-3 h-2.5 sm:h-3 bg-slate-300 hover:bg-cyan-300"
                            } rounded-full`}
                            aria-label={`Go to review ${index + 1}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

              {/* Rating Distribution */}
              {reviewStats && (
                <div className="mt-12 sm:mt-16 max-w-2xl mx-auto">
                  <Card className="border-2 border-cyan-100 shadow-xl">
                    <CardContent className="p-6 sm:p-8">
                      <div className="text-center mb-6">
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">Rating Distribution</h3>
                        <p className="text-slate-600">{reviewStats.totalReviews} Total Reviews from Families</p>
                      </div>
                      
                      <div className="space-y-3">
                        {[5, 4, 3, 2, 1].map((stars) => {
                          const count = reviewStats.ratingDistribution[stars as keyof typeof reviewStats.ratingDistribution];
                          const percentage = reviewStats.totalReviews > 0 ? (count / reviewStats.totalReviews) * 100 : 0;
                          
                          return (
                            <div key={stars} className="flex items-center gap-3">
                              <div className="flex items-center gap-1 w-20">
                                <span className="text-sm font-semibold text-slate-700">{stars}</span>
                                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                              </div>
                              <div className="flex-1 h-6 bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500 flex items-center justify-end pr-2"
                                  style={{ width: `${percentage}%` }}
                                >
                                  {count > 0 && (
                                    <span className="text-xs font-semibold text-white">{count}</span>
                                  )}
                                </div>
                              </div>
                              <span className="text-sm font-medium text-slate-600 w-12 text-right">{percentage.toFixed(0)}%</span>
                            </div>
                          );
                        })}
                      </div>
                      
                      <div className="mt-6 pt-6 border-t border-slate-200 text-center">
                        <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                          <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
                          <div className="text-left">
                            <p className="text-xs text-slate-500 font-medium">Average Rating</p>
                            <p className="text-2xl font-bold text-slate-900">{reviewStats.averageRating}/5.0</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </>
          ) : null}
        </div>
      </section>

      {/* Latest News & Events Section */}
      <section className="container mx-auto px-4 py-16 sm:py-20">
        <div className="text-center space-y-4 mb-12">
          <Badge className="bg-blue-100 text-blue-700 border-blue-300">
            <Newspaper className="w-3 h-3 mr-1" />
            Latest Updates
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900">
            News & Events
          </h2>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            Stay updated with our latest activities, achievements, and upcoming events
          </p>
        </div>

        {loadingNews ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
          </div>
        ) : newsEvents.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {newsEvents.map((news) => {
              const getCategoryStyle = (category: string) => {
                const styles: Record<string, { bg: string; text: string }> = {
                  news: { bg: "bg-blue-100", text: "text-blue-700" },
                  event: { bg: "bg-purple-100", text: "text-purple-700" },
                  achievement: { bg: "bg-amber-100", text: "text-amber-700" },
                  announcement: { bg: "bg-rose-100", text: "text-rose-700" },
                };
                return styles[category.toLowerCase()] || styles.news;
              };
              
              const categoryStyle = getCategoryStyle(news.category);

              return (
                <Link key={news._id} href={`/news-events/${news.slug}`} className="block">
                  <Card className="border-none shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden group h-full">
                    <div className="relative h-48 bg-slate-200 overflow-hidden">
                      <img
                        src={news.imageUrl}
                        alt={news.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                      <Badge className={`absolute top-4 right-4 ${categoryStyle.bg} ${categoryStyle.text} border-0`}>
                        {news.category.charAt(0).toUpperCase() + news.category.slice(1)}
                      </Badge>
                    </div>

                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {new Date(news.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                        {news.time && (
                          <>
                            <span>•</span>
                            <Clock className="w-3 h-3" />
                            <span>{news.time}</span>
                          </>
                        )}
                      </div>
                      <CardTitle className="text-xl font-bold text-slate-900 line-clamp-2 group-hover:text-cyan-600 transition-colors">
                        {news.title}
                      </CardTitle>
                    </CardHeader>

                    <CardContent>
                      <p className="text-sm text-slate-600 mb-4 line-clamp-3">
                        {news.excerpt}
                      </p>

                      {news.tags && news.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {news.tags.slice(0, 3).map((tag, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs bg-slate-50">
                              {tag}
                            </Badge>
                          ))}
                          {news.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs bg-slate-50">
                              +{news.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-3 border-t">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Users className="w-3 h-3" />
                          <span>{news.author}</span>
                        </div>
                        <Button variant="link" className="text-cyan-600 hover:text-cyan-700 p-0 h-auto">
                          Read More →
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Newspaper className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No news events available at the moment</p>
          </div>
        )}

        <div className="text-center">
          <Link href="/news-events">
            <Button className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-6 text-base">
              View All News & Events
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-50 py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <Badge className="bg-purple-100 text-purple-700 border-purple-300">
              <Trophy className="w-3 h-3 mr-1" />
              Our Gallery
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900">
              Moments & Memories
            </h2>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
              Explore the vibrant life at Darul Hikmah Academy through our photo gallery
            </p>
          </div>

          {loadingGallery ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          ) : galleryImages.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {galleryImages.map((image) => (
                  <Card
                    key={image._id}
                    className="overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 border-none shadow-lg"
                  >
                    <div className="relative h-64">
                      <img
                        src={image.imageUrl}
                        alt={image.title}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-white/90 text-gray-800">
                          {image.category}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2 text-slate-900">
                        {image.title}
                      </h3>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(image.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        {image.location}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="text-center">
                <Link href="/gallery">
                  <Button className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-6 text-base">
                    View Full Gallery
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">Gallery images coming soon</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

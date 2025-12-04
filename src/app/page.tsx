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
} from "lucide-react";

export default function Home() {
  const [currentReview, setCurrentReview] = useState(0);
  const [reviews, setReviews] = useState<Array<{
    _id?: string;
    name: string;
    relation: string;
    image: string;
    rating: number;
    review: string;
    order: number;
    isActive: boolean;
  }>>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
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
        setReviews(data);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoadingReviews(false);
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

  return (
    <div>
      <Header />

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
                                          <img
                                            src={review.image}
                                            alt={review.name}
                                            className="w-full h-full object-cover"
                                          />
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

              {/* Trust Badge */}
              <div className="mt-12 sm:mt-16 flex justify-center gap-4 sm:gap-6 flex-wrap">
                <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-white rounded-2xl shadow-lg border-2 border-cyan-100 hover:shadow-xl transition-shadow">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">Trusted by</p>
                    <p className="text-lg sm:text-xl font-bold text-slate-900">500+ Families</p>
                  </div>
                </div>
                <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-white rounded-2xl shadow-lg border-2 border-cyan-100 hover:shadow-xl transition-shadow">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                    <Star className="w-5 h-5 sm:w-6 sm:h-6 fill-white text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">Average Rating</p>
                    <p className="text-lg sm:text-xl font-bold text-slate-900">5.0/5.0</p>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </section>
    </div>
  );
}

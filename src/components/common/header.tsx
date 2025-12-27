"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import LinkCardButton from "@/components/common/link-card-button";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Users,
  GraduationCap,
  PencilIcon,
  UserXIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Slide {
  _id?: string;
  image: string;
  title: string;
  subtitle: string;
  description: string;
  primaryButton: string;
  primaryButtonUrl: string;
  secondaryButton: string;
  secondaryButtonUrl: string;
  order: number;
  isActive: boolean;
}

// Features to display
const features = [
  {
    href: "/academic/assignments",
    icon: BookOpen,
    title: "Today's Homework",
    description: "View assigned homework for today",
  },
  {
    href: "/next-exam",
    icon: PencilIcon,
    title: "Next exam",
    description: "Check the schedule for the upcoming exam",
  },
  {
    href: "/absences",
    icon: UserXIcon,
    title: "Today's absence",
    description: "See the list of absent students today",
  },
];

export default function Header() {
  const [slides, setSlides] = React.useState<Slide[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = React.useState(true);

  React.useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const res = await fetch("/api/header-slides");
      if (res.ok) {
        const data = await res.json();
        setSlides(data);
      }
    } catch (error) {
      console.error("Error fetching slides:", error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-play functionality
  React.useEffect(() => {
    if (!isAutoPlaying || slides.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <header className="relative">
      {/* Hero Slider Section */}
      <div className="relative h-[600px] sm:h-[700px] md:h-[800px] lg:h-screen w-full overflow-hidden">
        {loading ? (
          <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
              <p>Loading...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Slides */}
            {slides.map((slide, index) => (
              <div
                key={slide._id || index}
                className={cn(
                  "absolute inset-0 transition-all duration-1000 ease-in-out",
                  currentSlide === index
                    ? "opacity-100 translate-x-0"
                    : index < currentSlide
                    ? "opacity-0 -translate-x-full"
                    : "opacity-0 translate-x-full"
                )}
              >
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover"
                priority={index === 0}
                loading={index === 0 ? "eager" : "lazy"}
                sizes="100vw"
                quality={85}
              />
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex h-full items-center">
              <div className="container mx-auto px-4">
                <div className="max-w-3xl space-y-4 sm:space-y-6 animate-fade-in text-center sm:text-left">
                  {/* Subtitle Badge */}
                  <div className="inline-flex items-center gap-2 rounded-full bg-primary/20 px-3 py-1.5 sm:px-4 sm:py-2 backdrop-blur-sm border border-primary/30">
                    <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-xs sm:text-sm font-medium text-white">
                      {slide.subtitle}
                    </span>
                  </div>

                  {/* Main Title */}
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-white">
                    {slide.title}
                  </h1>

                  {/* Description */}
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 px-2 sm:px-0">
                    {slide.description}
                  </p>

                  {/* Buttons */}
                  <div className="flex flex-wrap gap-3 sm:gap-4 pt-4 justify-center sm:justify-start">
                    <Link href={slide.primaryButtonUrl || "/admission"}>
                      <Button
                        size="lg"
                        className="h-10 px-5 text-sm sm:h-12 sm:px-8 sm:text-base font-semibold shadow-lg hover:shadow-xl transition-all"
                      >
                        {slide.primaryButton}
                      </Button>
                    </Link>
                    <Link href={slide.secondaryButtonUrl || "/about"}>
                      <Button
                        size="lg"
                        variant="outline"
                        className="h-10 px-5 text-sm sm:h-12 sm:px-8 sm:text-base font-semibold bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 hover:text-white shadow-lg"
                      >
                        {slide.secondaryButton}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        {slides.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-1 sm:left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/10 p-1 sm:p-3 backdrop-blur-sm border border-white/20 text-white transition-all hover:bg-white/20 hover:scale-110"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-3 w-3 sm:h-6 sm:w-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-1 sm:right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/10 p-1 sm:p-3 backdrop-blur-sm border border-white/20 text-white transition-all hover:bg-white/20 hover:scale-110"
              aria-label="Next slide"
            >
              <ChevronRight className="h-3 w-3 sm:h-6 sm:w-6" />
            </button>

            {/* Dots Navigation */}
            <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-3">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    currentSlide === index
                      ? "w-12 bg-white"
                      : "w-2 bg-white/50 hover:bg-white/75"
                  )}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
        </>
        )}
      </div>

      {/* Features Section (Below Slider) */}
      <div className="relative -mt-12 sm:-mt-16 md:-mt-20 z-30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">
            {features.map((feature, index) => (
              <LinkCardButton
                key={index}
                href={feature.href}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}

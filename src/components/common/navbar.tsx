"use client";

import * as React from "react";
import Link from "next/link";
import {
  Menu,
  X,
  ChevronDown,
  BookOpen,
  Home,
  Info,
  GraduationCap,
  Newspaper,
  Phone,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

// Navigation menu items with dropdown structure
const navigationItems = [
  {
    title: "Home",
    href: "/",
    icon: Home,
  },
  {
    title: "About Us",
    icon: Info,
    items: [
      { title: "About", href: "/about" },
      { title: "Mission & Vision", href: "/about/mission-vission" },
      { title: "Chairman Message", href: "/about/chairman-message" },
      { title: "Teachers Panel", href: "/about/teachers" },
      { title: "Committee", href: "/about/committee" },
    ],
  },
  {
    title: "Academic",
    icon: GraduationCap,
    items: [
      { title: "Curriculum Overview", href: "/academic/curriculum" },
      { title: "Syllabus", href: "/academic/syllabus" },
      { title: "Daily Assignments", href: "/academic/assignments" },
      { title: "Exam Routing", href: "/academic/exams" },
      { title: "Class Routine", href: "/academic/routine" },
      { title: "Academic Calendar", href: "/academic/calendar" },
      { title: "Scholarship", href: "/academic/scholarship" },
      { title: "Admission & Tuition Fee", href: "/academic/admission-fee" },
      { title: "Exam Results", href: "/academic/results" },
    ],
  },
  {
    title: "News & Events",
    href: "/news-events",
    icon: Newspaper,
  },
  {
    title: "Gallery",
    href: "/gallery",
    icon: ImageIcon,
  },
  {
    title: "Contact Us",
    href: "/contact",
    icon: Phone,
  },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [openDropdowns, setOpenDropdowns] = React.useState<{ [key: number]: boolean }>({});

  // Close mobile menu when window is resized to desktop size
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileMenuOpen]);

  const toggleDropdown = (index: number) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Section */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <BookOpen className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-bold leading-tight">Madrasa</span>
              <span className="text-xs text-muted-foreground hidden sm:inline">Management</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden items-center space-x-1 md:flex">
            {navigationItems.map((item, index) => (
              <React.Fragment key={index}>
                {item.items ? (
                  // Dropdown Menu for items with sub-items
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="gap-1">
                        {item.icon && <item.icon className="h-4 w-4" />}
                        {item.title}
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">
                      {item.items.map((subItem, subIndex) => (
                        <DropdownMenuItem key={subIndex} asChild>
                          <Link href={subItem.href} className="cursor-pointer">
                            {subItem.title}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  // Regular link for items without sub-items
                  <Button variant="ghost" asChild>
                    <Link href={item.href!} className="gap-2">
                      {item.icon && <item.icon className="h-4 w-4" />}
                      {item.title}
                    </Link>
                  </Button>
                )}
              </React.Fragment>
            ))}
            
            {/* Enroll Now Button */}
            <Button asChild className="ml-4 bg-cyan-600 hover:bg-cyan-700">
              <Link href="/admission">
                Enroll Now
              </Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="flex items-center gap-2">
            {/* Mobile Enroll Button */}
            <Button asChild size="sm" className="bg-cyan-600 hover:bg-cyan-700 md:hidden">
              <Link href="/admission">
                Enroll
              </Link>
            </Button>
            
            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="mt-6 flex flex-col space-y-3">
                  {navigationItems.map((item, index) => (
                    <div key={index}>
                      {item.items ? (
                        // Collapsible dropdown for mobile with sliding animation
                        <div className="space-y-1">
                          <Button
                            variant="ghost"
                            className="w-full justify-start gap-2"
                            onClick={() => toggleDropdown(index)}
                          >
                            {item.icon && <item.icon className="h-4 w-4" />}
                            {item.title}
                            <ChevronDown
                              className={cn(
                                "ml-auto h-4 w-4 transition-transform duration-200",
                                openDropdowns[index] && "rotate-180"
                              )}
                            />
                          </Button>
                          <div
                            className={cn(
                              "overflow-hidden transition-all duration-300 ease-in-out",
                              openDropdowns[index]
                                ? "max-h-[500px] opacity-100"
                                : "max-h-0 opacity-0"
                            )}
                          >
                            <div className="ml-6 space-y-1 py-2">
                              {item.items.map((subItem, subIndex) => (
                                <Button
                                  key={subIndex}
                                  variant="ghost"
                                  asChild
                                  className="w-full justify-start text-sm text-muted-foreground hover:text-foreground"
                                  onClick={() => setMobileMenuOpen(false)}
                                >
                                  <Link href={subItem.href}>
                                    {subItem.title}
                                  </Link>
                                </Button>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        // Regular link for mobile
                        <Button
                          variant="ghost"
                          asChild
                          className="w-full justify-start gap-2"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Link href={item.href!}>
                            {item.icon && <item.icon className="h-4 w-4" />}
                            {item.title}
                          </Link>
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}

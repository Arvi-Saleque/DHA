"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  FileText,
  Calendar,
  UserX,
  DollarSign,
  Newspaper,
  Image as ImageIcon,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  BookOpen,
  ClipboardList,
  Award,
  UserPlus,
  BarChart3,
  Home,
  Info,
  School,
  Target,
  Phone,
  Star,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MenuItem {
  title: string;
  icon: ReactNode;
  href?: string;
  submenu?: { title: string; href: string; icon: ReactNode }[];
}

const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
    href: "/admin/dashboard",
  },
  {
    title: "Homepage",
    icon: <Home className="h-5 w-5" />,
    href: "/admin/homepage",
  },
  {
    title: "Header Slider",
    icon: <ImageIcon className="h-5 w-5" />,
    href: "/admin/header-slider",
  },
  {
    title: "Reviews",
    icon: <Star className="h-5 w-5" />,
    href: "/admin/reviews",
  },
  {
    title: "About Us",
    icon: <Info className="h-5 w-5" />,
    submenu: [
      { title: "About", href: "/admin/about/about-us", icon: <Info className="h-4 w-4" /> },
      { title: "Mission & Vision", href: "/admin/about/mission-vission", icon: <Target className="h-4 w-4" /> },
      { title: "Chairman's Message", href: "/admin/about/chairman-message", icon: <Users className="h-4 w-4" /> },
      { title: "Teachers Panel", href: "/admin/about/teachers", icon: <GraduationCap className="h-4 w-4" /> },
      { title: "Committee", href: "/admin/about/committee", icon: <Users className="h-4 w-4" /> },
    ],
  },
  {
    title: "Academic",
    icon: <School className="h-5 w-5" />,
    submenu: [
      { title: "Daily Assignments", href: "/admin/academic/assignments", icon: <FileText className="h-4 w-4" /> },
      { title: "Next Exam", href: "/admin/academic/next-exam", icon: <Calendar className="h-4 w-4" /> },
      { title: "Today's Absences", href: "/admin/academic/todays-absences", icon: <UserX className="h-4 w-4" /> },
      { title: "Curriculum", href: "/admin/academic/curriculum", icon: <BookOpen className="h-4 w-4" /> },
      { title: "Syllabus", href: "/admin/academic/syllabus", icon: <FileText className="h-4 w-4" /> },
      { title: "Exam Routine", href: "/admin/academic/exam-routine", icon: <Calendar className="h-4 w-4" /> },
      { title: "Class Routine", href: "/admin/academic/class-routine", icon: <Calendar className="h-4 w-4" /> },
      { title: "Academic Calendar", href: "/admin/academic/academic-calendar", icon: <Calendar className="h-4 w-4" /> },
      { title: "Scholarship", href: "/admin/academic/scholarship", icon: <Award className="h-4 w-4" /> },
      { title: "Admission & Tuition Fee", href: "/admin/academic/admission-fee", icon: <DollarSign className="h-4 w-4" /> },
      { title: "Exam Results", href: "/admin/academic/exam-results", icon: <BarChart3 className="h-4 w-4" /> },
    ],
  },
  {
    title: "Admission",
    icon: <UserPlus className="h-5 w-5" />,
    href: "/admin/admission",
  },
  {
    title: "News & Events",
    icon: <Newspaper className="h-5 w-5" />,
    href: "/admin/news-events",
  },
  {
    title: "Gallery",
    icon: <ImageIcon className="h-5 w-5" />,
    href: "/admin/gallery",
  },
  {
    title: "Contact Us",
    icon: <Phone className="h-5 w-5" />,
    href: "/admin/contact",
  },
  {
    title: "Newsletter",
    icon: <Mail className="h-5 w-5" />,
    href: "/admin/newsletter",
  },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const pathname = usePathname();

  const toggleSubmenu = (title: string) => {
    setOpenSubmenu(openSubmenu === title ? null : title);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/admin/login";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-lg">DHA Admin</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto p-4 h-[calc(100vh-8rem)]">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <div key={item.title}>
                {item.href ? (
                  <Link
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      pathname === item.href
                        ? "bg-cyan-50 text-cyan-600"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {item.icon}
                    <span className="font-medium">{item.title}</span>
                  </Link>
                ) : (
                  <div>
                    <button
                      onClick={() => toggleSubmenu(item.title)}
                      className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <span className="font-medium">{item.title}</span>
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          openSubmenu === item.title ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {openSubmenu === item.title && item.submenu && (
                      <div className="mt-1 ml-4 space-y-1">
                        {item.submenu.map((subitem) => (
                          <Link
                            key={subitem.href}
                            href={subitem.href}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                              pathname === subitem.href
                                ? "bg-cyan-50 text-cyan-600"
                                : "text-gray-600 hover:bg-gray-100"
                            }`}
                          >
                            {subitem.icon}
                            <span>{subitem.title}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </nav>

        {/* User Profile */}
        <div className="h-16 border-t border-gray-200 px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src="" />
              <AvatarFallback className="bg-cyan-100 text-cyan-600">SA</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Super Admin</p>
              <p className="text-xs text-gray-500 truncate">admin@madrasa.edu</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-gray-400 hover:text-red-600 transition-colors"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-500 hover:text-gray-700"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg">DHA Admin</span>
          </div>
          <button
            onClick={handleLogout}
            className="text-gray-400 hover:text-red-600 transition-colors"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </header>

        {/* Content */}
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}

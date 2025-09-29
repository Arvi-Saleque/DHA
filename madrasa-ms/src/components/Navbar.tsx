'use client';

import Link from 'next/link';
import { useState } from 'react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const menuItems = [
    { label: 'Home', href: '/' },
    {
      label: 'About',
      submenu: [
        { label: 'About Us', href: '/about' },
        { label: 'Mission & Vision', href: '/about/mission-vision' },
        { label: 'Advisory Committee', href: '/about/advisory-committee' },
        { label: "Chairman's Message", href: '/about/chairman-message' },
      ],
    },
    {
      label: 'Academics',
      submenu: [
        { label: 'Curriculum Overview', href: '/academics/curriculum' },
        { label: 'Syllabus Download', href: '/academics/syllabus' },
        { label: 'Class Routine', href: '/academics/routine' },
        { label: 'Academic Calendar', href: '/academics/calendar' },
        { label: 'Upcoming Exam Routine', href: '/academics/exam-routine' },
        { label: 'Attendance', href: '/academics/attendance' },
        { label: 'Exam Results', href: '/academics/results' },
      ],
    },
    {
      label: 'Admissions',
      submenu: [
        { label: 'Admission Info', href: '/admissions/info' },
        { label: 'Online Application Form', href: '/admissions/apply' },
        { label: 'Prospectus', href: '/admissions/prospectus' },
      ],
    },
    {
      label: 'Scholarship',
      submenu: [
        { label: 'List of Benefactors', href: '/scholarship/benefactors' },
        { label: 'Scholarship Award List', href: '/scholarship/awards' },
      ],
    },
    { label: 'News & Notices', href: '/news' },
    { label: 'Events & Gallery', href: '/events' },
    { label: 'Contact Us', href: '/contact' },
  ];

  const toggleDropdown = (label: string) => {
    setActiveDropdown(activeDropdown === label ? null : label);
  };

  return (
    <nav className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3">
                <span className="text-blue-900 font-bold text-lg">M</span>
              </div>
              <span className="text-white font-bold text-xl hidden sm:block">
                Madrasa Management
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {menuItems.map((item) => (
                <div key={item.label} className="relative group">
                  {item.submenu ? (
                    <div>
                      <button
                        className="text-blue-100 hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-200 flex items-center"
                        onMouseEnter={() => setActiveDropdown(item.label)}
                      >
                        {item.label}
                        <svg
                          className="ml-1 h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                      {/* Dropdown Menu */}
                      <div
                        className={`absolute left-0 mt-1 w-64 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 transition-all duration-200 ${
                          activeDropdown === item.label
                            ? 'opacity-100 visible translate-y-0'
                            : 'opacity-0 invisible -translate-y-2'
                        }`}
                        onMouseEnter={() => setActiveDropdown(item.label)}
                        onMouseLeave={() => setActiveDropdown(null)}
                      >
                        <div className="py-1">
                          {item.submenu.map((subItem) => (
                            <Link
                              key={subItem.label}
                              href={subItem.href}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-800 transition-colors duration-150"
                            >
                              {subItem.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-blue-100 hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-200"
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Login Button */}
          <div className="hidden lg:block">
            <Link
              href="/admin/login"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Admin Login
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-blue-100 hover:text-white p-2"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 bg-blue-800 rounded-b-lg">
            {menuItems.map((item) => (
              <div key={item.label}>
                {item.submenu ? (
                  <div>
                    <button
                      onClick={() => toggleDropdown(item.label)}
                      className="text-blue-100 hover:text-white block px-3 py-2 text-base font-medium w-full text-left flex items-center justify-between"
                    >
                      {item.label}
                      <svg
                        className={`h-4 w-4 transform transition-transform ${
                          activeDropdown === item.label ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {activeDropdown === item.label && (
                      <div className="ml-4 space-y-1">
                        {item.submenu.map((subItem) => (
                          <Link
                            key={subItem.label}
                            href={subItem.href}
                            className="text-blue-200 hover:text-white block px-3 py-2 text-sm"
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className="text-blue-100 hover:text-white block px-3 py-2 text-base font-medium"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
            <Link
              href="/admin/login"
              className="bg-blue-600 hover:bg-blue-700 text-white block px-3 py-2 text-base font-medium rounded-md mt-4"
            >
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
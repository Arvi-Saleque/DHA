"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BookOpen,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Send,
  Clock,
} from "lucide-react";

// Footer navigation links
const footerLinks = {
  quickLinks: [
    { title: "Home", href: "/" },
    { title: "About Us", href: "/about" },
    { title: "Admissions", href: "/admission" },
    { title: "Contact", href: "/contact" },
  ],
  academic: [
    { title: "Daily Assignments", href: "/academic/assignments" },
    { title: "Exam Schedule", href: "/academic/exams" },
    { title: "Class Routine", href: "/academic/routine" },
    { title: "Results", href: "/academic/results" },
  ],
  resources: [
    { title: "News & Events", href: "/news-events" },
    { title: "Academic Calendar", href: "/academic/calendar" },
    { title: "Teachers Panel", href: "/about/teachers" },
    { title: "Committee", href: "/about/committee" },
  ],
};

interface FooterSettings {
  socialMedia: {
    facebook: string;
    twitter: string;
    instagram: string;
    youtube: string;
  };
  contact: {
    address: string;
    phone: string;
    email: string;
    officeHours: string;
  };
  copyrightText: string;
  mapEmbedUrl: string;
}

export default function Footer() {
  const [email, setEmail] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [footerSettings, setFooterSettings] = React.useState<FooterSettings | null>(null);

  React.useEffect(() => {
    fetchFooterSettings();
  }, []);

  const fetchFooterSettings = async () => {
    try {
      const response = await fetch("/api/footer-settings");
      const result = await response.json();
      if (result.success) {
        setFooterSettings(result.data);
      }
    } catch (error) {
      console.error("Error fetching footer settings:", error);
    }
  };

  const socialLinks = footerSettings ? [
    { icon: Facebook, href: footerSettings.socialMedia.facebook, label: "Facebook" },
    { icon: Twitter, href: footerSettings.socialMedia.twitter, label: "Twitter" },
    { icon: Instagram, href: footerSettings.socialMedia.instagram, label: "Instagram" },
    { icon: Youtube, href: footerSettings.socialMedia.youtube, label: "YouTube" },
  ] : [
    { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
    { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
    { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
  ];

  const contactInfo = footerSettings ? {
    address: footerSettings.contact.address,
    phone: footerSettings.contact.phone,
    email: footerSettings.contact.email,
    hours: footerSettings.contact.officeHours,
  } : {
    address: "123 Education Street, Dhaka, Bangladesh",
    phone: "+880 1234-567890",
    email: "info@madrasa.edu",
    hours: "Sunday - Thursday: 8:00 AM - 5:00 PM",
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (result.success) {
        setMessage(result.message);
        setEmail("");
      } else {
        setMessage(result.message || "Failed to subscribe. Please try again.");
      }
    } catch (error) {
      console.error("Error subscribing:", error);
      setMessage("Failed to subscribe. Please try again.");
    } finally {
      setIsSubmitting(false);
      // Clear message after 5 seconds
      setTimeout(() => setMessage(""), 5000);
    }
  };

  return (
    <footer className="bg-muted/30 border-t">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6 sm:gap-8">
          {/* Logo and About Section - Takes 4 columns */}
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center">
                <img src="/images/logo.png" alt="Madrasa Logo" className="h-full w-full object-contain" />
              </div>
            </Link>
            <p className="text-sm text-muted-foreground mb-4 max-w-sm">
              Dedicated to providing quality Islamic education combined with
              modern academic excellence. Nurturing minds and hearts for a
              better future.
            </p>

            {/* Social Media Links */}
            <div className="flex gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-background border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links - Takes 2 columns */}
          <div className="lg:col-span-2">
            <h3 className="font-bold text-sm uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Academic - Takes 2 columns */}
          <div className="lg:col-span-2">
            <h3 className="font-bold text-sm uppercase tracking-wider mb-4">
              Academic
            </h3>
            <ul className="space-y-2">
              {footerLinks.academic.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources - Takes 2 columns */}
          <div className="lg:col-span-2">
            <h3 className="font-bold text-sm uppercase tracking-wider mb-4">
              Resources
            </h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter - Takes 2 columns */}
          <div className="lg:col-span-2">
            <h3 className="font-bold text-sm uppercase tracking-wider mb-4">
              Newsletter
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Subscribe to get updates on news and events.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <Input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-10"
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  "Subscribing..."
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Subscribe
                  </>
                )}
              </Button>
              {message && (
                <p className={`text-xs ${message.includes("success") || message.includes("subscribed") ? "text-green-600" : "text-red-600"}`}>
                  {message}
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Contact Info and Map Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mt-8 sm:mt-12 pt-6 sm:pt-8 border-t">
          {/* Contact Information */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium">Address</p>
                  <p className="text-sm text-muted-foreground">
                    {contactInfo.address}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <a
                    href={`tel:${contactInfo.phone.replace(/\s/g, "")}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {contactInfo.phone}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {contactInfo.email}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium">Office Hours</p>
                  <p className="text-sm text-muted-foreground">
                    {contactInfo.hours}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div>
            <h3 className="font-bold text-lg mb-4">Find Us</h3>
            <div className="relative w-full h-48 sm:h-56 md:h-64 rounded-lg overflow-hidden border bg-muted">
              {/* Google Maps Embed - Replace with your actual location */}
              <iframe
                src={footerSettings?.mapEmbedUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.9064863474833!2d90.39166931543427!3d23.750903394653474!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b087026b81%3A0x8fa563bbdd5904c2!2sDhaka%2C%20Bangladesh!5e0!3m2!1sen!2s!4v1633024800000!5m2!1sen!2s"}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Madrasa Location"
                className="grayscale hover:grayscale-0 transition-all duration-300"
              />
              {/* Overlay for better integration */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-background/20 to-transparent" />
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Click to interact with the map
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t bg-muted/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-center text-muted-foreground text-center md:text-left">
              © {new Date().getFullYear()} {footerSettings?.copyrightText || "All rights reserved."}
            </p>
            <div className="flex gap-6">
              <Link
                href="/privacy"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/sitemap"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

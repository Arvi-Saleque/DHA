"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Building2,
  User,
  CheckCircle2,
  Globe,
  Users,
  LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Phone,
  Mail,
  MapPin,
  Clock,
  Building2,
  Globe,
  MessageSquare,
  Users,
};

interface ContactInfoItem {
  icon: string;
  title: string;
  details: string[];
  order: number;
}

interface ContactData {
  title: string;
  description: string;
  contactInfo: ContactInfoItem[];
  mapUrl: string;
  officeHours: {
    weekdays: string;
    weekdaysTime: string;
    weekends: string;
    weekendsTime: string;
    additionalInfo: string;
  };
  quickTips: string[];
}

export default function ContactPage() {
  const [data, setData] = useState<ContactData | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/contact");
      if (res.ok) {
        const contactData = await res.json();
        setData(contactData);
      }
    } catch (error) {
      console.error("Error fetching contact data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact-messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setIsSubmitted(true);
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
        
        // Reset success message after 5 seconds
        setTimeout(() => setIsSubmitted(false), 5000);
      } else {
        alert(result.message || "Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const colorClasses = [
    { color: "text-blue-600", bg: "bg-blue-50" },
    { color: "text-purple-600", bg: "bg-purple-50" },
    { color: "text-amber-600", bg: "bg-amber-50" },
    { color: "text-rose-600", bg: "bg-rose-50" },
    { color: "text-green-600", bg: "bg-green-50" },
    { color: "text-cyan-600", bg: "bg-cyan-50" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
          <p className="text-lg text-gray-600 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">No contact information available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative h-[300px] bg-cyan-600 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-white text-center">
          <Link href="/">
            <Button
              variant="ghost"
              className="absolute top-6 left-6 text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <Badge
            variant="secondary"
            className="mb-4 bg-white/20 backdrop-blur-sm text-white border-white/30"
          >
            <MessageSquare className="w-3 h-3 mr-1" />
            Get in Touch
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 drop-shadow-lg">
            {data.title}
          </h1>
          <p className="text-lg md:text-xl text-cyan-50 max-w-2xl drop-shadow-md">
            {data.description}
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="container mx-auto px-4 -mt-16 relative z-10 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.contactInfo
            .sort((a, b) => a.order - b.order)
            .map((info, index) => {
              const Icon = iconMap[info.icon] || Phone;
              const colors = colorClasses[index % colorClasses.length];
              return (
                <Card
                  key={index}
                  className="border-none shadow-lg bg-white hover:shadow-xl transition-shadow"
                >
                  <CardContent className="p-6">
                    <div
                      className={`w-12 h-12 ${colors.bg} rounded-full flex items-center justify-center mb-4`}
                    >
                      <Icon className={`w-6 h-6 ${colors.color}`} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">
                      {info.title}
                    </h3>
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-sm text-slate-600">
                        {detail}
                      </p>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
        </div>
      </section>

      {/* Main Content - Form & Map */}
      <section className="container mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card className="border-none shadow-xl">
            <CardHeader className="border-b bg-slate-50/50">
              <CardTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Send className="w-6 h-6 text-cyan-600" />
                Send us a Message
              </CardTitle>
              <CardDescription className="mt-1">
                Fill out the form below and we'll get back to you as soon as
                possible
              </CardDescription>
            </CardHeader>

            <CardContent className="p-4 sm:p-6">
              {isSubmitted && (
                <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-50 border-2 border-green-200 rounded-lg flex items-start gap-2 sm:gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-green-900 mb-1">
                      Message Sent Successfully!
                    </h4>
                    <p className="text-sm text-green-700">
                      Thank you for contacting us. We'll respond within 24
                      hours.
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-500" />
                    Full Name <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    className="border-slate-300"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-500" />
                      Email Address <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                      className="border-slate-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-500" />
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+880 1234-567890"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="border-slate-300"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject" className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-slate-500" />
                    Subject <span className="text-rose-500">*</span>
                  </Label>
                  <Select
                    value={formData.subject}
                    onValueChange={(value) =>
                      setFormData({ ...formData, subject: value })
                    }
                    required
                  >
                    <SelectTrigger className="border-slate-300">
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admission">
                        Admission Inquiry
                      </SelectItem>
                      <SelectItem value="academic">
                        Academic Information
                      </SelectItem>
                      <SelectItem value="general">General Question</SelectItem>
                      <SelectItem value="complaint">Complaint</SelectItem>
                      <SelectItem value="feedback">Feedback</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-slate-500" />
                    Message <span className="text-rose-500">*</span>
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Write your message here..."
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    required
                    rows={6}
                    className="border-slate-300 resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Location Map */}
          <Card className="border-none shadow-xl">
            <CardHeader className="border-b bg-slate-50/50">
              <CardTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-cyan-600" />
                Our Location
              </CardTitle>
              <CardDescription className="mt-1">
                Find us on the map and visit our campus
              </CardDescription>
            </CardHeader>

            <CardContent className="p-0">
              {/* Google Maps Embed */}
              <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] bg-slate-100">
                {data.mapUrl ? (
                  <iframe
                    src={data.mapUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-b-lg"
                  ></iframe>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500">
                    <p>Map not configured</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Additional Info */}
      <section className="container mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Office Hours Card */}
          <Card className="border-2 border-blue-200 bg-blue-50/50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">
                    Office Hours
                  </h3>
                  <div className="space-y-2 text-slate-700">
                    {data.officeHours.weekdays && (
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">
                          {data.officeHours.weekdays}:
                        </span>
                        <span className="text-blue-600">
                          {data.officeHours.weekdaysTime}
                        </span>
                      </div>
                    )}
                    {data.officeHours.weekends && (
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">
                          {data.officeHours.weekends}:
                        </span>
                        <span className="text-rose-600">
                          {data.officeHours.weekendsTime}
                        </span>
                      </div>
                    )}
                    {data.officeHours.additionalInfo && (
                      <p className="text-sm text-slate-600 mt-3 pt-3 border-t border-blue-200">
                        {data.officeHours.additionalInfo}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Tips Card */}
          <Card className="border-2 border-purple-200 bg-purple-50/50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">
                    Before You Contact
                  </h3>
                  <div className="space-y-2 text-slate-700">
                    {data.quickTips.map((tip, index) => (
                      <p key={index} className="flex items-start gap-2">
                        <span className="font-bold text-purple-600 mt-0.5">
                          •
                        </span>
                        <span>{tip}</span>
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Award,
  ArrowLeft,
  GraduationCap,
  Users,
  DollarSign,
  Heart,
} from "lucide-react";

interface Scholarship {
  _id: string;
  className: string;
  studentId: string;
  benefactorId: string;
  amount: number;
  date: string;
}

export default function ScholarshipPage() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState("");

  const classes = ['Play Group', 'Nursery', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7'];

  useEffect(() => {
    fetchScholarships();
  }, []);

  useEffect(() => {
    if (scholarships.length > 0 && !selectedClass) {
      const firstClass = classes.find(cls => 
        scholarships.some(s => s.className === cls)
      );
      if (firstClass) setSelectedClass(firstClass);
    }
  }, [scholarships, selectedClass]);

  const fetchScholarships = async () => {
    try {
      const response = await fetch('/api/scholarship');
      const data = await response.json();
      setScholarships(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching scholarships:', error);
      setLoading(false);
    }
  };

  const classGroups = classes.map(cls => ({
    id: cls.toLowerCase().replace(' ', '-'),
    label: cls,
    scholarships: scholarships.filter((s) => s.className === cls),
  })).filter(group => group.scholarships.length > 0);

  const totalScholarships = scholarships.length;
  const totalAmount = scholarships.reduce((sum, s) => sum + s.amount, 0);
  const uniqueBenefactors = new Set(scholarships.map(s => s.benefactorId)).size;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="mb-20 relative h-[300px] sm:h-[350px] md:h-[400px] bg-cyan-600 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>

        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-white text-center">
          <Link href="/">
            <Button
              variant="ghost"
              className="absolute top-4 left-4 sm:top-6 sm:left-6 md:top-8 md:left-8 text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Back to Home</span>
              <span className="sm:hidden">Back</span>
            </Button>
          </Link>

          <Badge
            variant="secondary"
            className="mb-4 bg-white/20 backdrop-blur-sm text-white border-white/30"
          >
            <Award className="w-3 h-3 mr-1" />
            Academic Portal
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 drop-shadow-lg">
            Scholarship Programs
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-cyan-50 max-w-3xl drop-shadow-md">
            Supporting students through generous benefactor contributions
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 pb-20">
        <Card className="border-none shadow-xl">
          <CardHeader className="border-b bg-slate-50/50">
            <CardTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-cyan-600" />
              Scholarship Recipients by Class
            </CardTitle>
            <p className="text-sm text-slate-600 mt-2">
              View scholarship details organized by class level
            </p>
          </CardHeader>

          <CardContent className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
                <p className="text-slate-600 mt-4">Loading scholarships...</p>
              </div>
            ) : (
              <Tabs
                value={selectedClass}
                onValueChange={setSelectedClass}
                className="w-full"
              >
                <TabsList className={`grid w-full gap-2 bg-slate-100 p-2 rounded-xl mb-8`} style={{gridTemplateColumns: `repeat(${classGroups.length}, minmax(0, 1fr))`}}>
                  {classGroups.map((group) => (
                    <TabsTrigger
                      key={group.id}
                      value={group.label}
                      className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white text-xs sm:text-sm"
                    >
                      {group.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {classGroups.map((group) => (
                  <TabsContent
                    key={group.id}
                    value={group.label}
                    className="space-y-6"
                  >
                    {group.scholarships.length > 0 ? (
                      <div>
                        <div className="mb-4">
                          <p className="text-sm text-slate-600">
                            <strong>{group.scholarships.length}</strong> scholarship{group.scholarships.length !== 1 ? 's' : ''} in {group.label}
                          </p>
                        </div>
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Student ID</TableHead>
                                <TableHead>Benefactor ID</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Date</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {group.scholarships.map((scholarship) => (
                                <TableRow key={scholarship._id}>
                                  <TableCell className="font-mono text-sm">
                                    {scholarship.studentId}
                                  </TableCell>
                                  <TableCell className="font-mono text-sm">
                                    {scholarship.benefactorId}
                                  </TableCell>
                                  <TableCell className="font-semibold text-green-600">
                                    ₨{scholarship.amount.toLocaleString()}
                                  </TableCell>
                                  <TableCell className="text-sm text-slate-600">
                                    {new Date(scholarship.date).toLocaleDateString()}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Award className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">
                          No Scholarships Yet
                        </h3>
                        <p className="text-slate-600">
                          No scholarship records available for {group.label}.
                        </p>
                      </div>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            )}
          </CardContent>
        </Card>

        {/* Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="border-l-4 border-l-cyan-500">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Heart className="w-8 h-8 text-cyan-600 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Generous Support</h3>
                  <p className="text-sm text-slate-600">
                    Thanks to our benefactors for supporting students' education journey.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Award className="w-8 h-8 text-green-600 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Merit Based</h3>
                  <p className="text-sm text-slate-600">
                    Scholarships awarded based on academic excellence and financial need.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Users className="w-8 h-8 text-purple-600 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Student Focus</h3>
                  <p className="text-sm text-slate-600">
                    Helping students achieve their educational goals without financial burden.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Important Notice */}
        <Card className="mt-8 border-2 border-amber-200 bg-amber-50/50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">
                  Scholarship Information
                </h3>
                <div className="space-y-2 text-slate-700">
                  <p className="flex items-start gap-2">
                    <span className="font-bold text-amber-600 mt-0.5">•</span>
                    <span>
                      All scholarship amounts are paid directly to the institution
                    </span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="font-bold text-amber-600 mt-0.5">•</span>
                    <span>
                      Students must maintain academic standards to continue receiving support
                    </span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="font-bold text-amber-600 mt-0.5">•</span>
                    <span>
                      Scholarship status is reviewed annually based on performance
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

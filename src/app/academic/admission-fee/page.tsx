"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DollarSign,
  ArrowLeft,
  GraduationCap,
  FileText,
  CheckCircle2,
  Calendar,
} from "lucide-react";

interface AdmissionFee {
  _id: string;
  className: string;
  admissionFee: number;
  tuitionFee: number;
  examFee: number;
  otherFees: number;
}

export default function AdmissionFeePage() {
  const [fees, setFees] = useState<AdmissionFee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    try {
      const response = await fetch('/api/admission-fee');
      const data = await response.json();
      setFees(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching fees:', error);
      setLoading(false);
    }
  };

  const calculateMonthlyTotal = (fee: AdmissionFee) => {
    return fee.tuitionFee + fee.examFee + fee.otherFees;
  };

  const calculateAnnualTotal = (fee: AdmissionFee) => {
    const monthlyTotal = calculateMonthlyTotal(fee);
    return fee.admissionFee + (monthlyTotal * 12);
  };

  const totalAdmissionFees = fees.reduce((sum, fee) => sum + fee.admissionFee, 0);
  const averageMonthlyFee = fees.length > 0
    ? fees.reduce((sum, fee) => sum + calculateMonthlyTotal(fee), 0) / fees.length
    : 0;
  const averageAnnualFee = fees.length > 0
    ? fees.reduce((sum, fee) => sum + calculateAnnualTotal(fee), 0) / fees.length
    : 0;

  const stats = [
    {
      icon: GraduationCap,
      value: fees.length.toString(),
      label: "Classes",
      color: "text-cyan-600",
    },
    {
      icon: DollarSign,
      value: `₨${Math.round(totalAdmissionFees / fees.length || 0).toLocaleString()}`,
      label: "Avg Admission",
      color: "text-green-600",
    },
    {
      icon: FileText,
      value: `₨${Math.round(averageMonthlyFee).toLocaleString()}`,
      label: "Avg Monthly",
      color: "text-blue-600",
    },
    {
      icon: CheckCircle2,
      value: `₨${Math.round(averageAnnualFee).toLocaleString()}`,
      label: "Avg Annual",
      color: "text-purple-600",
    },
  ];

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
            <Calendar className="w-3 h-3 mr-1" />
            Academic Portal
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 drop-shadow-lg">
            Admission & Tuition Fee
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-cyan-50 max-w-3xl drop-shadow-md">
            Transparent fee structure for all classes
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 pb-20">
        <Card className="border-none shadow-xl">
          <CardHeader className="border-b bg-slate-50/50">
            <CardTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-6 h-6 text-cyan-600" />
              Fee Structure by Class
            </CardTitle>
            <p className="text-sm text-slate-600 mt-2">
              View admission and tuition fee details for all classes
            </p>
          </CardHeader>
          <CardContent className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
                <p className="text-slate-600">Loading fee structure...</p>
              </div>
            ) : fees.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  No Fee Structure Available
                </h3>
                <p className="text-slate-600">
                  No fee records have been added yet.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50">
                      <TableHead className="font-bold">Class</TableHead>
                      <TableHead className="font-bold text-right">
                        Admission Fee
                      </TableHead>
                      <TableHead className="font-bold text-right">
                        Tuition Fee (Monthly)
                      </TableHead>
                      <TableHead className="font-bold text-right">
                        Exam Fee (Monthly)
                      </TableHead>
                      <TableHead className="font-bold text-right">
                        Other Fees (Monthly)
                      </TableHead>
                      <TableHead className="font-bold text-right">
                        Monthly Total
                      </TableHead>
                      <TableHead className="font-bold text-cyan-600 text-right">
                        Annual Total
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fees.map((fee) => (
                      <TableRow key={fee._id} className="hover:bg-cyan-50/50">
                        <TableCell className="font-semibold">
                          {fee.className}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ₨{fee.admissionFee.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          ₨{fee.tuitionFee.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          ₨{fee.examFee.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          ₨{fee.otherFees.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right font-medium text-blue-600">
                          ₨{calculateMonthlyTotal(fee).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right font-bold text-cyan-600">
                          ₨{calculateAnnualTotal(fee).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Important Notice */}
        <Card className="mt-8 border-2 border-amber-200 bg-amber-50/50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">
                  Fee Information
                </h3>
                <div className="space-y-2 text-slate-700">
                  <p className="flex items-start gap-2">
                    <span className="font-bold text-amber-600 mt-0.5">•</span>
                    <span>
                      Admission fee is a one-time payment at the time of enrollment
                    </span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="font-bold text-amber-600 mt-0.5">•</span>
                    <span>
                      Monthly fees include tuition, exam, and other charges
                    </span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="font-bold text-amber-600 mt-0.5">•</span>
                    <span>
                      For more details, please contact the administration office
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

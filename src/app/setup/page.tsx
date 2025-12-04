"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Database, User, Loader2 } from "lucide-react";

export default function SetupPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [users, setUsers] = useState<any[]>([]);

  const seedDatabase = async () => {
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("/api/seed", {
        method: "POST",
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setUsers(data.users);
      } else {
        setError(data.message || "Failed to seed database");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Database className="h-12 w-12 text-cyan-600" />
            </div>
            <CardTitle className="text-2xl">Database Setup</CardTitle>
            <CardDescription>
              Initialize your database with default admin and teacher accounts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!success && !users.length && (
              <Button
                onClick={seedDatabase}
                disabled={loading}
                className="w-full bg-cyan-600 hover:bg-cyan-700"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Seeding Database...
                  </>
                ) : (
                  <>
                    <Database className="mr-2 h-4 w-4" />
                    Seed Database
                  </>
                )}
              </Button>
            )}

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {success && users.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-center text-green-600 gap-2 mb-4">
                  <CheckCircle2 className="h-6 w-6" />
                  <p className="font-semibold">Database seeded successfully!</p>
                </div>

                <div className="space-y-3">
                  {users.map((user, index) => (
                    <Card key={index} className="border-cyan-200">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <User className="h-5 w-5 text-cyan-600 mt-1" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <p className="font-semibold">{user.name}</p>
                              <span
                                className={`text-xs px-2 py-1 rounded ${
                                  user.role === "super_admin"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-blue-100 text-blue-700"
                                }`}
                              >
                                {user.role === "super_admin" ? "Super Admin" : "Teacher"}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">
                              📧 {user.email}
                            </p>
                            <p className="text-sm text-gray-600">
                              🔑 {user.password}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="pt-4 border-t">
                  <Button
                    onClick={() => (window.location.href = "/admin/login")}
                    className="w-full bg-cyan-600 hover:bg-cyan-700"
                  >
                    Go to Login Page
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

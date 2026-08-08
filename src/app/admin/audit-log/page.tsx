"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/admin/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AuditEntry {
  _id: string;
  userId: string;
  role: string;
  method: string;
  path: string;
  ip: string;
  createdAt: string;
}

const METHOD_COLORS: Record<string, string> = {
  POST: "bg-green-500",
  PUT: "bg-blue-500",
  PATCH: "bg-blue-500",
  DELETE: "bg-red-500",
};

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/audit-log");
      const data = await response.json();
      if (data.success) {
        setLogs(data.logs);
      }
    } catch (error) {
      console.error("Error fetching audit log:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Audit Log</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2">
              Who changed what and when (last 200 actions)
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={fetchLogs} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-blue-600" />
              Recent Admin Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : logs.length === 0 ? (
              <div className="text-center py-12">
                <ClipboardList className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No actions recorded yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 border-b">
                      <th className="py-2 pr-4 font-medium">Time</th>
                      <th className="py-2 pr-4 font-medium">User</th>
                      <th className="py-2 pr-4 font-medium">Action</th>
                      <th className="py-2 pr-4 font-medium">Path</th>
                      <th className="py-2 pr-4 font-medium">IP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log) => (
                      <tr key={log._id} className="border-b last:border-0 hover:bg-gray-50">
                        <td className="py-2 pr-4 whitespace-nowrap text-gray-700">
                          {new Date(log.createdAt).toLocaleString()}
                        </td>
                        <td className="py-2 pr-4 whitespace-nowrap">
                          <span className="font-medium text-gray-900">{log.userId}</span>{" "}
                          <span className="text-gray-500">({log.role})</span>
                        </td>
                        <td className="py-2 pr-4">
                          <Badge className={`text-xs ${METHOD_COLORS[log.method] || "bg-gray-500"}`}>
                            {log.method}
                          </Badge>
                        </td>
                        <td className="py-2 pr-4 font-mono text-xs text-gray-700 break-all">
                          {log.path}
                        </td>
                        <td className="py-2 pr-4 whitespace-nowrap text-gray-500">{log.ip}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

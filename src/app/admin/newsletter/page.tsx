"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/admin/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Trash2,
  Send,
  Users,
  Loader2,
  CheckCircle,
} from "lucide-react";

interface Subscriber {
  _id: string;
  email: string;
  status: string;
  subscribedAt: string;
}

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [formData, setFormData] = useState({
    type: "news",
    title: "",
    message: "",
    link: "",
  });

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const response = await fetch("/api/newsletter");
      const data = await response.json();
      if (data.success) {
        setSubscribers(data.subscribers);
      }
    } catch (error) {
      console.error("Error fetching subscribers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.message) {
      alert("Please fill in title and message");
      return;
    }

    if (!confirm(`Send notification to ${subscribers.length} subscriber(s)?`)) {
      return;
    }

    setSending(true);
    try {
      const response = await fetch("/api/newsletter/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      
      if (result.success) {
        alert(`Notification sent to ${result.subscribersCount} subscriber(s)!`);
        setFormData({
          type: "news",
          title: "",
          message: "",
          link: "",
        });
      } else {
        alert(result.message || "Failed to send notification");
      }
    } catch (error) {
      console.error("Error sending notification:", error);
      alert("Failed to send notification");
    } finally {
      setSending(false);
    }
  };

  const handleUnsubscribe = async (email: string) => {
    if (!confirm(`Unsubscribe ${email}?`)) return;

    try {
      const response = await fetch(`/api/newsletter/${encodeURIComponent(email)}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchSubscribers();
      }
    } catch (error) {
      console.error("Error unsubscribing:", error);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Newsletter Management</h1>
          <p className="text-gray-600 mt-2">
            Manage subscribers and send notifications about updates
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Subscribers</p>
                  <p className="text-3xl font-bold text-gray-900">{subscribers.length}</p>
                </div>
                <Users className="h-10 w-10 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active</p>
                  <p className="text-3xl font-bold text-green-600">
                    {subscribers.filter(s => s.status === "active").length}
                  </p>
                </div>
                <CheckCircle className="h-10 w-10 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">This Month</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {subscribers.filter(s => {
                      const date = new Date(s.subscribedAt);
                      const now = new Date();
                      return date.getMonth() === now.getMonth() && 
                             date.getFullYear() === now.getFullYear();
                    }).length}
                  </p>
                </div>
                <Mail className="h-10 w-10 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Send Notification Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5 text-blue-600" />
              Send Notification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSendNotification} className="space-y-4">
              <div>
                <Label htmlFor="type">Notification Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="news">📰 News & Events</SelectItem>
                    <SelectItem value="academic">📚 Academic Update</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="New exam schedule released"
                  required
                />
              </div>

              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  placeholder="The final exam schedule for December 2025 is now available..."
                  rows={4}
                  required
                />
              </div>

              <div>
                <Label htmlFor="link">Link (Optional)</Label>
                <Input
                  id="link"
                  value={formData.link}
                  onChange={(e) =>
                    setFormData({ ...formData, link: e.target.value })
                  }
                  placeholder="https://yourwebsite.com/exams"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Optional link to more information
                </p>
              </div>

              <Button type="submit" disabled={sending} className="w-full">
                {sending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send to {subscribers.length} Subscriber(s)
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Subscribers List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Subscribers List
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : subscribers.length === 0 ? (
              <div className="text-center py-12">
                <Mail className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No subscribers yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {subscribers.map((subscriber) => (
                  <div
                    key={subscriber._id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">{subscriber.email}</p>
                        <p className="text-sm text-gray-500">
                          Subscribed {new Date(subscriber.subscribedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={
                          subscriber.status === "active"
                            ? "bg-green-500"
                            : "bg-gray-500"
                        }
                      >
                        {subscriber.status}
                      </Badge>
                      <Button
                        onClick={() => handleUnsubscribe(subscriber.email)}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

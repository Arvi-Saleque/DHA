"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/admin/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Trash2,
  CheckCircle,
  Clock,
  Loader2,
  Phone,
  User,
  Reply,
} from "lucide-react";

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: "unread" | "read" | "replied";
  createdAt: string;
}

export default function AdminDashboard() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch("/api/contact-messages");
      const data = await response.json();
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateMessageStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/contact-messages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      
      if (response.ok) {
        fetchMessages();
      }
    } catch (error) {
      console.error("Error updating message:", error);
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    
    try {
      const response = await fetch(`/api/contact-messages/${id}`, {
        method: "DELETE",
      });
      
      if (response.ok) {
        fetchMessages();
        if (selectedMessage?._id === id) {
          setSelectedMessage(null);
        }
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric", 
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined 
    });
  };

  const unreadCount = messages.filter(m => m.status === "unread").length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Contact Messages</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            Messages from visitors using the &quot;Send us a Message&quot; form
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Total Messages</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">{messages.length}</p>
                </div>
                <Mail className="h-8 w-8 sm:h-10 sm:w-10 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Unread</p>
                  <p className="text-2xl sm:text-3xl font-bold text-orange-600">{unreadCount}</p>
                </div>
                <Clock className="h-8 w-8 sm:h-10 sm:w-10 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Replied</p>
                  <p className="text-2xl sm:text-3xl font-bold text-green-600">
                    {messages.filter(m => m.status === "replied").length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 sm:h-10 sm:w-10 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Messages List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Messages List */}
          <Card className="lg:order-1">
            <CardHeader className="border-b p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                All Messages
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <Mail className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No messages yet</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Messages will appear here when visitors send you a message
                  </p>
                </div>
              ) : (
                <div className="max-h-[500px] sm:max-h-[600px] overflow-y-auto">
                  {messages.map((message) => (
                    <div
                      key={message._id}
                      onClick={() => {
                        setSelectedMessage(message);
                        if (message.status === "unread") {
                          updateMessageStatus(message._id, "read");
                        }
                      }}
                      className={`p-3 sm:p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors ${
                        selectedMessage?._id === message._id ? "bg-blue-50 border-l-4 border-l-blue-600" : ""
                      } ${message.status === "unread" ? "bg-orange-50" : ""}`}
                    >
                      <div className="flex items-start justify-between gap-2 sm:gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900 truncate">
                              {message.name}
                            </h4>
                            {message.status === "unread" && (
                              <Badge className="bg-orange-500 text-white text-xs">New</Badge>
                            )}
                            {message.status === "replied" && (
                              <Badge className="bg-green-500 text-white text-xs">Replied</Badge>
                            )}
                          </div>
                          <p className="text-sm font-medium text-gray-700 truncate mb-1">
                            {message.subject}
                          </p>
                          <p className="text-sm text-gray-500 truncate mb-2">
                            {message.message}
                          </p>
                          <p className="text-xs text-gray-400">{formatDate(message.createdAt)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Message Detail */}
          <Card className="lg:order-2">
            <CardHeader className="border-b p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                Message Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              {selectedMessage ? (
                <div className="space-y-4 sm:space-y-6">
                  {/* Header */}
                  <div>
                    <div className="flex items-start justify-between mb-4 gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 break-words">
                          {selectedMessage.subject}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500">
                          {formatDate(selectedMessage.createdAt)}
                        </p>
                      </div>
                      <Badge
                        className={`shrink-0 ${
                          selectedMessage.status === "unread"
                            ? "bg-orange-500"
                            : selectedMessage.status === "replied"
                            ? "bg-green-500"
                            : "bg-blue-500"
                        }`}
                      >
                        {selectedMessage.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Sender Info */}
                  <div className="space-y-3 border-t pt-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm text-gray-500">Name</p>
                        <p className="font-medium text-gray-900 break-words">{selectedMessage.name}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm text-gray-500">Email</p>
                        <a
                          href={`mailto:${selectedMessage.email}`}
                          className="font-medium text-blue-600 hover:underline break-all text-sm sm:text-base"
                        >
                          {selectedMessage.email}
                        </a>
                      </div>
                    </div>
                    
                    {selectedMessage.phone && (
                      <div className="flex items-center gap-2 sm:gap-3">
                        <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm text-gray-500">Phone</p>
                          <a
                            href={`tel:${selectedMessage.phone}`}
                            className="font-medium text-blue-600 hover:underline"
                          >
                            {selectedMessage.phone}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Message */}
                  <div className="border-t pt-4">
                    <p className="text-xs sm:text-sm text-gray-500 mb-2">Message</p>
                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                      <p className="text-sm sm:text-base text-gray-900 whitespace-pre-wrap break-words">{selectedMessage.message}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2 sm:space-y-3 border-t pt-4">
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                      <Button
                        onClick={() => {
                          const subject = encodeURIComponent(`Re: ${selectedMessage.subject}`);
                          const body = encodeURIComponent(
                            `Hi ${selectedMessage.name},\n\nThank you for contacting us.\n\n---\nOriginal Message:\n${selectedMessage.message}`
                          );
                          window.location.href = `mailto:${selectedMessage.email}?subject=${subject}&body=${body}`;
                        }}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-sm sm:text-base"
                      >
                        <Reply className="h-4 w-4 mr-2" />
                        Reply via Email
                      </Button>
                      {selectedMessage.status !== "replied" && (
                        <Button
                          onClick={() => updateMessageStatus(selectedMessage._id, "replied")}
                          variant="outline"
                          className="flex-1 text-sm sm:text-base"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Mark as Replied
                        </Button>
                      )}
                    </div>
                    <Button
                      onClick={() => deleteMessage(selectedMessage._id)}
                      variant="destructive"
                      className="w-full text-sm sm:text-base"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Message
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 px-4">
                  <Mail className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Select a message to view details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

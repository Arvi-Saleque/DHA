"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/admin/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Facebook, Twitter, Instagram, Youtube, MapPin, Phone, Mail, Clock, Save, Loader2 } from "lucide-react";

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

export default function FooterSettingsPage() {
  const [settings, setSettings] = useState<FooterSettings>({
    socialMedia: {
      facebook: "",
      twitter: "",
      instagram: "",
      youtube: "",
    },
    contact: {
      address: "",
      phone: "",
      email: "",
      officeHours: "",
    },
    copyrightText: "",
    mapEmbedUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/footer-settings");
      const result = await response.json();
      if (result.success && result.data) {
        setSettings(result.data);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/footer-settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      const result = await response.json();

      if (result.success) {
        setMessage("Footer settings updated successfully!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("Failed to update settings");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      setMessage("Error saving settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Footer Settings</h1>
          <p className="text-muted-foreground">
            Manage footer content, social media links, and contact information
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.includes("success")
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message}
        </div>
      )}

      {/* Social Media Links */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Facebook className="h-5 w-5" />
            Social Media Links
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="facebook" className="flex items-center gap-2">
                <Facebook className="h-4 w-4" />
                Facebook URL
              </Label>
              <Input
                id="facebook"
                value={settings.socialMedia.facebook}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialMedia: { ...settings.socialMedia, facebook: e.target.value },
                  })
                }
                placeholder="https://facebook.com/yourpage"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="twitter" className="flex items-center gap-2">
                <Twitter className="h-4 w-4" />
                Twitter URL
              </Label>
              <Input
                id="twitter"
                value={settings.socialMedia.twitter}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialMedia: { ...settings.socialMedia, twitter: e.target.value },
                  })
                }
                placeholder="https://twitter.com/yourpage"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instagram" className="flex items-center gap-2">
                <Instagram className="h-4 w-4" />
                Instagram URL
              </Label>
              <Input
                id="instagram"
                value={settings.socialMedia.instagram}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialMedia: { ...settings.socialMedia, instagram: e.target.value },
                  })
                }
                placeholder="https://instagram.com/yourpage"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="youtube" className="flex items-center gap-2">
                <Youtube className="h-4 w-4" />
                YouTube URL
              </Label>
              <Input
                id="youtube"
                value={settings.socialMedia.youtube}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialMedia: { ...settings.socialMedia, youtube: e.target.value },
                  })
                }
                placeholder="https://youtube.com/yourchannel"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Address
            </Label>
            <Textarea
              id="address"
              value={settings.contact.address}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  contact: { ...settings.contact, address: e.target.value },
                })
              }
              placeholder="123 Education Street, Dhaka, Bangladesh"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Number
              </Label>
              <Input
                id="phone"
                value={settings.contact.phone}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    contact: { ...settings.contact, phone: e.target.value },
                  })
                }
                placeholder="+880 1234-567890"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={settings.contact.email}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    contact: { ...settings.contact, email: e.target.value },
                  })
                }
                placeholder="info@madrasa.edu"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="officeHours" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Office Hours
            </Label>
            <Input
              id="officeHours"
              value={settings.contact.officeHours}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  contact: { ...settings.contact, officeHours: e.target.value },
                })
              }
              placeholder="Sunday - Thursday: 8:00 AM - 5:00 PM"
            />
          </div>
        </CardContent>
      </Card>

      {/* Map Embed URL */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Google Maps
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mapEmbedUrl">Map Embed URL</Label>
            <Textarea
              id="mapEmbedUrl"
              value={settings.mapEmbedUrl}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  mapEmbedUrl: e.target.value,
                })
              }
              placeholder="Paste Google Maps embed URL here"
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              Go to Google Maps → Share → Embed a map → Copy the src URL from the iframe
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Copyright Text */}
      <Card>
        <CardHeader>
          <CardTitle>Copyright Text</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="copyrightText">Copyright Text</Label>
            <Input
              id="copyrightText"
              value={settings.copyrightText}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  copyrightText: e.target.value,
                })
              }
              placeholder="All rights reserved."
            />
            <p className="text-xs text-muted-foreground">
              This will appear after the year: © 2025 [Your Text]
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} size="lg">
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save All Changes
            </>
          )}
        </Button>
      </div>
      </div>
    </DashboardLayout>
  );
}

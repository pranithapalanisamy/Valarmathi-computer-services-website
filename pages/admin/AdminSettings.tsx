import { useEffect, useState } from "react";
import { ref, onValue, set } from "firebase/database";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Building2, Phone, Mail, MapPin, Clock, Globe,
  Facebook, Instagram, Twitter, Youtube, Save, RotateCcw,
} from "lucide-react";

interface SiteSettings {
  businessName: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  aboutText: string;
  workingHours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
  socialLinks: {
    facebook: string;
    instagram: string;
    twitter: string;
    youtube: string;
    website: string;
  };
}

const defaultSettings: SiteSettings = {
  businessName: "Valarmathi Computers",
  tagline: "Your trusted partner for all computer repair and IT support needs.",
  phone: "+91 98765 43210",
  email: "valarmathicomputer@gmail.com",
  address: "VALARMATHICOMPUTERS, Kolathupalayam, Perundurai(Tk), Erode(Dt)-638455",
  aboutText: "Valarmathi Computers is your one-stop destination for expert computer repair, IT support, and technology solutions. We provide reliable service with quick turnaround times.",
  workingHours: {
    weekdays: "9:00 AM - 6:00 PM",
    saturday: "9:00 AM - 2:00 PM",
    sunday: "Closed",
  },
  socialLinks: {
    facebook: "",
    instagram: "",
    twitter: "",
    youtube: "",
    website: "",
  },
};

export default function AdminSettings() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [original, setOriginal] = useState<SiteSettings>(defaultSettings);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"business" | "hours" | "social">("business");

  useEffect(() => {
    const unsub = onValue(ref(db, "siteSettings"), (snap) => {
      if (snap.exists()) {
        const data = snap.val();
        const merged: SiteSettings = {
          ...defaultSettings,
          ...data,
          workingHours: { ...defaultSettings.workingHours, ...(data.workingHours || {}) },
          socialLinks: { ...defaultSettings.socialLinks, ...(data.socialLinks || {}) },
        };
        setSettings(merged);
        setOriginal(merged);
      }
    });
    return () => unsub();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await set(ref(db, "siteSettings"), settings);
      setOriginal(settings);
      toast.success("Settings saved successfully!");
    } catch {
      toast.error("Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setSettings(original);
    toast.info("Changes reverted.");
  };

  const hasChanges = JSON.stringify(settings) !== JSON.stringify(original);

  const tabs = [
    { id: "business" as const, label: "Business Info", icon: Building2 },
    { id: "hours" as const, label: "Working Hours", icon: Clock },
    { id: "social" as const, label: "Social Links", icon: Globe },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground">Manage your website configuration and business details.</p>
        </div>
        <div className="flex gap-2">
          {hasChanges && (
            <Button variant="outline" onClick={handleReset} className="gap-1.5">
              <RotateCcw className="h-4 w-4" />
              Revert
            </Button>
          )}
          <Button onClick={handleSave} disabled={saving || !hasChanges} className="gap-1.5">
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 rounded-lg bg-secondary/50 p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Business Info Tab */}
      {activeTab === "business" && (
        <div className="space-y-6">
          <div className="rounded-xl border bg-card p-6 card-shadow">
            <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" /> Business Information
            </h3>
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Business Name</label>
                  <Input
                    value={settings.businessName}
                    onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
                    placeholder="Your Business Name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Tagline</label>
                  <Input
                    value={settings.tagline}
                    onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                    placeholder="Short tagline or slogan"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">About Text</label>
                <Textarea
                  value={settings.aboutText}
                  onChange={(e) => setSettings({ ...settings, aboutText: e.target.value })}
                  placeholder="Write about your business..."
                  rows={3}
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-card p-6 card-shadow">
            <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" /> Contact Details
            </h3>
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={settings.phone}
                      onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="pl-9"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      value={settings.email}
                      onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                      placeholder="info@example.com"
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea
                    value={settings.address}
                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                    placeholder="Full business address"
                    rows={2}
                    className="pl-9"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Working Hours Tab */}
      {activeTab === "hours" && (
        <div className="rounded-xl border bg-card p-6 card-shadow">
          <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" /> Working Hours
          </h3>
          <p className="text-sm text-muted-foreground mb-6">Set your business's operating hours. These will be displayed on the website.</p>
          <div className="space-y-4 max-w-lg">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-foreground w-32">Mon – Fri</label>
              <Input
                value={settings.workingHours.weekdays}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    workingHours: { ...settings.workingHours, weekdays: e.target.value },
                  })
                }
                placeholder="9:00 AM - 6:00 PM"
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-foreground w-32">Saturday</label>
              <Input
                value={settings.workingHours.saturday}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    workingHours: { ...settings.workingHours, saturday: e.target.value },
                  })
                }
                placeholder="9:00 AM - 2:00 PM"
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-foreground w-32">Sunday</label>
              <Input
                value={settings.workingHours.sunday}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    workingHours: { ...settings.workingHours, sunday: e.target.value },
                  })
                }
                placeholder="Closed"
              />
            </div>
          </div>
        </div>
      )}

      {/* Social Links Tab */}
      {activeTab === "social" && (
        <div className="rounded-xl border bg-card p-6 card-shadow">
          <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" /> Social Media Links
          </h3>
          <p className="text-sm text-muted-foreground mb-6">Add your social media profiles. Leave blank to hide from the website.</p>
          <div className="space-y-4 max-w-lg">
            {[
              { key: "facebook" as const, icon: Facebook, label: "Facebook", placeholder: "https://facebook.com/yourpage" },
              { key: "instagram" as const, icon: Instagram, label: "Instagram", placeholder: "https://instagram.com/yourprofile" },
              { key: "twitter" as const, icon: Twitter, label: "Twitter / X", placeholder: "https://twitter.com/yourhandle" },
              { key: "youtube" as const, icon: Youtube, label: "YouTube", placeholder: "https://youtube.com/yourchannel" },
              { key: "website" as const, icon: Globe, label: "Website", placeholder: "https://yourwebsite.com" },
            ].map((social) => (
              <div key={social.key} className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary">
                  <social.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <Input
                    value={settings.socialLinks[social.key]}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        socialLinks: { ...settings.socialLinks, [social.key]: e.target.value },
                      })
                    }
                    placeholder={social.placeholder}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sticky save bar when changes exist */}
      {hasChanges && (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur px-6 py-3">
          <div className="container flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              You have unsaved changes.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleReset}>
                Discard
              </Button>
              <Button size="sm" onClick={handleSave} disabled={saving} className="gap-1.5">
                <Save className="h-3 w-3" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

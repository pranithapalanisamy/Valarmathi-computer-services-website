import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "@/lib/firebase";
import { Monitor, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube, Globe, Navigation, ExternalLink } from "lucide-react";

const DIRECTIONS_URL = "https://www.google.com/maps/search/?api=1&query=Valarmathi+Computers+Kolathupalayam+Perundurai+Erode+638455";

interface SiteSettings {
  businessName: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  workingHours: { weekdays: string; saturday: string; sunday: string };
  socialLinks: { facebook: string; instagram: string; twitter: string; youtube: string; website: string };
}

const defaults: SiteSettings = {
  businessName: "Valarmathi Computers",
  tagline: "Your trusted partner for all computer repair and IT support needs.",
  phone: "+91 98765 43210",
  email: "valarmathicomputer@gmail.com",
  address: "VALARMATHICOMPUTERS, Kolathupalayam, Perundurai(Tk), Erode(Dt)-638455",
  workingHours: { weekdays: "9:00 AM - 6:00 PM", saturday: "9:00 AM - 2:00 PM", sunday: "Closed" },
  socialLinks: { facebook: "", instagram: "", twitter: "", youtube: "", website: "" },
};

const socialIcons: Record<string, React.ElementType> = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
  website: Globe,
};

export default function Footer() {
  const [s, setS] = useState<SiteSettings>(defaults);

  useEffect(() => {
    const unsub = onValue(ref(db, "siteSettings"), (snap) => {
      if (snap.exists()) {
        const d = snap.val();
        setS({
          ...defaults,
          ...d,
          workingHours: { ...defaults.workingHours, ...(d.workingHours || {}) },
          socialLinks: { ...defaults.socialLinks, ...(d.socialLinks || {}) },
        });
      }
    });
    return () => unsub();
  }, []);

  const activeSocials = Object.entries(s.socialLinks).filter(([, url]) => url.trim());

  return (
    <footer className="border-t bg-foreground py-12 text-primary-foreground">
      <div className="container">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <img
                src="/vc-logo.png"
                alt="Valarmathi Computers Logo"
                className="h-10 w-10 object-contain drop-shadow-sm"
              />
              <span className="text-lg font-bold tracking-tight">{s.businessName}</span>
            </div>
            <p className="text-sm text-primary-foreground/60">{s.tagline}</p>
            {activeSocials.length > 0 && (
              <div className="mt-4 flex gap-3">
                {activeSocials.map(([key, url]) => {
                  const Icon = socialIcons[key];
                  return (
                    <a key={key} href={url} target="_blank" rel="noopener noreferrer" className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-foreground/10 text-primary-foreground/70 hover:bg-primary-foreground/20 hover:text-primary-foreground transition-colors">
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>
          <div>
            <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-primary-foreground/60">Contact</h4>
            <div className="space-y-2 text-sm text-primary-foreground/80">
              <div className="flex items-start gap-2"><MapPin className="h-4 w-4 shrink-0 mt-0.5" /> <span>{s.address}</span></div>
              <a
                href={DIRECTIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 px-3 py-1.5 text-xs font-semibold text-primary-foreground/90 transition-colors"
              >
                <Navigation className="h-3.5 w-3.5" /> Get Directions <ExternalLink className="h-3 w-3 opacity-60" />
              </a>
              <div className="flex items-center gap-2"><Phone className="h-4 w-4 shrink-0" /> {s.phone}</div>
              <div className="flex items-center gap-2"><Mail className="h-4 w-4 shrink-0" /> {s.email}</div>
            </div>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-primary-foreground/60">Working Hours</h4>
            <div className="space-y-2 text-sm text-primary-foreground/80">
              <div className="flex justify-between"><span>Mon – Fri</span><span>{s.workingHours.weekdays}</span></div>
              <div className="flex justify-between"><span>Saturday</span><span>{s.workingHours.saturday}</span></div>
              <div className="flex justify-between"><span>Sunday</span><span>{s.workingHours.sunday}</span></div>
            </div>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-primary-foreground/60">Quick Links</h4>
            <div className="space-y-2 text-sm text-primary-foreground/80">
              <a href="#home" className="block hover:text-primary-foreground">Home</a>
              <a href="#services" className="block hover:text-primary-foreground">Services</a>
              <a href="#booking" className="block hover:text-primary-foreground">Book a Service</a>
              <a href="#contact" className="block hover:text-primary-foreground">Contact</a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-primary-foreground/10 pt-6 text-center text-sm text-primary-foreground/50">
          © {new Date().getFullYear()} {s.businessName} Services. All rights reserved.
        </div>
      </div>
    </footer>
  );
}


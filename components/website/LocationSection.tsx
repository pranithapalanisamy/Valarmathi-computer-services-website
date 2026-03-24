import { MapPin, Navigation, Phone, Mail, Clock, ExternalLink } from "lucide-react";

const MAPS_EMBED_URL =
  "https://maps.google.com/maps?q=Kolathupalayam,+Perundurai,+Erode,+Tamil+Nadu+638455&output=embed&z=15";

const DIRECTIONS_URL =
  "https://www.google.com/maps/search/?api=1&query=Valarmathi+Computers+Kolathupalayam+Perundurai+Erode+638455";

const contactDetails = [
  {
    icon: MapPin,
    label: "Our Location",
    value: "Kolathupalayam, Perundurai (Tk),\nErode (Dt) – 638455",
    color: "from-rose-500 to-red-600",
    bg: "bg-rose-50 border-rose-100",
    iconColor: "text-rose-600",
  },
  {
    icon: Phone,
    label: "Phone Number",
    value: "+91 98765 43210",
    subvalue: "+91 87654 32109",
    color: "from-blue-500 to-blue-700",
    bg: "bg-blue-50 border-blue-100",
    iconColor: "text-blue-600",
    href: "tel:+919876543210",
  },
  {
    icon: Mail,
    label: "Email Address",
    value: "valarmathicomputer@gmail.com",
    color: "from-violet-500 to-purple-700",
    bg: "bg-violet-50 border-violet-100",
    iconColor: "text-violet-600",
    href: "mailto:valarmathicomputer@gmail.com",
  },
  {
    icon: Clock,
    label: "Working Hours",
    value: "Mon – Sat: 9:00 AM – 6:00 PM",
    subvalue: "Sunday: Closed",
    color: "from-emerald-500 to-green-700",
    bg: "bg-emerald-50 border-emerald-100",
    iconColor: "text-emerald-600",
  },
];

export default function LocationSection() {
  return (
    <section id="location" className="py-20 bg-white border-t border-slate-100">
      <div className="container mx-auto px-4">

        {/* Section Header */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-red-50 border border-red-100 px-4 py-1 text-sm font-semibold text-red-600">
            <MapPin className="h-3.5 w-3.5" /> Find Us
          </span>
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
            Visit{" "}
            <span className="text-gradient">VALARMATHI COMPUTERS</span>
          </h2>
          <p className="mt-4 text-slate-500 leading-relaxed">
            We're conveniently located in Kolathupalayam, Perundurai. Walk in or book an
            appointment — we're always ready to help.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid gap-8 lg:grid-cols-5 max-w-6xl mx-auto">

          {/* Left — Contact Info Cards */}
          <div className="lg:col-span-2 flex flex-col gap-4">

            {/* Address Highlight Card */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white shadow-xl">
              {/* Decorative glows */}
              <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-red-500/20 blur-2xl"></div>
              <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-blue-500/10 blur-xl"></div>

              <div className="relative">
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-rose-600 shadow-lg shadow-red-500/30">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-white/50">Address</p>
                    <p className="text-sm font-bold text-white">VALARMATHI COMPUTERS</p>
                  </div>
                </div>

                <address className="not-italic text-sm leading-loose text-white/75">
                  Kolathupalayam,<br />
                  Perundurai (Tk), Erode (Dt),<br />
                  Tamil Nadu – 638455
                </address>

                {/* Get Directions Button */}
                <a
                  href={DIRECTIONS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="get-directions-btn"
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-red-500/30 transition-all duration-200 hover:from-red-600 hover:to-rose-700 hover:shadow-xl hover:shadow-red-500/40 active:scale-95"
                >
                  <Navigation className="h-4 w-4" />
                  Get Directions
                  <ExternalLink className="h-3.5 w-3.5 opacity-70" />
                </a>
              </div>
            </div>

            {/* Info Detail Cards */}
            {contactDetails.slice(1).map((item) => (
              <div
                key={item.label}
                className={`flex items-start gap-4 rounded-xl border p-4 transition-all duration-200 hover:shadow-md ${item.bg}`}
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm`}>
                  <item.icon className={`h-5 w-5 ${item.iconColor}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-0.5">{item.label}</p>
                  {item.href ? (
                    <a href={item.href} className="text-sm font-semibold text-slate-800 hover:text-red-600 transition-colors">
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-sm font-semibold text-slate-800">{item.value}</p>
                  )}
                  {item.subvalue && (
                    <p className="text-xs text-slate-500 mt-0.5">{item.subvalue}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Right — Map */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            {/* Map Embed Card */}
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 shadow-lg bg-white flex-1" style={{ minHeight: "400px" }}>
              {/* Map Header Strip */}
              <div className="flex items-center justify-between bg-white px-5 py-3.5 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="flex gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-red-400"></span>
                    <span className="h-3 w-3 rounded-full bg-amber-400"></span>
                    <span className="h-3 w-3 rounded-full bg-emerald-400"></span>
                  </div>
                  <span className="text-xs font-medium text-slate-400 ml-1">maps.google.com</span>
                </div>
                <a
                  href={DIRECTIONS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-lg bg-blue-50 border border-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-100 transition-colors"
                >
                  <ExternalLink className="h-3 w-3" /> Open in Maps
                </a>
              </div>

              {/* Embedded Google Map */}
              <iframe
                title="Valarmathi Computers Location"
                src={MAPS_EMBED_URL}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "360px", display: "block" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Bottom pill row */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { emoji: "📍", label: "Kolathupalayam", sub: "Village" },
                { emoji: "🏙️", label: "Perundurai", sub: "Town" },
                { emoji: "🗺️", label: "Erode", sub: "District" },
              ].map((item) => (
                <div key={item.label} className="flex flex-col items-center gap-1 rounded-xl bg-slate-50 border border-slate-100 py-3 px-2 text-center hover:bg-slate-100 transition-colors">
                  <span className="text-xl">{item.emoji}</span>
                  <p className="text-xs font-bold text-slate-700">{item.label}</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wide">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wide Get Directions Banner */}
        <div className="mt-10 max-w-6xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-orange-500 p-6 text-white shadow-xl">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_70%_50%,white,transparent_60%)]"></div>
            <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                  <Navigation className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-lg leading-tight">Ready to visit us?</p>
                  <p className="text-sm text-white/75 mt-0.5">
                    Click below to open Google Maps and get turn-by-turn directions to our store.
                  </p>
                </div>
              </div>
              <a
                href={DIRECTIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex shrink-0 items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-red-600 shadow-lg hover:bg-red-50 transition-all duration-200 hover:shadow-xl active:scale-95"
              >
                <Navigation className="h-4 w-4" />
                Get Directions
                <ExternalLink className="h-3.5 w-3.5 opacity-60" />
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

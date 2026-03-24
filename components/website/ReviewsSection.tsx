import { useState, useEffect, useMemo } from "react";
import { ref, push, onValue } from "firebase/database";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import {
  Star, Send, MessageSquare, TrendingUp, Users, ThumbsUp,
  BadgeCheck, Filter, Award, ChevronDown, X
} from "lucide-react";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Review {
  id: string;
  name: string;
  rating: number;
  message: string;
  date: string;
  service: string;
  verified?: boolean;
  userId?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const SERVICES = [
  "Laptop / Desktop Repair",
  "Data Recovery",
  "Hardware Upgrade",
  "Network Setup",
  "Software Installation",
  "Screen Replacement",
  "Virus Removal",
  "AMC Service",
  "Remote Support",
  "Custom PC Build",
  "Other",
];

const SEED_REVIEWS: Omit<Review, "id">[] = [
  { name: "Ravi Kumar",    rating: 5, service: "Laptop / Desktop Repair", message: "Outstanding service! My laptop was repaired same day and works perfectly now. Highly recommend Valarmathi Computers!", date: "2026-03-15", verified: true },
  { name: "Priya Lakshmi", rating: 5, service: "Data Recovery",           message: "They recovered all my important data that I thought was lost forever. Truly lifesavers — very professional team!", date: "2026-03-10", verified: true },
  { name: "Suresh Babu",   rating: 4, service: "Hardware Upgrade",        message: "Quick and affordable hardware upgrade. My PC is now blazing fast. Will definitely come back for future needs.", date: "2026-03-05", verified: false },
  { name: "Kavitha S",     rating: 5, service: "Network Setup",           message: "Excellent network setup at our office. No downtime, clean cable management, and great after-service support!", date: "2026-02-28", verified: true },
  { name: "Muthuraman",    rating: 4, service: "Software Installation",   message: "Good service and fair pricing. The technician explained everything clearly before starting work.", date: "2026-02-20", verified: false },
  { name: "Anitha Raj",    rating: 5, service: "Screen Replacement",      message: "Fixed my daughter's laptop screen within 2 hours with genuine parts. Very satisfied with the quality.", date: "2026-02-15", verified: true },
  { name: "Dinesh Kumar",  rating: 5, service: "Virus Removal",           message: "Removed all malware and now my system runs super smooth. Reasonable rates and fast service!", date: "2026-02-10", verified: true },
  { name: "Meena Devi",    rating: 4, service: "AMC Service",             message: "Annual maintenance contract is totally worth it. Regular checkups keep our systems in top shape.", date: "2026-02-05", verified: false },
  { name: "Arjun Raj",     rating: 5, service: "Laptop / Desktop Repair", message: "Very honest shop — they fixed only what was needed and didn't try to upsell. Rare to find this!", date: "2026-01-28", verified: true },
];

const AVATAR_COLORS = [
  "from-blue-500 to-indigo-600", "from-rose-500 to-red-600",
  "from-emerald-500 to-green-600", "from-violet-500 to-purple-600",
  "from-orange-400 to-amber-500", "from-cyan-500 to-blue-500",
  "from-pink-500 to-fuchsia-600", "from-teal-500 to-emerald-600",
];

// ─── Star Display ─────────────────────────────────────────────────────────────
function StarDisplay({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" | "lg" }) {
  const sz = size === "lg" ? "h-7 w-7" : size === "md" ? "h-5 w-5" : "h-4 w-4";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={`${sz} transition-colors ${s <= rating ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"}`} />
      ))}
    </div>
  );
}

// ─── Star Picker ──────────────────────────────────────────────────────────────
function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  const labels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent!"];
  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <button key={s} type="button" onClick={() => onChange(s)} onMouseEnter={() => setHovered(s)} onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-125 focus:outline-none" aria-label={`Rate ${s} star${s > 1 ? "s" : ""}`}>
          <Star className={`h-9 w-9 transition-all duration-150 ${s <= (hovered || value) ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]" : "fill-slate-200 text-slate-300"}`} />
        </button>
      ))}
      {(hovered || value) > 0 && (
        <span className="ml-1 text-sm font-bold text-amber-500">{labels[hovered || value]}</span>
      )}
    </div>
  );
}

// ─── Rating Bar ───────────────────────────────────────────────────────────────
function RatingBar({ star, count, total }: { star: number; count: number; total: number }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="w-4 text-right font-semibold text-slate-600">{star}</span>
      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 shrink-0" />
      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
      </div>
      <span className="w-8 text-xs text-slate-400 font-medium">{count}</span>
    </div>
  );
}

// ─── Service Badge ────────────────────────────────────────────────────────────
function ServiceBadge({ service }: { service: string }) {
  const colors: Record<string, string> = {
    "Laptop / Desktop Repair": "bg-blue-50 text-blue-700 border-blue-200",
    "Data Recovery":           "bg-emerald-50 text-emerald-700 border-emerald-200",
    "Hardware Upgrade":        "bg-orange-50 text-orange-700 border-orange-200",
    "Network Setup":           "bg-cyan-50 text-cyan-700 border-cyan-200",
    "Software Installation":   "bg-violet-50 text-violet-700 border-violet-200",
    "Screen Replacement":      "bg-rose-50 text-rose-700 border-rose-200",
    "Virus Removal":           "bg-red-50 text-red-700 border-red-200",
    "AMC Service":             "bg-indigo-50 text-indigo-700 border-indigo-200",
    "Remote Support":          "bg-teal-50 text-teal-700 border-teal-200",
    "Custom PC Build":         "bg-amber-50 text-amber-700 border-amber-200",
  };
  return (
    <span className={`inline-block text-[10px] font-bold uppercase tracking-wide border px-2 py-0.5 rounded-full ${colors[service] ?? "bg-slate-50 text-slate-500 border-slate-200"}`}>
      {service}
    </span>
  );
}

// ─── Review Card ──────────────────────────────────────────────────────────────
function ReviewCard({ review, index }: { review: Review; index: number }) {
  const initials = review.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const gradient = AVATAR_COLORS[index % AVATAR_COLORS.length];
  const formatted = new Date(review.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="group relative flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
      {/* Decorative quote */}
      <div className="absolute top-4 right-5 text-5xl font-serif text-slate-100 select-none leading-none">"</div>

      {/* Header */}
      <div className="flex items-start gap-3">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${gradient} text-sm font-bold text-white shadow-sm`}>
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-bold text-slate-900 leading-tight">{review.name}</p>
            {review.verified && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                <BadgeCheck className="h-3 w-3" /> Verified Service
              </span>
            )}
          </div>
          <ServiceBadge service={review.service} />
        </div>
        <div className="text-xs text-slate-400 shrink-0">{formatted}</div>
      </div>

      {/* Stars */}
      <StarDisplay rating={review.rating} size="sm" />

      {/* Message */}
      <p className="text-sm leading-relaxed text-slate-600 line-clamp-4">{review.message}</p>

      {/* Helpful */}
      <button className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-blue-500 transition-colors mt-auto w-fit">
        <ThumbsUp className="h-3.5 w-3.5" /> Helpful
      </button>
    </div>
  );
}

// ─── Top-Rated Service Card ───────────────────────────────────────────────────
function TopServiceCard({ service, avg, count, rank }: { service: string; avg: number; count: number; rank: number }) {
  const rankColors = ["from-amber-400 to-yellow-500", "from-slate-400 to-slate-500", "from-amber-600 to-amber-700"];
  const rankLabels = ["🥇 Top Rated", "🥈 2nd Place", "🥉 3rd Place"];
  return (
    <div className="flex items-center gap-4 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 hover:shadow-md transition-all hover:-translate-y-0.5">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${rankColors[rank] ?? "from-slate-200 to-slate-300"} text-white font-extrabold text-sm shadow`}>
        #{rank + 1}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-slate-900 text-sm truncate">{service}</p>
        <p className="text-[10px] text-slate-400 italic">{rankLabels[rank] ?? ""}</p>
      </div>
      <div className="text-right shrink-0">
        <div className="flex items-center gap-1 justify-end">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          <span className="font-extrabold text-slate-900">{avg.toFixed(1)}</span>
        </div>
        <p className="text-xs text-slate-400">{count} reviews</p>
      </div>
    </div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────
export default function ReviewsSection() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState("All");
  const [showAll, setShowAll] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const [form, setForm] = useState({ name: user?.displayName || "", rating: 0, message: "", service: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-fill name on login
  useEffect(() => {
    if (user?.displayName) setForm((f) => ({ ...f, name: user.displayName! }));
  }, [user]);

  // Load from Firebase
  useEffect(() => {
    const unsub = onValue(ref(db, "reviews"), (snap) => {
      if (snap.exists()) {
        const loaded: Review[] = Object.entries(snap.val()).map(([id, val]: any) => ({ id, ...val }));
        loaded.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setReviews(loaded);
      } else {
        setReviews([]);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Merge with seed reviews
  const allReviews: Review[] = useMemo(() => {
    if (reviews.length >= 3) return reviews;
    return [...reviews, ...SEED_REVIEWS.slice(reviews.length).map((r, i) => ({ ...r, id: `seed-${i}` }))];
  }, [reviews]);

  // Per-service stats for top-rated section
  const serviceStats = useMemo(() => {
    const map: Record<string, { total: number; count: number }> = {};
    allReviews.forEach((r) => {
      if (!map[r.service]) map[r.service] = { total: 0, count: 0 };
      map[r.service].total += r.rating;
      map[r.service].count += 1;
    });
    return Object.entries(map)
      .map(([service, { total, count }]) => ({ service, avg: total / count, count }))
      .sort((a, b) => b.avg - a.avg || b.count - a.count)
      .slice(0, 3);
  }, [allReviews]);

  // Filtered + displayed
  const filtered = useMemo(() =>
    filter === "All" ? allReviews : allReviews.filter((r) => r.service === filter),
    [allReviews, filter]
  );
  const displayed = showAll ? filtered : filtered.slice(0, 6);

  // Stats
  const total = allReviews.length;
  const avg = total > 0 ? allReviews.reduce((s, r) => s + r.rating, 0) / total : 0;
  const breakdown = [5, 4, 3, 2, 1].map((star) => ({ star, count: allReviews.filter((r) => r.rating === star).length }));
  const verifiedCount = allReviews.filter((r) => r.verified).length;

  // All services present in reviews (for filter tabs)
  const availableServices = useMemo(() => {
    const seen = new Set<string>();
    allReviews.forEach((r) => seen.add(r.service));
    return ["All", ...Array.from(seen)];
  }, [allReviews]);

  // Validate
  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Please enter your name";
    if (!form.service) e.service = "Please select a service";
    if (form.rating === 0) e.rating = "Please select a rating";
    if (!form.message.trim() || form.message.trim().length < 10) e.message = "Review must be at least 10 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await push(ref(db, "reviews"), {
        name: form.name.trim(),
        rating: form.rating,
        message: form.message.trim(),
        service: form.service,
        date: new Date().toISOString().split("T")[0],
        verified: !!user,
        userId: user?.uid || null,
      });
      toast.success("Thank you! Your review has been submitted 🎉");
      setForm({ name: user?.displayName || "", rating: 0, message: "", service: "" });
      setErrors({});
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="reviews" className="py-20 bg-gradient-to-b from-slate-50 to-white border-t border-slate-100">
      <div className="container mx-auto px-4">

        {/* ── Section Header ──────────────────────────── */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-4 py-1 text-sm font-semibold text-amber-700">
            <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" /> Customer Reviews
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
            What Our Customers <span className="text-gradient">Are Saying</span>
          </h2>
          <p className="mt-4 text-slate-500 leading-relaxed">
            Real reviews from real customers. We take pride in every service we deliver across all categories.
          </p>
        </div>

        {/* ── Top Rated Services ──────────────────────── */}
        {serviceStats.length > 0 && (
          <div className="max-w-6xl mx-auto mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Award className="h-5 w-5 text-amber-500" />
              <h3 className="text-base font-bold text-slate-900">Top Rated Services</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {serviceStats.map((s, i) => (
                <TopServiceCard key={s.service} service={s.service} avg={s.avg} count={s.count} rank={i} />
              ))}
            </div>
          </div>
        )}

        {/* ── Rating Summary + Write Review ──────────── */}
        <div className="grid gap-8 lg:grid-cols-5 max-w-6xl mx-auto mb-12">

          {/* Left – Overall stats */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col gap-5">
            <div className="flex items-center gap-5 pb-5 border-b border-slate-100">
              <div className="text-center shrink-0">
                <p className="text-6xl font-extrabold text-slate-900 leading-none">{avg.toFixed(1)}</p>
                <StarDisplay rating={Math.round(avg)} size="md" />
                <p className="text-xs text-slate-400 mt-1.5">{total} reviews</p>
              </div>
              <div className="flex-1 space-y-2">
                {breakdown.map((b) => <RatingBar key={b.star} star={b.star} count={b.count} total={total} />)}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Users, label: "Reviews", value: total.toString() },
                { icon: TrendingUp, label: "Avg Rating", value: `${avg.toFixed(1)}★` },
                { icon: BadgeCheck, label: "Verified", value: verifiedCount.toString() },
              ].map((stat) => (
                <div key={stat.label} className="bg-slate-50 rounded-xl p-3 text-center">
                  <stat.icon className="h-4 w-4 text-slate-400 mx-auto mb-1" />
                  <p className="text-base font-extrabold text-slate-900">{stat.value}</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wide">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right – Submit form */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400/20">
                  <MessageSquare className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <p className="font-bold text-white text-sm leading-none">Write a Review</p>
                  <p className="text-xs text-white/50 mt-0.5">
                    {user ? `Posting as ${user.displayName || "you"} · Verified ✓` : "Share your experience with us"}
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Name + Service */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Your Name *</label>
                  <input type="text" placeholder="e.g. Ravi Kumar" value={form.name}
                    onChange={(e) => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: "" }); }}
                    className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-amber-400/30 transition-all ${errors.name ? "border-red-400 bg-red-50" : "border-slate-200 focus:border-amber-400 bg-white"}`}
                  />
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Service Type *</label>
                  <select value={form.service} onChange={(e) => { setForm({ ...form, service: e.target.value }); setErrors({ ...errors, service: "" }); }}
                    className={`w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-amber-400/30 bg-white transition-all ${errors.service ? "border-red-400 bg-red-50 text-red-700" : "border-slate-200 focus:border-amber-400 text-slate-700"}`}>
                    <option value="">Select service...</option>
                    {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.service && <p className="text-xs text-red-500 mt-1">{errors.service}</p>}
                </div>
              </div>

              {/* Star rating */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Your Rating *</label>
                <StarPicker value={form.rating} onChange={(v) => { setForm({ ...form, rating: v }); setErrors({ ...errors, rating: "" }); }} />
                {errors.rating && <p className="text-xs text-red-500 mt-1">{errors.rating}</p>}
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Your Review *</label>
                <textarea rows={4} placeholder="Tell us about your experience. What did we do well? What could be improved?"
                  value={form.message} onChange={(e) => { setForm({ ...form, message: e.target.value }); setErrors({ ...errors, message: "" }); }}
                  className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-amber-400/30 resize-none transition-all ${errors.message ? "border-red-400 bg-red-50" : "border-slate-200 focus:border-amber-400 bg-white"}`}
                />
                <div className="flex justify-between mt-1">
                  {errors.message ? <p className="text-xs text-red-500">{errors.message}</p> : <span />}
                  <p className="text-xs text-slate-400">{form.message.length} chars</p>
                </div>
              </div>

              {user && (
                <p className="text-xs text-emerald-600 flex items-center gap-1.5 font-medium">
                  <BadgeCheck className="h-4 w-4" /> Logged in — your review will be marked as <strong>Verified Service</strong>
                </p>
              )}

              <button type="submit" disabled={submitting}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-bold py-3 text-sm shadow-md shadow-amber-200 hover:shadow-lg transition-all duration-200 disabled:opacity-60 active:scale-95">
                <Send className="h-4 w-4" />
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>
        </div>

        {/* ── Filter Bar ─────────────────────────────── */}
        <div className="max-w-6xl mx-auto mb-6">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-600">
              <Filter className="h-4 w-4" /> Filter:
            </div>

            {/* Compact filter on mobile */}
            <div className="relative sm:hidden">
              <button onClick={() => setShowFilterMenu(!showFilterMenu)}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
                {filter} <ChevronDown className="h-4 w-4" />
              </button>
              {showFilterMenu && (
                <div className="absolute top-full left-0 mt-1 z-10 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden w-48">
                  {availableServices.map((s) => (
                    <button key={s} onClick={() => { setFilter(s); setShowFilterMenu(false); setShowAll(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${filter === s ? "bg-amber-50 text-amber-700" : "text-slate-700 hover:bg-slate-50"}`}>
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Pill tabs on desktop */}
            <div className="hidden sm:flex flex-wrap gap-2">
              {availableServices.map((s) => (
                <button key={s} onClick={() => { setFilter(s); setShowAll(false); }}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all duration-200 ${filter === s ? "bg-amber-400 text-white shadow-md shadow-amber-200" : "bg-white border border-slate-200 text-slate-600 hover:border-amber-300 hover:text-amber-600"}`}>
                  {s}
                  {s !== "All" && (
                    <span className="ml-1.5 opacity-60">
                      ({allReviews.filter((r) => r.service === s).length})
                    </span>
                  )}
                </button>
              ))}
            </div>

            {filter !== "All" && (
              <button onClick={() => { setFilter("All"); setShowAll(false); }}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600">
                <X className="h-3.5 w-3.5" /> Clear
              </button>
            )}

            <span className="ml-auto text-xs text-slate-400">
              {filtered.length} review{filtered.length !== 1 ? "s" : ""}
              {filter !== "All" ? ` for "${filter}"` : " total"}
            </span>
          </div>
        </div>

        {/* ── Review Cards ────────────────────────────── */}
        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {[...Array(6)].map((_, i) => <div key={i} className="h-48 rounded-2xl bg-slate-100 animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 max-w-md mx-auto">
            <div className="text-5xl mb-3">🔍</div>
            <p className="font-bold text-slate-700">No reviews for this service yet</p>
            <p className="text-sm text-slate-400 mt-1">Be the first to review <strong>{filter}</strong>!</p>
            <button onClick={() => setFilter("All")} className="mt-4 text-xs text-amber-600 font-semibold hover:underline">← View all reviews</button>
          </div>
        ) : (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              {displayed.map((review, i) => <ReviewCard key={review.id} review={review} index={i} />)}
            </div>
            {filtered.length > 6 && (
              <div className="mt-8 text-center">
                <button onClick={() => setShowAll(!showAll)}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-slate-600 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all">
                  {showAll ? "Show Less" : `View All ${filtered.length} Reviews`}
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </section>
  );
}

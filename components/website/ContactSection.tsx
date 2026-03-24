import { useState, useEffect } from "react";
import { ref, push, onValue } from "firebase/database";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, FileText, User, Phone, Mail, Wrench, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { staggerContainer, staggerChild, fadeUp, buttonTap } from "@/lib/animations";

const staticServiceOptions = [
  "Computer Repair & Maintenance",
  "Hardware Installation & Upgrade",
  "Software Installation & Setup",
  "Virus Removal & Security",
  "Data Recovery & Backup",
  "Network Setup & Troubleshooting",
  "Laptop Screen Replacement",
  "Motherboard Repair",
  "AMC Services",
  "On-Site Support",
];

export default function ContactSection() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", service: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serviceOptions, setServiceOptions] = useState<string[]>(staticServiceOptions);

  useEffect(() => {
    const unsub = onValue(ref(db, "services"), (snap) => {
      if (snap.exists()) {
        const data = snap.val();
        const titles = Object.values(data).map((v: any) => v.title).filter(Boolean);
        if (titles.length > 0) setServiceOptions(titles);
      }
    });
    return () => unsub();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.service) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    try {
      await push(ref(db, "quoteRequests"), {
        ...form,
        status: "Pending",
        date: new Date().toISOString(),
      });
      setSubmitted(true);
      toast.success("Quote request submitted! We'll contact you soon.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const perks = [
    "Free consultation & site visit",
    "Transparent pricing, no hidden fees",
    "Expert technicians with 10+ years",
    "Same-day response guaranteed",
  ];

  return (
    <section id="contact-us" className="py-16 bg-gradient-to-br from-slate-900 via-red-950 to-slate-900 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-red-800/15 blur-3xl pointer-events-none" />

      <div className="container relative">
        {/* Header */}
        <motion.div
          className="mx-auto mb-10 max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 mb-3 rounded-full bg-primary/20 border border-primary/30 px-4 py-1.5 text-sm font-semibold text-red-300">
            <FileText className="h-3.5 w-3.5" /> Get Free Quote
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Request a <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-300">Free Quote</span>
          </h2>
          <p className="mt-3 text-sm text-slate-400 leading-relaxed">
            Tell us about your tech issue — we'll get back with a detailed quote within hours.
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-5 items-start">
          {/* Left — perks */}
          <motion.div
            className="lg:col-span-2 space-y-6"
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={staggerContainer(0.1)}
          >
            {/* Info card */}
            <motion.div variants={staggerChild}
              className="rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur-sm">
              <h3 className="text-base font-bold text-white mb-4">Why get a quote from us?</h3>
              <ul className="space-y-3">
                {perks.map((p) => (
                  <li key={p} className="flex items-center gap-3 text-sm text-slate-300">
                    <CheckCircle className="h-4 w-4 text-red-400 shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Turnaround banner */}
            <motion.div variants={staggerChild}
              className="rounded-2xl hero-gradient p-5 shadow-xl shadow-primary/30">
              <p className="text-xs font-bold text-red-200 uppercase tracking-wider mb-1">Average Response Time</p>
              <p className="text-3xl font-extrabold text-white">Under 2 Hours</p>
              <p className="text-sm text-red-200 mt-1">Mon–Sat, 9 AM – 7 PM IST</p>
            </motion.div>

            {/* Quick call strip */}
            <motion.a variants={staggerChild} href="tel:+919876543210"
              className="flex items-center gap-3 rounded-2xl bg-white/5 border border-white/10 p-4 text-white hover:bg-white/10 transition-colors group cursor-pointer">
              <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                <Phone className="h-5 w-5 text-red-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Prefer to call?</p>
                <p className="text-sm font-bold">+91 98765 43210</p>
              </div>
            </motion.a>
          </motion.div>

          {/* Right — form */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.15 }}
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm p-12 flex flex-col items-center text-center gap-4"
              >
                <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Quote Request Sent!</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  We've received your request and will get back to you within 2 hours with a detailed quote.
                </p>
                <motion.button whileTap={buttonTap} onClick={() => { setSubmitted(false); setForm({ name: "", phone: "", email: "", service: "", message: "" }); }}
                  className="mt-2 px-6 py-2.5 rounded-xl hero-gradient hover:opacity-90 text-white text-sm font-bold shadow-md shadow-primary/30 transition-all active:scale-[0.98]">
                  Submit Another
                </motion.button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit}
                className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm p-7 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input placeholder="Your Name *" value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="pl-9 bg-white/10 border-white/20 text-white placeholder-slate-400 focus:border-red-400 focus:ring-red-400/20" />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input placeholder="Phone Number *" value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="pl-9 bg-white/10 border-white/20 text-white placeholder-slate-400 focus:border-red-400 focus:ring-red-400/20" />
                  </div>
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input type="email" placeholder="Email Address" value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="pl-9 bg-white/10 border-white/20 text-white placeholder-slate-400 focus:border-red-400 focus:ring-red-400/20" />
                </div>
                <div className="relative">
                  <Wrench className="absolute left-3 top-3.5 h-4 w-4 text-slate-400 z-10 pointer-events-none" />
                  <Select value={form.service} onValueChange={(v) => setForm({ ...form, service: v })}>
                    <SelectTrigger className="pl-9 bg-white/10 border-white/20 text-white focus:border-red-400">
                      <SelectValue placeholder="Select Service *" />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceOptions.map((s, i) => (
                        <SelectItem key={s + i} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Textarea placeholder="Describe your issue or requirement..." rows={4} value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="bg-white/10 border-white/20 text-white placeholder-slate-400 focus:border-red-400 focus:ring-red-400/20 resize-none" />

                <motion.button type="submit" whileTap={buttonTap} whileHover={{ scale: 1.01 }} disabled={loading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl hero-gradient py-3 text-sm font-bold text-white shadow-lg shadow-primary/30 hover:opacity-90 disabled:opacity-60 transition-all active:scale-[0.98]">
                  {loading ? (
                    <><span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Submitting...</>
                  ) : (
                    <><Send className="h-4 w-4" /> Submit Quote Request</>
                  )}
                </motion.button>
                <p className="text-center text-xs text-slate-500">
                  * Required fields &nbsp;|&nbsp; We never spam or share your information.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

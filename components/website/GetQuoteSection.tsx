import { useState, useEffect } from "react";
import { ref, push, onValue } from "firebase/database";
import { db } from "@/lib/firebase";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { staggerContainer, staggerChild, fadeUp, buttonTap } from "@/lib/animations";

export default function GetQuoteSection() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [siteSettings, setSiteSettings] = useState({
    address: "VALARMATHI COMPUTERS, Kolathupalayam, Perundurai(Tk), Erode(Dt) – 638455",
    phone: "+91 98765 43210",
    email: "valarmathicomputer@gmail.com",
  });

  useEffect(() => {
    const unsub = onValue(ref(db, "siteSettings"), (snap) => {
      if (snap.exists()) {
        const d = snap.val();
        setSiteSettings((prev) => ({
          address: d.address || prev.address,
          phone: d.phone || prev.phone,
          email: d.email || prev.email,
        }));
      }
    });
    return () => unsub();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    try {
      await push(ref(db, "contactMessages"), {
        ...form,
        status: "unread",
        date: new Date().toISOString(),
      });
      setSent(true);
      toast.success("Message sent! We'll reply soon.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const contactItems = [
    {
      icon: MapPin,
      label: "Visit Us",
      value: siteSettings.address,
      color: "from-red-500 to-red-700",
      href: "https://maps.google.com/?q=Kolathupalayam+Perundurai+Erode",
    },
    {
      icon: Phone,
      label: "Call Us",
      value: siteSettings.phone,
      color: "from-rose-500 to-red-700",
      href: `tel:${siteSettings.phone.replace(/\s/g, "")}`,
    },
    {
      icon: Mail,
      label: "Email Us",
      value: siteSettings.email,
      color: "from-red-600 to-rose-800",
      href: `mailto:${siteSettings.email}`,
    },
    {
      icon: Clock,
      label: "Working Hours",
      value: "Mon – Sat: 9:00 AM – 7:00 PM",
      color: "from-orange-500 to-red-600",
      href: null,
    },
  ];

  return (
    <section id="contact" className="py-16 bg-secondary/40 border-t border-border">
      <div className="container">
        {/* Header */}
        <motion.div
          className="mx-auto mb-10 max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 mb-3 rounded-full bg-accent border border-primary/20 px-4 py-1.5 text-sm font-semibold text-accent-foreground">
            <MessageCircle className="h-3.5 w-3.5" /> Contact Us
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
            Get in{" "}
            <span className="text-gradient">Touch</span>
          </h2>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Have a question or want to chat? Drop us a message and we'll get back to you quickly.
          </p>
        </motion.div>

        <div className="mx-auto max-w-5xl grid gap-10 lg:grid-cols-5 items-start">

          {/* Left — Contact Info Cards */}
          <motion.div
            className="lg:col-span-2 space-y-4"
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={staggerContainer(0.08)}
          >
            {contactItems.map((item) => (
              <motion.a
                key={item.label}
                variants={staggerChild}
                href={item.href || undefined}
                target={item.href?.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                whileHover={{ y: -3, scale: 1.01 }}
                className={`flex items-start gap-4 rounded-xl border border-border bg-card p-5 card-shadow ${item.href ? "cursor-pointer hover:card-shadow-hover hover:-translate-y-0.5" : "cursor-default"} transition-all duration-200`}
              >
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} shadow-md`}>
                  <item.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">{item.label}</p>
                  <p className="text-sm font-semibold text-foreground leading-snug">{item.value}</p>
                </div>
              </motion.a>
            ))}
          </motion.div>

          {/* Right — Message Form */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.15 }}
          >
            <div className="rounded-xl border border-border bg-card card-shadow overflow-hidden">
              {/* Card header */}
              <div className="hero-gradient px-6 py-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-white/70" />
                  Send Us a Message
                </h3>
                <p className="text-xs text-white/60 mt-0.5">We typically respond within a few hours</p>
              </div>

              <div className="p-6">
                {sent ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center text-center py-10 gap-3"
                  >
                    <div className="h-14 w-14 rounded-full bg-accent flex items-center justify-center">
                      <CheckCircle className="h-7 w-7 text-primary" />
                    </div>
                    <h4 className="text-lg font-bold text-foreground">Message Received!</h4>
                    <p className="text-sm text-muted-foreground">Thank you! We'll be in touch with you shortly.</p>
                    <button onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                      className="mt-2 px-5 py-2.5 rounded-xl hero-gradient text-white text-sm font-bold shadow-md shadow-primary/20 hover:opacity-90 transition-all">
                      Send Another
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Input placeholder="Your Name *" value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })} />
                      <Input type="email" placeholder="Email Address *" value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    </div>
                    <Input placeholder="Subject" value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })} />
                    <Textarea placeholder="Your message... *" rows={5} value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="resize-none" />

                    <motion.button type="submit" whileTap={buttonTap} whileHover={{ scale: 1.01 }} disabled={loading}
                      className="w-full flex items-center justify-center gap-2 rounded-xl hero-gradient py-3 text-sm font-bold text-white shadow-md shadow-primary/20 hover:opacity-90 disabled:opacity-60 transition-all active:scale-[0.98]">
                      {loading ? (
                        <><span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Sending...</>
                      ) : (
                        <><Send className="h-4 w-4" /> Send Message</>
                      )}
                    </motion.button>
                    <p className="text-xs text-muted-foreground text-center">We'll never share your email with anyone else.</p>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

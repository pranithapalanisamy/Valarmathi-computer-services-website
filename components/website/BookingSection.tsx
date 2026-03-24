import { useState, useEffect } from "react";
import { ref, push, onValue } from "firebase/database";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Calendar, Clock, CheckCircle2, Wrench, CreditCard, ShieldCheck, Zap,
} from "lucide-react";
import { toast } from "sonner";
import { useRazorpay } from "@/hooks/useRazorpay";

// ─── Service pricing map (in ₹) ───────────────────────────────────────────────
const SERVICE_PRICES: Record<string, number> = {
  "Computer Repair":              800,
  "Software Installation":        300,
  "Network Setup":                600,
  "Data Recovery":               3000,
  "Hardware Installation & Upgrade": 900,
  "Virus Removal & Security":    1500,
  "Laptop Screen Replacement":   1500,
  "Motherboard Repair":          1200,
  "AMC Services":                2999,
  "On-Site Support":              500,
};

const DEFAULT_PRICE = 500; // diagnostic / consultation fee

interface ServiceItem {
  id: string;
  title: string;
}

export default function BookingSection() {
  const { user } = useAuth();
  const { openPayment } = useRazorpay();

  const [services, setServices] = useState<ServiceItem[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState<{
    id: string; amount: number;
  } | null>(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
    date: "",
    timeSlot: "",
    deviceType: "",
    issue: "",
  });

  // Load services from Firebase
  useEffect(() => {
    const unsub = onValue(ref(db, "services"), (snap) => {
      if (snap.exists()) {
        const data = snap.val();
        setServices(
          Object.entries(data).map(([id, val]: any) => ({ id, title: val.title }))
        );
      }
    });
    return () => unsub();
  }, []);

  // Auto-fill user info
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: user.displayName || prev.name,
        email: user.email || prev.email,
      }));
    }
  }, [user]);

  const timeSlots = [
    "09:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "12:00 PM - 01:00 PM",
    "02:00 PM - 03:00 PM",
    "03:00 PM - 04:00 PM",
    "04:00 PM - 05:00 PM",
    "05:00 PM - 06:00 PM",
  ];

  const deviceTypes = [
    "Desktop", "Laptop", "Server", "Printer", "Network Equipment", "Other",
  ];

  // Derive selected service price
  const selectedPrice = form.service
    ? (SERVICE_PRICES[form.service] ?? DEFAULT_PRICE)
    : DEFAULT_PRICE;

  // ── Save confirmed booking to Firebase ────────────────────────────────────
  const saveBooking = async (paymentId: string, amountPaid: number) => {
    await push(ref(db, "bookings"), {
      ...form,
      userId: user?.uid || null,
      status: "confirmed",
      paymentId,
      amountPaid,
      paymentStatus: "paid",
      createdAt: new Date().toISOString(),
    });
  };

  // ── Form submit → validate → open Razorpay ────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.phone.trim() || !form.service || !form.date || !form.timeSlot) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    openPayment({
      amount: selectedPrice * 100,        // paise
      name: "Valarmathi Computer Services",
      description: `Booking: ${form.service}`,
      prefill: {
        name: form.name,
        email: form.email,
        contact: form.phone,
      },
      onSuccess: async (response) => {
        try {
          await saveBooking(response.razorpay_payment_id, selectedPrice);
          setPaymentInfo({ id: response.razorpay_payment_id, amount: selectedPrice });
          setSubmitted(true);
          toast.success("Payment successful! Booking confirmed. 🎉");
        } catch {
          toast.error("Booking save failed. Contact support with payment ID: " + response.razorpay_payment_id);
        } finally {
          setLoading(false);
        }
      },
      onFailure: (err) => {
        setLoading(false);
        if (err?.message === "Payment cancelled by user.") {
          toast.warning("Payment cancelled. Your booking was not confirmed.");
        } else {
          toast.error("Payment failed: " + (err?.description || "Please try again."));
        }
      },
    });

    // Note: setLoading(false) is called inside onSuccess / onFailure
    // We don't reset here because the modal may still be open
  };

  const resetForm = () => {
    setForm({
      name: user?.displayName || "",
      phone: "",
      email: user?.email || "",
      service: "",
      date: "",
      timeSlot: "",
      deviceType: "",
      issue: "",
    });
    setSubmitted(false);
    setPaymentInfo(null);
  };

  const today = new Date().toISOString().split("T")[0];

  // ── Success screen ────────────────────────────────────────────────────────
  if (submitted && paymentInfo) {
    return (
      <section id="booking" className="py-20 bg-gradient-to-b from-background to-secondary/20">
        <div className="container">
          <div className="mx-auto max-w-lg text-center">
            {/* Animated tick */}
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 ring-8 ring-emerald-50">
              <CheckCircle2 className="h-12 w-12 text-emerald-600" />
            </div>

            <h2 className="font-display text-3xl font-extrabold tracking-tight text-foreground mb-2">
              Booking Confirmed!
            </h2>
            <p className="text-muted-foreground mb-6">
              Payment received. Our team will contact you before your appointment.
            </p>

            {/* Payment badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">
              <ShieldCheck className="h-4 w-4" />
              Payment Verified · ₹{paymentInfo.amount.toLocaleString("en-IN")} paid
            </div>

            {/* Booking summary card */}
            <div className="rounded-xl border bg-card p-5 card-shadow text-left space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Service</span>
                <span className="font-semibold text-foreground">{form.service}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Date</span>
                <span className="font-semibold text-foreground">
                  {new Date(form.date).toLocaleDateString("en-IN", {
                    weekday: "long", year: "numeric", month: "long", day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Time</span>
                <span className="font-semibold text-foreground">{form.timeSlot}</span>
              </div>
              {form.deviceType && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Device</span>
                  <span className="font-semibold text-foreground">{form.deviceType}</span>
                </div>
              )}
              <div className="border-t pt-3 flex justify-between text-sm">
                <span className="text-muted-foreground">Payment ID</span>
                <span className="font-mono text-xs text-foreground break-all">
                  {paymentInfo.id}
                </span>
              </div>
            </div>

            <Button onClick={resetForm} className="w-full">Book Another Service</Button>
          </div>
        </div>
      </section>
    );
  }

  // ── Booking form ──────────────────────────────────────────────────────────
  return (
    <section id="booking" className="py-20 bg-gradient-to-b from-background to-secondary/20">
      <div className="container">
        {/* Heading */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="mb-3 inline-block rounded-full bg-accent px-4 py-1 text-sm font-semibold text-accent-foreground">
            Book a Service
          </span>
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
            Schedule Your Service Appointment
          </h2>
          <p className="mt-4 text-muted-foreground">
            Pick your preferred service, date, and time — pay securely online to confirm your booking.
          </p>
        </div>

        <div className="mx-auto max-w-3xl">
          <form onSubmit={handleSubmit} className="rounded-2xl border bg-card p-6 md:p-8 card-shadow-lg space-y-6">

            {/* ── Step 1: Personal Info ── */}
            <div>
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full hero-gradient text-xs text-white font-bold">1</span>
                Personal Info
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  placeholder="Your Name *"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <Input
                  placeholder="Phone Number *"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <Input
                type="email"
                placeholder="Email Address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-4"
              />
            </div>

            {/* ── Step 2: Service Details ── */}
            <div>
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full hero-gradient text-xs text-white font-bold">2</span>
                Service Details
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <Select value={form.service} onValueChange={(v) => setForm({ ...form, service: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Service *" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.length > 0 ? (
                      services.map((s) => (
                        <SelectItem key={s.id} value={s.title}>{s.title}</SelectItem>
                      ))
                    ) : (
                      <>
                        <SelectItem value="Computer Repair">Computer Repair</SelectItem>
                        <SelectItem value="Software Installation">Software Installation</SelectItem>
                        <SelectItem value="Network Setup">Network Setup</SelectItem>
                        <SelectItem value="Data Recovery">Data Recovery</SelectItem>
                        <SelectItem value="Virus Removal & Security">Virus Removal &amp; Security</SelectItem>
                        <SelectItem value="Laptop Screen Replacement">Laptop Screen Replacement</SelectItem>
                        <SelectItem value="Hardware Installation & Upgrade">Hardware Installation &amp; Upgrade</SelectItem>
                        <SelectItem value="AMC Services">AMC Services</SelectItem>
                        <SelectItem value="On-Site Support">On-Site Support</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>

                <Select value={form.deviceType} onValueChange={(v) => setForm({ ...form, deviceType: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Device Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {deviceTypes.map((d) => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Textarea
                placeholder="Describe your issue or requirements..."
                rows={3}
                value={form.issue}
                onChange={(e) => setForm({ ...form, issue: e.target.value })}
                className="mt-4"
              />
            </div>

            {/* ── Step 3: Date & Time ── */}
            <div>
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full hero-gradient text-xs text-white font-bold">3</span>
                Date &amp; Time
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    type="date"
                    value={form.date}
                    min={today}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="pl-9"
                  />
                </div>
                <Select value={form.timeSlot} onValueChange={(v) => setForm({ ...form, timeSlot: v })}>
                  <SelectTrigger>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <SelectValue placeholder="Select Time Slot *" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* ── Payment summary band ── */}
            {form.service && (
              <div className="flex items-center justify-between rounded-xl bg-primary/5 border border-primary/20 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full hero-gradient">
                    <CreditCard className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Amount to Pay</p>
                    <p className="text-xs text-muted-foreground">Secure payment via Razorpay</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-extrabold text-primary">
                    ₹{selectedPrice.toLocaleString("en-IN")}
                  </p>
                  <p className="text-xs text-muted-foreground">Booking fee</p>
                </div>
              </div>
            )}

            {/* ── Submit button ── */}
            <Button
              type="submit"
              className="w-full gap-2 h-13 text-base font-semibold"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Zap className="h-5 w-5 animate-pulse" />
                  Opening Payment Gateway…
                </>
              ) : (
                <>
                  <CreditCard className="h-5 w-5" />
                  {form.service
                    ? `Pay ₹${selectedPrice.toLocaleString("en-IN")} & Confirm Booking`
                    : "Book Service Appointment"}
                </>
              )}
            </Button>

            {/* Trust badge */}
            <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              Payments secured by Razorpay · 100% safe & encrypted
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

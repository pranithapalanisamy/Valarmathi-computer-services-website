import {
  Monitor,
  HardDrive,
  Cpu,
  Wifi,
  Download,
  DatabaseZap,
  CheckCircle2,
  Zap,
  Award,
  HeadphonesIcon,
  ShieldCheck,
  ThumbsUp,
  Target,
  Eye,
} from "lucide-react";

/* ─────────────────────────── Data ─────────────────────────── */

const services = [
  {
    icon: Monitor,
    title: "Desktop & Laptop Repair",
    desc: "Comprehensive diagnostics and repair for all makes and models — from screen replacements to motherboard-level fixes.",
  },
  {
    icon: DatabaseZap,
    title: "Data Recovery",
    desc: "Advanced recovery solutions for failed hard drives, SSDs, and corrupted storage media. Your memories are worth saving.",
  },
  {
    icon: Cpu,
    title: "Hardware Upgrades",
    desc: "Boost performance with expert installation of RAM, SSD, GPU, and other components tailored to your needs and budget.",
  },
  {
    icon: Wifi,
    title: "Network Setup",
    desc: "End-to-end network design, installation, and configuration for homes and businesses of any scale.",
  },
  {
    icon: Download,
    title: "Software Installation",
    desc: "Clean OS installs, driver updates, antivirus setup, and full software troubleshooting to keep your system running perfectly.",
  },
  {
    icon: HardDrive,
    title: "Storage Solutions",
    desc: "Cloud backup, NAS setup, and external storage configuration to safeguard your critical data long-term.",
  },
];

const whyUs = [
  {
    icon: Zap,
    title: "Same-Day Service",
    desc: "Most repairs are completed the same day you walk in — we value your time.",
  },
  {
    icon: Award,
    title: "Certified Technicians",
    desc: "Our engineers are trained and certified across all major brands and platforms.",
  },
  {
    icon: ShieldCheck,
    title: "Transparent Pricing",
    desc: "No hidden fees — you receive a clear, upfront quote before any work begins.",
  },
  {
    icon: HeadphonesIcon,
    title: "24/7 Support",
    desc: "Round-the-clock remote assistance for urgent issues and after-hours emergencies.",
  },
  {
    icon: ThumbsUp,
    title: "Quality Guaranteed",
    desc: "90-day warranty on all repairs and parts — your satisfaction is our promise.",
  },
  {
    icon: CheckCircle2,
    title: "Trusted by 500+ Clients",
    desc: "A decade of delivering reliable IT solutions to homes and businesses across the region.",
  },
];

const stats = [
  { num: "10+",  label: "Years of Experience" },
  { num: "500+", label: "Happy Customers" },
  { num: "99%",  label: "Customer Satisfaction" },
  { num: "5000+",label: "Devices Repaired" },
];

/* ─────────────────────────── Component ─────────────────────────── */

export default function AboutSection() {
  return (
    <section id="about" className="scroll-mt-16">

      {/* ── Hero Banner ─────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-secondary/40 py-16">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -left-32 -top-32 h-[400px] w-[400px] rounded-full bg-primary/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 h-[320px] w-[320px] rounded-full bg-primary/8 blur-3xl" />

        <div className="container relative">
          <div className="mx-auto max-w-2xl text-center">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-sm font-semibold text-accent-foreground">
              <Monitor className="h-4 w-4" />
              About Us
            </span>
            <h2 className="font-display mb-4 text-3xl font-extrabold leading-tight tracking-tight text-foreground md:text-4xl">
              Your Trusted Tech Partner —{" "}
              <span className="text-gradient">Valarmathi Computers</span>
            </h2>
            <p className="mx-auto max-w-xl text-base leading-relaxed text-muted-foreground">
              For over a decade, Valarmathi Computers has been the go-to
              destination for professional, affordable, and reliable IT services
              across homes and businesses. We don't just fix computers — we
              restore peace of mind.
            </p>
          </div>

          {/* Stat counters */}
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border bg-card p-5 text-center card-shadow transition-all hover:card-shadow-hover hover:-translate-y-1"
              >
                <div className="text-2xl font-extrabold text-primary">{s.num}</div>
                <div className="mt-1 text-xs font-medium text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Company Introduction ─────────────────────────────────── */}
      <div className="container py-16">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          {/* Text */}
          <div>
            <span className="mb-3 inline-block rounded-full bg-accent px-4 py-1 text-sm font-semibold text-accent-foreground">
              Who We Are
            </span>
            <h2 className="font-display mb-4 text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
              A Decade of Expertise,{" "}
              <span className="text-gradient">One Promise</span>
            </h2>
            <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
              <p>
                Founded with a simple belief — that every person deserves fast,
                honest, and high-quality computer support — Valarmathi Computers
                has grown from a small repair shop into a full-service IT
                solutions provider.
              </p>
              <p>
                Our certified engineers bring hands-on experience with all major
                brands including HP, Dell, Lenovo, Apple, ASUS, and Acer. We
                handle everything from a cracked screen to an enterprise network
                rollout, applying the same level of care and precision to every
                job.
              </p>
              <p>
                We serve walk-in customers, schedule on-site visits, and provide
                remote support — because your convenience matters as much as the
                quality of our work.
              </p>
            </div>
          </div>

          {/* Visual card */}
          <div className="relative">
            <div className="rounded-2xl border bg-card p-6 card-shadow-lg">
              {/* Gradient header */}
              <div className="hero-gradient mb-5 -mx-6 -mt-6 rounded-t-2xl px-6 pt-6 pb-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                    <Monitor className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Valarmathi Computers</h3>
                    <p className="text-xs text-white/80">Professional IT Services & Repairs</p>
                  </div>
                </div>
              </div>
              <ul className="space-y-2.5">
                {[
                  "All major brands serviced",
                  "On-site & remote support available",
                  "90-day repair warranty",
                  "Genuine spare parts guaranteed",
                  "Free initial diagnosis",
                  "Flexible pricing packages",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-primary" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-4 -right-4 rounded-xl border bg-card px-4 py-2.5 card-shadow-lg">
              <div className="text-xl font-extrabold text-primary">4.9 ★</div>
              <div className="text-xs font-medium text-muted-foreground">Customer Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mission & Vision ─────────────────────────────────────── */}
      <div className="bg-secondary/40 py-16">
        <div className="container">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <span className="mb-3 inline-block rounded-full bg-accent px-4 py-1 text-sm font-semibold text-accent-foreground">
              Our Purpose
            </span>
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
              Mission & Vision
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Mission */}
            <div className="relative overflow-hidden rounded-xl border bg-card p-6 card-shadow transition-all hover:card-shadow-hover hover:-translate-y-1">
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/5" />
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display mb-2 text-xl font-bold text-foreground">Our Mission</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                To deliver fast, affordable, and expert IT solutions that
                empower individuals and businesses to work without disruption. We
                are committed to providing honest assessments, transparent
                pricing, and repairs that last — because technology should work
                for you, not against you.
              </p>
            </div>
            {/* Vision */}
            <div className="relative overflow-hidden rounded-xl border bg-card p-6 card-shadow transition-all hover:card-shadow-hover hover:-translate-y-1">
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/5" />
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
                <Eye className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display mb-2 text-xl font-bold text-foreground">Our Vision</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                To become the most trusted IT service partner in the region —
                known not just for technical excellence, but for genuine care,
                accessibility, and innovation. We envision a future where
                seamless technology is a reality for every home and business,
                regardless of scale or budget.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Services Overview ────────────────────────────────────── */}
      <div className="container py-16">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <span className="mb-3 inline-block rounded-full bg-accent px-4 py-1 text-sm font-semibold text-accent-foreground">
            What We Do
          </span>
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
            Our Core Services
          </h2>
          <p className="mt-4 text-sm text-muted-foreground">
            From a single device repair to a full business IT infrastructure —
            we've got you covered.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((svc) => (
            <div
              key={svc.title}
              className="group rounded-xl border bg-card p-6 card-shadow transition-all duration-300 hover:card-shadow-hover hover:-translate-y-1"
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-accent transition-colors duration-300 group-hover:hero-gradient">
                <svc.icon className="h-6 w-6 text-primary transition-colors duration-300 group-hover:text-white" />
              </div>
              <h3 className="font-display mb-1.5 text-base font-bold text-foreground">{svc.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{svc.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Why Choose Us ────────────────────────────────────────── */}
      <div className="bg-secondary/40 py-16">
        <div className="container">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <span className="mb-3 inline-block rounded-full bg-accent px-4 py-1 text-sm font-semibold text-accent-foreground">
              Why Choose Us
            </span>
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
              The Valarmathi Advantage
            </h2>
            <p className="mt-4 text-sm text-muted-foreground">
              We combine technical expertise with a customer-first approach to
              deliver an experience that's second to none.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {whyUs.map((item) => (
              <div
                key={item.title}
                className="flex gap-4 rounded-xl border bg-card p-5 card-shadow transition-all hover:card-shadow-hover hover:-translate-y-1"
              >
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-accent">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-display mb-1 text-sm font-bold text-foreground">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA Banner ───────────────────────────────────────────── */}
      <div className="container py-16">
        <div className="relative overflow-hidden rounded-2xl hero-gradient px-8 py-12 text-center">
          {/* Decorative circles */}
          <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-white/10" />

          <div className="relative">
            <h2 className="font-display mb-3 text-2xl font-extrabold text-white md:text-3xl">
              Ready to Get Your Device Fixed?
            </h2>
            <p className="mx-auto mb-6 max-w-lg text-sm text-white/80">
              Don't let a tech problem slow you down. Book a service appointment
              online or call us today — same-day service available.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="#booking"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-2.5 text-sm font-bold text-primary shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
              >
                Book a Service
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-white/60 px-6 py-2.5 text-sm font-bold text-white backdrop-blur-sm transition-all hover:bg-white/10"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

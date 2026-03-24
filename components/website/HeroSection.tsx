import { Users, Clock, HeadphonesIcon, ArrowRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const badges = [
  { icon: Users, label: "500+ Happy Customers" },
  { icon: Clock, label: "Same Day Service" },
  { icon: HeadphonesIcon, label: "24/7 Support" },
];

export default function HeroSection() {
  return (
    <section id="home" className="relative overflow-hidden bg-secondary/30 py-16 lg:py-24">
      {/* Decorative blob */}
      <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />

      <div className="container grid items-center gap-12 lg:grid-cols-2">
        {/* Left */}
        <div className="animate-fade-in">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-accent-foreground">
            <Shield className="h-4 w-4" />
            Trusted IT Service Partner
          </div>
          <h1 className="mb-6 font-display text-4xl font-extrabold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Professional Computer Repair &{" "}
            <span className="text-gradient">IT Support</span> Services
          </h1>
          <p className="mb-8 max-w-lg text-lg leading-relaxed text-muted-foreground">
            From hardware repairs to complete IT solutions, Valarmathi Computers Services keeps your technology running smoothly. Fast, reliable, and affordable service you can trust.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="#contact">
              <Button size="lg" className="gap-2 text-base">
                Get Free Quote <ArrowRight className="h-4 w-4" />
              </Button>
            </a>
            <a href="#services">
              <Button variant="outline" size="lg" className="text-base">
                Our Services
              </Button>
            </a>
          </div>
        </div>

        {/* Right - stats card */}
        <div className="relative animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <div className="rounded-2xl border bg-card p-8 card-shadow-lg">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl hero-gradient">
                <Shield className="h-10 w-10 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Your Trusted Tech Partner</h3>
              <p className="mt-1 text-sm text-muted-foreground">Expert solutions for all your IT needs</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { num: "500+", label: "Clients Served" },
                { num: "10+", label: "Years Experience" },
                { num: "99%", label: "Satisfaction" },
              ].map((s) => (
                <div key={s.label} className="rounded-xl bg-secondary p-4 text-center">
                  <div className="text-2xl font-extrabold text-primary">{s.num}</div>
                  <div className="mt-1 text-xs font-medium text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Trust badges */}
      <div className="container mt-12">
        <div className="flex flex-wrap justify-center gap-6">
          {badges.map((b) => (
            <div key={b.label} className="flex items-center gap-3 rounded-full border bg-card px-5 py-2.5 card-shadow">
              <b.icon className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold text-foreground">{b.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

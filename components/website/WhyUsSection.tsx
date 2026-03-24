import { CheckCircle2, Zap, Award, Clock } from "lucide-react";

const reasons = [
  { icon: Zap, title: "Fast Turnaround", desc: "Most repairs completed the same day you bring it in." },
  { icon: Award, title: "Certified Technicians", desc: "Our team is trained and certified to handle all major brands." },
  { icon: CheckCircle2, title: "Transparent Pricing", desc: "No hidden fees — you get a clear quote before any work begins." },
  { icon: Clock, title: "24/7 Support", desc: "Round-the-clock assistance for urgent issues and emergencies." },
];

export default function WhyUsSection() {
  return (
    <section id="whyus" className="py-16">
      <div className="container">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <span className="mb-3 inline-block rounded-full bg-accent px-4 py-1 text-sm font-semibold text-accent-foreground">Why Choose Us</span>
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
            Why Valarmathi Computers?
          </h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((r) => (
            <div key={r.title} className="rounded-xl border bg-card p-6 text-center transition-all card-shadow hover:card-shadow-hover hover:-translate-y-1">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent">
                <r.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="mb-2 font-display text-lg font-bold text-foreground">{r.title}</h3>
              <p className="text-sm text-muted-foreground">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { useEffect, useState } from "react";
import {
  Monitor, HardDrive, Download, ShieldCheck, Database, Wifi,
  Smartphone, Cpu, FileCheck, MapPin,
} from "lucide-react";
import { ref, onValue } from "firebase/database";
import { db } from "@/lib/firebase";

const staticServices = [
  { icon: Monitor, title: "Computer Repair & Maintenance", desc: "Complete diagnostics and repair for desktops and laptops." },
  { icon: HardDrive, title: "Hardware Installation & Upgrade", desc: "RAM, SSD, GPU upgrades and full system builds." },
  { icon: Download, title: "Software Installation & Setup", desc: "OS installation, driver setup, and software configuration." },
  { icon: ShieldCheck, title: "Virus Removal & Security", desc: "Malware removal, antivirus setup, and security hardening." },
  { icon: Database, title: "Data Recovery & Backup", desc: "Recover lost data and set up reliable backup solutions." },
  { icon: Wifi, title: "Network Setup & Troubleshooting", desc: "Home and office network installation and repair." },
  { icon: Smartphone, title: "Laptop Screen Replacement", desc: "Quick and affordable screen replacements for all brands." },
  { icon: Cpu, title: "Motherboard Repair", desc: "Component-level motherboard diagnosis and repair." },
  { icon: FileCheck, title: "AMC Services", desc: "Annual maintenance contracts for businesses and individuals." },
  { icon: MapPin, title: "On-Site Support", desc: "Doorstep service — we come to you for repairs and setup." },
];

export default function ServicesSection() {
  const [services, setServices] = useState(staticServices);

  useEffect(() => {
    const unsub = onValue(ref(db, "services"), (snap) => {
      if (snap.exists()) {
        const data = snap.val();
        const apiServices = Object.values(data).map((val: any) => ({
          icon: Monitor,
          title: val.title,
          desc: val.description,
        }));
        setServices(apiServices);
      }
    });
    return () => unsub();
  }, []);

  return (
    <section id="services" className="py-20">
      <div className="container">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="mb-3 inline-block rounded-full bg-accent px-4 py-1 text-sm font-semibold text-accent-foreground">Our Services</span>
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
            Complete IT Solutions Under One Roof
          </h2>
          <p className="mt-4 text-muted-foreground">
            We offer a wide range of computer repair and IT services to keep your systems running perfectly.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {services.map((s, idx) => (
            <div
              key={s.title + idx}
              className="group rounded-xl border bg-card p-6 transition-all duration-300 card-shadow hover:card-shadow-hover hover:-translate-y-1"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-primary transition-colors group-hover:hero-gradient group-hover:text-primary-foreground">
                <s.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 font-display text-base font-bold text-foreground">{s.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "@/lib/firebase";

const staticBrands = ["Dell", "HP", "Asus", "Acer", "Lenovo", "Samsung"];

export default function BrandsSection() {
  const [brands, setBrands] = useState<string[]>(staticBrands);

  useEffect(() => {
    const unsub = onValue(ref(db, "brands"), (snap) => {
      if (snap.exists()) {
        const data = snap.val();
        setBrands(Object.values(data).map((v: any) => v.name));
      }
    });
    return () => unsub();
  }, []);

  return (
    <section className="border-y bg-secondary/30 py-16">
      <div className="container">
        <div className="mx-auto mb-10 max-w-xl text-center">
          <span className="mb-3 inline-block rounded-full bg-accent px-4 py-1 text-sm font-semibold text-accent-foreground">Brands We Service</span>
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
            Trusted by Leading Brands
          </h2>
        </div>
        <div className="mx-auto grid max-w-3xl grid-cols-3 gap-4 md:grid-cols-6">
          {brands.map((b, idx) => (
            <div key={b + idx} className="flex h-20 items-center justify-center rounded-xl border bg-card transition-shadow card-shadow hover:card-shadow-lg p-2 text-center">
              <span className="text-sm sm:text-lg font-bold text-muted-foreground">{b}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

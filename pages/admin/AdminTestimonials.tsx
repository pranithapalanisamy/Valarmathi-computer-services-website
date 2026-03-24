import { useEffect, useState } from "react";
import { ref, onValue, push, remove } from "firebase/database";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, Star } from "lucide-react";
import { toast } from "sonner";

interface Testimonial { id: string; name: string; review: string; rating: number; }

export default function AdminTestimonials() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [form, setForm] = useState({ name: "", review: "", rating: 5 });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const unsub = onValue(ref(db, "testimonials"), (snap) => {
      if (snap.exists()) setItems(Object.entries(snap.val()).map(([id, val]: any) => ({ id, ...val })));
      else setItems([]);
    });
    return () => unsub();
  }, []);

  const handleAdd = async () => {
    if (!form.name.trim() || !form.review.trim()) { toast.error("Fill all fields"); return; }
    await push(ref(db, "testimonials"), form);
    setForm({ name: "", review: "", rating: 5 });
    setOpen(false);
    toast.success("Testimonial added");
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-foreground">Testimonials</h1>
          <p className="text-sm text-muted-foreground">Manage customer reviews.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="gap-2"><Plus className="h-4 w-4" /> Add Testimonial</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Testimonial</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <Input placeholder="Customer Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <Textarea placeholder="Review" value={form.review} onChange={(e) => setForm({ ...form, review: e.target.value })} />
              <div>
                <label className="text-sm font-medium text-foreground">Rating</label>
                <div className="mt-1 flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} onClick={() => setForm({ ...form, rating: n })}>
                      <Star className={`h-6 w-6 ${n <= form.rating ? "fill-amber-400 text-amber-400" : "text-muted"}`} />
                    </button>
                  ))}
                </div>
              </div>
              <Button onClick={handleAdd} className="w-full">Add Testimonial</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((t) => (
          <div key={t.id} className="rounded-xl border bg-card p-5 card-shadow">
            <div className="mb-2 flex gap-0.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star key={n} className={`h-4 w-4 ${n <= t.rating ? "fill-amber-400 text-amber-400" : "text-muted"}`} />
              ))}
            </div>
            <p className="mb-3 text-sm text-muted-foreground">"{t.review}"</p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-foreground">— {t.name}</span>
              <Button variant="ghost" size="sm" onClick={() => { remove(ref(db, `testimonials/${t.id}`)); toast.success("Deleted"); }}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="col-span-full text-center text-muted-foreground">No testimonials yet.</p>}
      </div>
    </div>
  );
}

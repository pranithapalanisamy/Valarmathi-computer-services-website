import { useEffect, useState } from "react";
import { ref, onValue, push, remove } from "firebase/database";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Brand { id: string; name: string; }

export default function AdminBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const unsub = onValue(ref(db, "brands"), (snap) => {
      if (snap.exists()) {
        setBrands(Object.entries(snap.val()).map(([id, val]: any) => ({ id, ...val })));
      } else setBrands([]);
    });
    return () => unsub();
  }, []);

  const handleAdd = async () => {
    if (!name.trim()) { toast.error("Brand name required"); return; }
    await push(ref(db, "brands"), { name });
    setName("");
    setOpen(false);
    toast.success("Brand added");
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-foreground">Brands</h1>
          <p className="text-sm text-muted-foreground">Manage brands you service.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="gap-2"><Plus className="h-4 w-4" /> Add Brand</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Brand</DialogTitle></DialogHeader>
            <Input placeholder="Brand Name" value={name} onChange={(e) => setName(e.target.value)} />
            <Button onClick={handleAdd} className="w-full">Add Brand</Button>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {brands.map((b) => (
          <div key={b.id} className="flex items-center justify-between rounded-xl border bg-card p-4 card-shadow">
            <span className="font-bold text-foreground">{b.name}</span>
            <Button variant="ghost" size="sm" onClick={() => { remove(ref(db, `brands/${b.id}`)); toast.success("Deleted"); }}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ))}
        {brands.length === 0 && <p className="col-span-full text-center text-muted-foreground">No brands added yet.</p>}
      </div>
    </div>
  );
}

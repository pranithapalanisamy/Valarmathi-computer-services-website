import { useEffect, useState } from "react";
import { ref, onValue, push, remove, update } from "firebase/database";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { staggerContainer, staggerChild, cardHover, buttonTap, fadeUp } from "@/lib/animations";
import {
  Plus, Pencil, Trash2, Wrench, Clock, DollarSign,
  Monitor, HardDrive, Wifi, Database, Shield, Headphones, Download
} from "lucide-react";
import { toast } from "sonner";

interface Service {
  id: string;
  title: string;
  description: string;
  price: string;
  duration: string;
  category: string;
}

const CATEGORIES = [
  "Hardware Repair", "Software Setup", "Data Recovery",
  "Network Setup", "Hardware Upgrade", "AMC Service",
  "Remote Support", "Maintenance", "Other",
];

const CATEGORY_ICONS: Record<string, any> = {
  "Hardware Repair":  Monitor,
  "Software Setup":   Download,
  "Data Recovery":    Database,
  "Network Setup":    Wifi,
  "Hardware Upgrade": HardDrive,
  "AMC Service":      Shield,
  "Remote Support":   Headphones,
  "Maintenance":      Wrench,
  "Other":            Wrench,
};

const CATEGORY_COLORS: Record<string, string> = {
  "Hardware Repair":  "from-blue-500 to-blue-700",
  "Software Setup":   "from-violet-500 to-purple-700",
  "Data Recovery":    "from-emerald-500 to-green-700",
  "Network Setup":    "from-cyan-500 to-blue-600",
  "Hardware Upgrade": "from-orange-400 to-orange-600",
  "AMC Service":      "from-rose-500 to-red-600",
  "Remote Support":   "from-indigo-500 to-indigo-700",
  "Maintenance":      "from-amber-400 to-yellow-600",
  "Other":            "from-slate-400 to-slate-600",
};

const DEFAULT_SERVICES: Omit<Service, "id">[] = [
  { title: "Laptop Screen Replacement", description: "Professional replacement of broken or cracked laptop screens with genuine quality displays.", price: "₹2,500 – ₹8,000", duration: "2–4 hours", category: "Hardware Repair" },
  { title: "Data Recovery", description: "Recover lost, deleted, or corrupted files from hard drives, SSDs, and USB drives safely.", price: "₹1,500 – ₹5,000", duration: "1–3 days", category: "Data Recovery" },
  { title: "OS Installation & Setup", description: "Fresh installation of Windows 10/11, driver setup, and software configuration.", price: "₹500 – ₹1,200", duration: "2–3 hours", category: "Software Setup" },
  { title: "RAM / SSD Upgrade", description: "Upgrade your computer's RAM or replace HDD with fast SSD for improved performance.", price: "₹800 – ₹2,000 (labour)", duration: "1 hour", category: "Hardware Upgrade" },
  { title: "Network Setup & Configuration", description: "Home or office Wi-Fi setup, router configuration, and network troubleshooting.", price: "₹600 – ₹2,000", duration: "1–3 hours", category: "Network Setup" },
  { title: "Annual Maintenance Contract", description: "Yearly maintenance plan covering regular checkups, cleaning, and priority support.", price: "₹3,000 – ₹8,000/year", duration: "Ongoing", category: "AMC Service" },
];

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [seeded, setSeeded] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", price: "", duration: "", category: "" });
  const [editId, setEditId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [filterCat, setFilterCat] = useState("All");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onValue(ref(db, "services"), (snap) => {
      if (snap.exists()) {
        const data = snap.val();
        setServices(Object.entries(data).map(([id, val]: any) => ({ id, ...val })));
        setSeeded(true);
      } else {
        setServices([]);
        setSeeded(false);
      }
    });
    return () => unsub();
  }, []);

  // Seed defaults if empty
  useEffect(() => {
    if (!seeded && services.length === 0) {
      DEFAULT_SERVICES.forEach((s) => push(ref(db, "services"), s));
    }
  }, [seeded, services.length]);

  const resetForm = () => { setForm({ title: "", description: "", price: "", duration: "", category: "" }); setEditId(null); };

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error("Service title is required"); return; }
    if (!form.category) { toast.error("Please select a category"); return; }
    try {
      if (editId) {
        await update(ref(db, `services/${editId}`), form);
        toast.success("Service updated successfully");
      } else {
        await push(ref(db, "services"), form);
        toast.success("Service added successfully");
      }
      resetForm();
      setOpen(false);
    } catch { toast.error("Error saving service"); }
  };

  const handleDelete = async (id: string) => {
    await remove(ref(db, `services/${id}`));
    toast.success("Service deleted");
    setDeleteConfirm(null);
  };

  const openEdit = (s: Service) => {
    setForm({ title: s.title, description: s.description, price: s.price || "", duration: s.duration || "", category: s.category || "" });
    setEditId(s.id);
    setOpen(true);
  };

  const categories = ["All", ...CATEGORIES.filter((c) => services.some((s) => s.category === c))];
  const displayed = filterCat === "All" ? services : services.filter((s) => s.category === filterCat);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Service Management</h1>
          <p className="text-sm text-slate-500 mt-0.5">Add, edit, and manage all services offered by Valarmathi Computers</p>
        </div>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-200">
              <Plus className="h-4 w-4" /> Add New Service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">{editId ? "Edit" : "Add New"} Service</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              {/* Category */}
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Service Category *</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-white">
                  <option value="">Select a category...</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              {/* Title */}
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Service Name *</label>
                <Input placeholder="e.g. Laptop Screen Replacement" value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded-xl" />
              </div>
              {/* Price & Duration */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Estimated Price</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input placeholder="₹500 – ₹2,000" value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })} className="pl-9 rounded-xl" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Duration</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input placeholder="e.g. 2–4 hours" value={form.duration}
                      onChange={(e) => setForm({ ...form, duration: e.target.value })} className="pl-9 rounded-xl" />
                  </div>
                </div>
              </div>
              {/* Description */}
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Description</label>
                <Textarea placeholder="Describe what this service includes..." value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })} className="rounded-xl resize-none" rows={3} />
              </div>
              <Button onClick={handleSave}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl">
                {editId ? "Update Service" : "Add Service"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Row */}
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-4 gap-4"
        variants={staggerContainer(0.08)}
        initial="hidden" animate="visible"
      >
        {[
          { label: "Total Services", value: services.length, color: "from-blue-500 to-blue-700" },
          { label: "Categories", value: new Set(services.map((s) => s.category)).size, color: "from-violet-500 to-purple-700" },
          { label: "Active Bookings", value: "—", color: "from-emerald-500 to-green-700" },
          { label: "Avg. Rating", value: "4.8★", color: "from-amber-400 to-orange-500" },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            variants={staggerChild}
            whileHover={cardHover}
            className={`rounded-2xl bg-gradient-to-br ${stat.color} p-4 text-white shadow-md cursor-default`}
          >
            <p className="text-2xl font-extrabold">{stat.value}</p>
            <p className="text-xs text-white/80 mt-0.5 font-medium">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Category Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button key={cat} onClick={() => setFilterCat(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${filterCat === cat ? "bg-blue-600 text-white shadow-md shadow-blue-200" : "bg-white border border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600"}`}>
            {cat}
            {cat !== "All" && <span className="ml-1.5 opacity-70">({services.filter((s) => s.category === cat).length})</span>}
          </button>
        ))}
      </div>

      {/* Service Cards Grid */}
      <motion.div
        key={filterCat}
        className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        variants={staggerContainer(0.07)}
        initial="hidden" animate="visible"
      >
        {displayed.map((s) => {
          const Icon = CATEGORY_ICONS[s.category] ?? Wrench;
          const gradient = CATEGORY_COLORS[s.category] ?? "from-slate-400 to-slate-600";
          return (
            <motion.div
              key={s.id}
              variants={staggerChild}
              whileHover={cardHover}
              layout
              className="group relative rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden cursor-default"
            >
              {/* Color top bar */}
              <div className={`h-1.5 w-full bg-gradient-to-r ${gradient}`} />
              <div className="p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-sm`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 leading-tight truncate">{s.title}</h3>
                    <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{s.category}</span>
                  </div>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed mb-4 line-clamp-2">{s.description || "No description provided."}</p>
                {/* Price & Duration */}
                <div className="flex items-center gap-3 mb-4 text-xs">
                  {s.price && (
                    <div className="flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 rounded-lg px-2.5 py-1">
                      <DollarSign className="h-3 w-3" /> {s.price}
                    </div>
                  )}
                  {s.duration && (
                    <div className="flex items-center gap-1 text-blue-700 font-semibold bg-blue-50 rounded-lg px-2.5 py-1">
                      <Clock className="h-3 w-3" /> {s.duration}
                    </div>
                  )}
                </div>
                {/* Actions */}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEdit(s)}
                    className="flex-1 gap-1.5 text-xs font-semibold hover:border-blue-400 hover:text-blue-600">
                    <Pencil className="h-3 w-3" /> Edit
                  </Button>
                  {deleteConfirm === s.id ? (
                    <div className="flex gap-1 flex-1">
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(s.id)} className="flex-1 text-xs">Confirm</Button>
                      <Button size="sm" variant="outline" onClick={() => setDeleteConfirm(null)} className="flex-1 text-xs">Cancel</Button>
                    </div>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => setDeleteConfirm(s.id)}
                      className="gap-1.5 text-xs font-semibold hover:border-red-400 hover:text-red-500 hover:bg-red-50">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
        {displayed.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-slate-400">
            <Wrench className="h-12 w-12 mb-3 opacity-20" />
            <p className="font-semibold">No services in this category</p>
            <p className="text-sm mt-1">Add a new service to get started</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

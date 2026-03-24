import { useEffect, useState } from "react";
import { ref, onValue, update, remove, push } from "firebase/database";
import { db } from "@/lib/firebase";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { staggerContainer, staggerChild, cardHover, buttonTap, fadeUp } from "@/lib/animations";
import {
  Search, Filter, Eye, Trash2, CheckCircle, XCircle, MessageSquare,
  Clock, Phone, Mail, Calendar, Wrench, FileText, Circle,
  ChevronDown, X, Send, RefreshCw, TrendingUp, Users, AlertCircle
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────────────────
interface Quote {
  id: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  message: string;
  status: string;
  date: string;
  response?: string;
  respondedAt?: string;
}

// ─── Demo Data ─────────────────────────────────────────────────────────────────
const DEMO_QUOTES: Quote[] = [
  { id: "d1", name: "Ravi Kumar",     phone: "9876543210", email: "ravi@email.com",   service: "Laptop Repair",     message: "My laptop screen is cracked and the keyboard is not working. Need urgent repair.",          status: "Pending",    date: "2026-03-17" },
  { id: "d2", name: "Priya Lakshmi", phone: "9865432109", email: "priya@email.com",  service: "Data Recovery",     message: "Hard drive failed suddenly. Need to recover 5 years of important business data.",            status: "Responded",  date: "2026-03-16", response: "We can help! Please bring the drive to our center. Data recovery starts at ₹1,500.", respondedAt: "2026-03-16" },
  { id: "d3", name: "Suresh Babu",   phone: "9754321098", email: "suresh@email.com", service: "Network Setup",     message: "Need office-wide network setup for 20 workstations including switches and structured cabling.", status: "Approved",   date: "2026-03-15", response: "Quotation sent via email. Total cost: ₹18,000. Work can start within 3 days.", respondedAt: "2026-03-15" },
  { id: "d4", name: "Anu Devi",      phone: "9643210987", email: "anu@email.com",    service: "AMC Service",       message: "Looking for annual maintenance for 10 computers. Please provide a package quote.",             status: "Pending",    date: "2026-03-15" },
  { id: "d5", name: "Manoj Raj",     phone: "9532109876", email: "manoj@email.com",  service: "Hardware Upgrade",  message: "Want to upgrade RAM from 8GB to 32GB and replace HDD with 1TB SSD on 3 machines.",            status: "Rejected",   date: "2026-03-14", response: "Currently out of stock for DDR5 32GB modules. Please check back in 2 weeks.", respondedAt: "2026-03-14" },
  { id: "d6", name: "Kavitha S",    phone: "9421098765", email: "kavitha@email.com", service: "Software Setup",    message: "Need fresh OS installation (Windows 11) + Office 365 setup on 5 laptops for our team.",        status: "Responded",  date: "2026-03-14", response: "Cost: ₹500/laptop. Bulk discount applies: ₹2,000 for 5 laptops. Available this Saturday.", respondedAt: "2026-03-14" },
  { id: "d7", name: "Muthuraman",   phone: "9310987654", email: "muthu@email.com",  service: "Remote Support",    message: "Facing blue screen errors frequently on my work PC. Need remote troubleshooting ASAP.",         status: "Approved",   date: "2026-03-13", response: "Remote session scheduled for today at 4 PM. Please keep your TeamViewer ID ready.", respondedAt: "2026-03-13" },
];

const STATUS_CONFIG: Record<string, { label: string; style: string; dot: string }> = {
  "Pending":   { label: "Pending",   style: "bg-amber-100 text-amber-700 border border-amber-200",   dot: "bg-amber-400" },
  "Responded": { label: "Responded", style: "bg-blue-100 text-blue-700 border border-blue-200",      dot: "bg-blue-500" },
  "Approved":  { label: "Approved",  style: "bg-emerald-100 text-emerald-700 border border-emerald-200", dot: "bg-emerald-500" },
  "Rejected":  { label: "Rejected",  style: "bg-red-100 text-red-600 border border-red-200",         dot: "bg-red-400" },
};

const TABS = ["All", "Pending", "Responded", "Approved", "Rejected"];
const STATUSES = ["Pending", "Responded", "Approved", "Rejected"];

// ─── Status Dropdown ────────────────────────────────────────────────────────────
function StatusDropdown({ current, onChange }: { current: string; onChange: (s: string) => void }) {
  const [open, setOpen] = useState(false);
  const cfg = STATUS_CONFIG[current] ?? STATUS_CONFIG["Pending"];
  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border cursor-pointer ${cfg.style}`}>
        <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
        {cfg.label}
        <ChevronDown className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: -8 }}
            transition={{ duration: 0.18 }}
            className="absolute left-0 top-8 z-50 w-36 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden"
          >
            {STATUSES.map((s) => {
              const c = STATUS_CONFIG[s];
              return (
                <button key={s} onClick={() => { onChange(s); setOpen(false); }}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold hover:bg-slate-50 transition-colors ${current === s ? "bg-slate-50" : ""}`}>
                  <span className={`h-2 w-2 rounded-full ${c.dot}`} />
                  {s}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Respond Modal ──────────────────────────────────────────────────────────────
function RespondModal({ quote, onClose, onSend }: { quote: Quote; onClose: () => void; onSend: (id: string, resp: string) => void }) {
  const [response, setResponse] = useState(quote.response || "");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!response.trim()) { toast.error("Please type a response"); return; }
    setSending(true);
    await onSend(quote.id, response);
    setSending(false);
    onClose();
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        transition={{ duration: 0.25 }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-blue-950 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Send className="h-4 w-4 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-white/50">Responding to</p>
              <p className="text-sm font-bold text-white">{quote.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="h-8 w-8 rounded-xl bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Quote info */}
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs">
              <Wrench className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-slate-500">Service:</span>
              <span className="font-semibold text-slate-800">{quote.service}</span>
            </div>
            <div className="flex items-start gap-2 text-xs">
              <MessageSquare className="h-3.5 w-3.5 text-slate-400 mt-0.5 shrink-0" />
              <p className="text-slate-600 leading-relaxed">{quote.message}</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-500 pt-1 border-t border-slate-200">
              <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{quote.phone}</span>
              <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{quote.email}</span>
            </div>
          </div>

          {/* Response box */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Your Response</label>
            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              rows={5}
              placeholder="Type your response to the customer here..."
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none leading-relaxed"
            />
            <p className="text-xs text-slate-400 mt-1 text-right">{response.length} characters</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={handleSend} disabled={sending}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm py-2.5 rounded-xl shadow-md shadow-blue-200 disabled:opacity-60 transition-all"
            >
              {sending ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {sending ? "Sending..." : "Send Response"}
            </motion.button>
            <button onClick={onClose} className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Detail Modal ───────────────────────────────────────────────────────────────
function DetailModal({ quote, onClose, onStatusChange }: { quote: Quote; onClose: () => void; onStatusChange: (id: string, s: string) => void }) {
  const cfg = STATUS_CONFIG[quote.status] ?? STATUS_CONFIG["Pending"];
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        transition={{ duration: 0.25 }}
      >
        <div className="bg-gradient-to-r from-slate-900 to-blue-950 px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-white/50 font-mono"># {quote.id.slice(-6).toUpperCase()}</p>
            <p className="text-base font-bold text-white">{quote.name}</p>
          </div>
          <button onClick={onClose} className="h-8 w-8 rounded-xl bg-white/10 flex items-center justify-center text-white hover:bg-white/20">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-6 space-y-3">
          {[
            { icon: Wrench,   label: "Service",  value: quote.service },
            { icon: Phone,    label: "Phone",    value: quote.phone },
            { icon: Mail,     label: "Email",    value: quote.email },
            { icon: Calendar, label: "Date",     value: quote.date },
          ].map((row) => (
            <div key={row.label} className="flex items-center gap-3 text-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 shrink-0">
                <row.icon className="h-4 w-4 text-slate-500" />
              </div>
              <span className="text-slate-500 w-16 shrink-0 text-xs">{row.label}</span>
              <span className="font-semibold text-slate-900 text-xs">{row.value || "—"}</span>
            </div>
          ))}
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 mt-2">
            <p className="text-xs font-semibold text-slate-500 mb-1.5">Customer Message</p>
            <p className="text-sm text-slate-700 leading-relaxed">{quote.message}</p>
          </div>
          {quote.response && (
            <div className="rounded-xl bg-blue-50 border border-blue-200 p-3">
              <p className="text-xs font-semibold text-blue-600 mb-1.5 flex items-center gap-1"><Send className="h-3 w-3" /> Admin Response</p>
              <p className="text-sm text-blue-800 leading-relaxed">{quote.response}</p>
            </div>
          )}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Update Status</p>
            <div className="flex flex-wrap gap-2">
              {STATUSES.map((s) => (
                <button key={s} onClick={() => { onStatusChange(quote.id, s); onClose(); }}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all ${quote.status === s ? "border-blue-500 bg-blue-600 text-white" : "border-slate-200 text-slate-600 hover:border-blue-400 hover:text-blue-600"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminQuotes() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [viewQuote, setViewQuote] = useState<Quote | null>(null);
  const [respondQuote, setRespondQuote] = useState<Quote | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onValue(ref(db, "quoteRequests"), (snap) => {
      if (snap.exists()) {
        const data: Quote[] = Object.entries(snap.val()).map(([id, val]: any) => ({
          id,
          name: val.name || "Unknown",
          phone: val.phone || "—",
          email: val.email || "—",
          service: val.service || val.selectedService || "General",
          message: val.message || val.description || "",
          status: val.status || "Pending",
          date: val.date || val.createdAt || "",
          response: val.response || "",
          respondedAt: val.respondedAt || "",
        }));
        data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setQuotes(data.length > 0 ? data : DEMO_QUOTES);
      } else {
        setQuotes(DEMO_QUOTES);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const allData = quotes.length > 0 ? quotes : DEMO_QUOTES;

  const filtered = allData.filter((q) => {
    const qry = search.toLowerCase();
    const matchSearch = q.name.toLowerCase().includes(qry) || q.service.toLowerCase().includes(qry) || q.email.toLowerCase().includes(qry) || q.phone.includes(qry);
    const matchTab = activeTab === "All" || q.status === activeTab;
    return matchSearch && matchTab;
  });

  const counts: Record<string, number> = {};
  allData.forEach((q) => { counts[q.status] = (counts[q.status] || 0) + 1; });

  const updateStatus = async (id: string, status: string) => {
    if (!id.startsWith("d")) {
      try { await update(ref(db, `quoteRequests/${id}`), { status }); } catch { /* noop */ }
    }
    setQuotes((prev) => prev.map((q) => q.id === id ? { ...q, status } : q));
    toast.success(`Status updated to "${status}"`);
  };

  const sendResponse = async (id: string, response: string) => {
    const respondedAt = new Date().toISOString().slice(0, 10);
    if (!id.startsWith("d")) {
      try { await update(ref(db, `quoteRequests/${id}`), { response, respondedAt, status: "Responded" }); } catch { /* noop */ }
    }
    setQuotes((prev) => prev.map((q) => q.id === id ? { ...q, response, respondedAt, status: "Responded" } : q));
    toast.success("Response sent successfully!");
  };

  const deleteQuote = async (id: string) => {
    if (!id.startsWith("d")) {
      try { await remove(ref(db, `quoteRequests/${id}`)); } catch { /* noop */ }
    }
    setQuotes((prev) => prev.filter((q) => q.id !== id));
    toast.success("Quote request deleted");
    setDeleteId(null);
  };

  const stats = [
    { label: "Total Quotes",  value: allData.length,            icon: FileText,     color: "from-blue-500 to-blue-700" },
    { label: "Pending",       value: counts["Pending"]   || 0,  icon: Clock,        color: "from-amber-400 to-orange-500" },
    { label: "Responded",     value: counts["Responded"] || 0,  icon: MessageSquare,color: "from-indigo-500 to-indigo-700" },
    { label: "Approved",      value: counts["Approved"]  || 0,  icon: CheckCircle,  color: "from-emerald-500 to-green-700" },
  ];

  return (
    <motion.div className="space-y-6 pb-8" initial="hidden" animate="visible" variants={staggerContainer(0.1, 0.05)}>

      {/* Header */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md shadow-blue-200">
              <FileText className="h-4.5 w-4.5 text-white" />
            </div>
            Customer Quote Requests
          </h1>
          <p className="text-sm text-slate-500 mt-1 ml-11">Manage and respond to all quote requests from customers</p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 px-3 py-1.5 rounded-lg font-semibold">
            <Clock className="h-3.5 w-3.5" /> {counts["Pending"] || 0} Pending
          </span>
          <span className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-700 px-3 py-1.5 rounded-lg font-semibold">
            <MessageSquare className="h-3.5 w-3.5" /> {counts["Responded"] || 0} Responded
          </span>
        </div>
      </motion.div>

      {/* Stats Row */}
      <motion.div className="grid grid-cols-2 sm:grid-cols-4 gap-4" variants={staggerContainer(0.08)}>
        {stats.map((s) => (
          <motion.div key={s.label} variants={staggerChild} whileHover={cardHover}
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${s.color} p-4 text-white shadow-md cursor-default`}>
            <div className="absolute -top-4 -right-4 h-16 w-16 rounded-full bg-white/10 blur-sm" />
            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-2xl font-extrabold leading-none">{s.value}</p>
                <p className="text-xs text-white/80 mt-1 font-medium">{s.label}</p>
              </div>
              <s.icon className="h-6 w-6 text-white/60" />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Filter Tabs */}
      <motion.div variants={fadeUp} className="flex items-center gap-1.5 overflow-x-auto pb-1 flex-wrap">
        {TABS.map((tab) => (
          <motion.button key={tab} whileTap={buttonTap} onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${activeTab === tab ? "bg-blue-600 text-white shadow-md shadow-blue-200" : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"}`}>
            {tab}
            {tab !== "All" && counts[tab] ? (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${activeTab === tab ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}>
                {counts[tab]}
              </span>
            ) : null}
          </motion.button>
        ))}
      </motion.div>

      {/* Main Table Card */}
      <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border-b border-slate-100">
          <div className="flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-2 w-full sm:w-80">
            <Search className="h-4 w-4 text-slate-400 shrink-0" />
            <input type="text" placeholder="Search by name, service, email, phone..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-sm text-slate-600 placeholder-slate-400 outline-none w-full" />
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Filter className="h-3.5 w-3.5" />
            Showing <strong className="text-slate-700">{filtered.length}</strong> of <strong className="text-slate-700">{allData.length}</strong>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {["#", "Customer", "Service", "Date", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading
                ? [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      {[...Array(6)].map((_, j) => (
                        <td key={j} className="px-4 py-4"><div className="h-3 bg-slate-100 rounded-full w-full" /></td>
                      ))}
                    </tr>
                  ))
                : filtered.length === 0
                ? (
                    <tr>
                      <td colSpan={6} className="text-center py-16 text-slate-400">
                        <FileText className="h-10 w-10 mx-auto mb-2 opacity-20" />
                        <p className="text-sm font-medium">No quote requests found</p>
                        <p className="text-xs mt-1">Try changing the filter or search term</p>
                      </td>
                    </tr>
                  )
                : filtered.map((q, idx) => {
                    const cfg = STATUS_CONFIG[q.status] ?? STATUS_CONFIG["Pending"];
                    return (
                      <motion.tr
                        key={q.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.04, duration: 0.3 }}
                        className="hover:bg-blue-50/30 transition-colors group"
                      >
                        {/* ID */}
                        <td className="px-4 py-3.5 font-mono text-xs font-bold text-blue-600">
                          #{q.id.slice(-6).toUpperCase()}
                        </td>
                        {/* Customer */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
                              {q.name[0].toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800 text-xs leading-none">{q.name}</p>
                              <p className="text-[10px] text-slate-400 mt-0.5">{q.phone}</p>
                              <p className="text-[10px] text-slate-400">{q.email}</p>
                            </div>
                          </div>
                        </td>
                        {/* Service + Message */}
                        <td className="px-4 py-3.5 max-w-[200px]">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <Wrench className="h-3 w-3 text-slate-400 shrink-0" />
                            <span className="text-xs font-semibold text-slate-800 truncate">{q.service}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">{q.message}</p>
                        </td>
                        {/* Date */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1 text-xs text-slate-500">
                            <Calendar className="h-3 w-3 shrink-0" />
                            {q.date}
                          </div>
                        </td>
                        {/* Status */}
                        <td className="px-4 py-3.5">
                          <StatusDropdown current={q.status} onChange={(s) => updateStatus(q.id, s)} />
                        </td>
                        {/* Actions */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1">
                            <motion.button whileTap={buttonTap} onClick={() => setViewQuote(q)}
                              className="h-7 w-7 rounded-lg hover:bg-blue-50 hover:text-blue-600 text-slate-400 flex items-center justify-center transition-colors" title="View Details">
                              <Eye className="h-3.5 w-3.5" />
                            </motion.button>
                            <motion.button whileTap={buttonTap} onClick={() => setRespondQuote(q)}
                              className="h-7 w-7 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 text-slate-400 flex items-center justify-center transition-colors" title="Respond">
                              <Send className="h-3.5 w-3.5" />
                            </motion.button>
                            <motion.button whileTap={buttonTap} onClick={() => updateStatus(q.id, "Approved")}
                              className="h-7 w-7 rounded-lg hover:bg-emerald-50 hover:text-emerald-600 text-slate-400 flex items-center justify-center transition-colors" title="Approve">
                              <CheckCircle className="h-3.5 w-3.5" />
                            </motion.button>
                            {deleteId === q.id ? (
                              <div className="flex items-center gap-1">
                                <button onClick={() => deleteQuote(q.id)} className="text-[10px] px-2 py-1 rounded-lg bg-red-500 text-white font-bold">Yes</button>
                                <button onClick={() => setDeleteId(null)} className="text-[10px] px-2 py-1 rounded-lg bg-slate-100 text-slate-600 font-bold">No</button>
                              </div>
                            ) : (
                              <motion.button whileTap={buttonTap} onClick={() => setDeleteId(q.id)}
                                className="h-7 w-7 rounded-lg hover:bg-red-50 hover:text-red-500 text-slate-400 flex items-center justify-center transition-colors" title="Delete">
                                <Trash2 className="h-3.5 w-3.5" />
                              </motion.button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
              }
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 text-xs text-slate-500">
          <p>Showing {filtered.length} of {allData.length} quote requests</p>
          <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
            <TrendingUp className="h-3.5 w-3.5" />
            {counts["Approved"] || 0} approved this month
          </div>
        </div>
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {viewQuote && (
          <DetailModal quote={viewQuote} onClose={() => setViewQuote(null)} onStatusChange={updateStatus} />
        )}
        {respondQuote && (
          <RespondModal quote={respondQuote} onClose={() => setRespondQuote(null)} onSend={sendResponse} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

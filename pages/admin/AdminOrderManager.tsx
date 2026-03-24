import { useState, useEffect } from "react";
import { ref, onValue, update, push } from "firebase/database";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "@/lib/firebase";
import {
  Search, Filter, Eye, CheckCircle, XCircle, ClipboardList,
  Circle, Clock, Wrench, PhoneCall, Calendar, ChevronDown,
  Plus, ArrowLeft, User, Mail, Phone, FileText, Save
} from "lucide-react";
import { toast } from "sonner";

// ─── Types ─────────────────────────────────────────────────────────────────────
interface ServiceRequest {
  id: string;
  customerName?: string;
  name?: string;
  phone?: string;
  email?: string;
  service?: string;
  serviceType?: string;
  date?: string;
  bookingDate?: string;
  status?: string;
  amount?: string;
  price?: string;
  paymentStatus?: string;
  notes?: string;
}

// ─── Static fallback data ──────────────────────────────────────────────────────
const DEMO_REQUESTS: ServiceRequest[] = [
  { id: "d1", customerName: "Ravi Kumar",    phone: "9876543210", email: "ravi@email.com",   service: "Laptop Screen Replacement", date: "17 Mar 2026", status: "In Progress", amount: "₹4,500", paymentStatus: "Paid" },
  { id: "d2", customerName: "Priya Lakshmi", phone: "9865432109", email: "priya@email.com",  service: "Data Recovery",             date: "17 Mar 2026", status: "Completed",  amount: "₹3,000", paymentStatus: "Paid" },
  { id: "d3", customerName: "Suresh Babu",   phone: "9754321098", email: "suresh@email.com", service: "RAM Upgrade",               date: "16 Mar 2026", status: "Pending",    amount: "₹1,200", paymentStatus: "Paid" },
  { id: "d4", customerName: "Anu Devi",      phone: "9643210987", email: "anu@email.com",    service: "Virus Removal",             date: "16 Mar 2026", status: "Completed",  amount: "₹800",   paymentStatus: "Paid" },
  { id: "d5", customerName: "Manoj Raj",     phone: "9532109876", email: "manoj@email.com",  service: "Network Setup",             date: "15 Mar 2026", status: "Scheduled",  amount: "₹1,500", paymentStatus: "Paid" },
  { id: "d6", customerName: "Kavitha S",     phone: "9421098765", email: "kavitha@email.com",service: "OS Installation",           date: "15 Mar 2026", status: "In Progress",amount: "₹700",   paymentStatus: "Paid" },
  { id: "d7", customerName: "Muthuraman",    phone: "9310987654", email: "muthu@email.com",  service: "Hard Drive Replacement",    date: "14 Mar 2026", status: "Completed",  amount: "₹2,800", paymentStatus: "Paid" },
];

const STATUS_STYLES: Record<string, string> = {
  "Completed":   "bg-emerald-100 text-emerald-700 border border-emerald-200",
  "In Progress": "bg-blue-100 text-blue-700 border border-blue-200",
  "Pending":     "bg-amber-100 text-amber-700 border border-amber-200",
  "Scheduled":   "bg-indigo-100 text-indigo-700 border border-indigo-200",
  "Cancelled":   "bg-red-100 text-red-700 border border-red-200",
};

const PAYMENT_STYLES: Record<string, string> = {
  "Paid":   "bg-emerald-50 text-emerald-700 border border-emerald-200",
  "Unpaid": "bg-red-50 text-red-600 border border-red-200",
};

const TABS = ["All", "Pending", "Scheduled", "In Progress", "Completed", "Cancelled"];
const STATUSES = ["Pending", "Scheduled", "In Progress", "Completed", "Cancelled"];
const PAYMENT_STATUSES = ["Paid", "Unpaid"];

// ─── Status Update Dropdown ────────────────────────────────────────────────────
function StatusDropdown({ current, onChange }: { current: string; onChange: (s: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600 border border-slate-200 hover:border-blue-300 rounded-lg px-2 py-1 transition-all">
        Update <ChevronDown className="h-3 w-3" />
      </button>
      {open && (
        <div className="absolute right-0 top-7 z-50 w-36 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden">
          {STATUSES.map((s) => (
            <button key={s} onClick={() => { onChange(s); setOpen(false); }}
              className={`w-full text-left px-3 py-2 text-xs font-medium hover:bg-blue-50 hover:text-blue-600 transition-colors ${current === s ? "bg-blue-50 text-blue-600 font-bold" : "text-slate-600"}`}>
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Payment Status Update Dropdown ─────────────────────────────────────────────
function PaymentStatusDropdown({ current, onChange }: { current: string; onChange: (s: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)}
        className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full border transition-all hover:shadow-md ${
          current === "Paid" 
            ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100" 
            : "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
        }`}>
        {current || "Paid"} <ChevronDown className="h-3 w-3" />
      </button>
      {open && (
        <div className="absolute right-0 top-7 z-50 w-32 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden">
          {PAYMENT_STATUSES.map((s) => (
            <button key={s} onClick={() => { onChange(s); setOpen(false); }}
              className={`w-full text-left px-3 py-2 text-xs font-medium hover:bg-green-50 hover:text-green-600 transition-colors ${current === s ? "bg-green-50 text-green-600 font-bold" : "text-slate-600"}`}>
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminOrderManager() {
  const location = useLocation();
  const navigate = useNavigate();
  const isCreatingNew = location.pathname.endsWith('/new');
  
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [selected, setSelected] = useState<ServiceRequest | null>(null);

  // Form state for creating new service request
  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    email: "",
    service: "",
    date: "",
    amount: "",
    paymentStatus: "Paid",
    notes: "",
    status: "Pending"
  });

  useEffect(() => {
    const unsub = onValue(ref(db, "bookings"), (snap) => {
      if (snap.exists()) {
        const data: ServiceRequest[] = Object.entries(snap.val()).map(([id, val]: any) => ({
          id,
          customerName: val.customerName || val.name || "Unknown",
          phone: val.phone || val.contact || "—",
          email: val.email || "—",
          service: val.service || val.serviceType || "General Service",
          date: val.bookingDate || val.date || "—",
          status: val.status || "Pending",
          amount: val.amount || val.price || "—",
          paymentStatus: val.paymentStatus || "Paid",
          notes: val.notes || "",
        }));
        data.sort((a, b) => new Date(b.date || "").getTime() - new Date(a.date || "").getTime());
        setRequests(data);
      } else {
        setRequests(DEMO_REQUESTS);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const allData = requests.length > 0 ? requests : DEMO_REQUESTS;

  const filtered = allData.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch = (r.customerName || "").toLowerCase().includes(q) ||
      (r.service || "").toLowerCase().includes(q) || r.id.toLowerCase().includes(q);
    const matchTab = activeTab === "All" || r.status === activeTab;
    return matchSearch && matchTab;
  });

  const counts: Record<string, number> = {};
  allData.forEach((r) => { counts[r.status || ""] = (counts[r.status || ""] || 0) + 1; });

  const updateStatus = async (id: string, status: string) => {
    // Update in Firebase if it's a real record (not a demo)
    if (!id.startsWith("d")) {
      try { await update(ref(db, `bookings/${id}`), { status }); } catch { /* noop */ }
    }
    setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status } : r));
    toast.success(`Status updated to "${status}"`);
    if (selected?.id === id) setSelected((prev) => prev ? { ...prev, status } : prev);
  };

  const updatePaymentStatus = async (id: string, paymentStatus: string) => {
    // Update in Firebase if it's a real record (not a demo)
    if (!id.startsWith("d")) {
      try { await update(ref(db, `bookings/${id}`), { paymentStatus }); } catch { /* noop */ }
    }
    setRequests((prev) => prev.map((r) => r.id === id ? { ...r, paymentStatus } : r));
    toast.success(`Payment status updated to "${paymentStatus}"`);
    if (selected?.id === id) setSelected((prev) => prev ? { ...prev, paymentStatus } : prev);
  };

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customerName || !formData.phone || !formData.service) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const newRequest = {
        customerName: formData.customerName,
        phone: formData.phone,
        email: formData.email,
        service: formData.service,
        date: formData.date || new Date().toISOString().split('T')[0],
        amount: formData.amount,
        paymentStatus: formData.paymentStatus,
        notes: formData.notes,
        status: formData.status,
        createdAt: new Date().toISOString()
      };

      const newRef = push(ref(db, "bookings"));
      await update(newRef, newRequest);
      
      toast.success("Service request created successfully!");
      setFormData({
        customerName: "",
        phone: "",
        email: "",
        service: "",
        date: "",
        amount: "",
        paymentStatus: "Paid",
        notes: "",
        status: "Pending"
      });
      
      // Navigate back to the main orders page
      navigate("/admin/orders");
    } catch (error) {
      console.error("Error creating service request:", error);
      toast.error("Failed to create service request");
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const stats = [
    { label: "Total Requests", value: allData.length, icon: ClipboardList, color: "from-blue-500 to-blue-700" },
    { label: "Pending",        value: counts["Pending"] || 0, icon: Clock, color: "from-amber-400 to-orange-500" },
    { label: "In Progress",    value: counts["In Progress"] || 0, icon: Wrench, color: "from-indigo-500 to-indigo-700" },
    { label: "Completed",      value: counts["Completed"] || 0, icon: CheckCircle, color: "from-emerald-500 to-green-700" },
  ];

  return (
    <div className="space-y-5">
      {isCreatingNew ? (
        // Create New Service Request Form
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => navigate("/admin/orders")}
              className="h-10 w-10 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create Service Request</h1>
              <p className="text-sm text-slate-500 mt-0.5">Add a new customer service request</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleCreateRequest} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer Name */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <User className="h-4 w-4" />
                  Customer Name *
                </label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => handleInputChange("customerName", e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter customer name"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <Phone className="h-4 w-4" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter phone number"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter email address"
                />
              </div>

              {/* Service */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <Wrench className="h-4 w-4" />
                  Service Type *
                </label>
                <input
                  type="text"
                  value={formData.service}
                  onChange={(e) => handleInputChange("service", e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Laptop Screen Repair"
                  required
                />
              </div>

              {/* Date */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <Calendar className="h-4 w-4" />
                  Service Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Amount */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <FileText className="h-4 w-4" />
                  Estimated Amount
                </label>
                <input
                  type="text"
                  value={formData.amount}
                  onChange={(e) => handleInputChange("amount", e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., ₹2,500"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <FileText className="h-4 w-4" />
                Additional Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24 resize-none"
                placeholder="Enter any additional notes or special requirements..."
              />
            </div>

            {/* Form Actions */}
            <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => navigate("/admin/orders")}
                className="px-6 py-2.5 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Create Request
              </button>
            </div>
          </form>
        </div>
      ) : (
        // Existing Service Requests List
        <>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Service Requests</h1>
              <p className="text-sm text-slate-500 mt-0.5">Track and manage all customer service bookings</p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 px-3 py-1.5 rounded-lg font-semibold text-xs">
                <Clock className="h-3.5 w-3.5" /> {counts["Pending"] || 0} Pending
              </span>
              <span className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-700 px-3 py-1.5 rounded-lg font-semibold text-xs">
                <Wrench className="h-3.5 w-3.5" /> {counts["In Progress"] || 0} In Progress
              </span>
            </div>
          </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${s.color} p-4 text-white shadow-md`}>
            <div className="absolute -top-4 -right-4 h-16 w-16 rounded-full bg-white/10 blur-sm" />
            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-2xl font-extrabold leading-none">{s.value}</p>
                <p className="text-xs text-white/80 mt-1 font-medium">{s.label}</p>
              </div>
              <s.icon className="h-6 w-6 text-white/60" />
            </div>
          </div>
        ))}
      </div>

      {/* Status Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {TABS.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${activeTab === tab ? "bg-blue-600 text-white shadow-md shadow-blue-200" : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"}`}>
            {tab}
            {tab !== "All" && counts[tab] ? (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${activeTab === tab ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}>
                {counts[tab]}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border-b border-slate-100">
          <div className="flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-2 w-full sm:w-72">
            <Search className="h-4 w-4 text-slate-400 shrink-0" />
            <input type="text" placeholder="Search by name, service, or ID..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-sm text-slate-600 placeholder-slate-400 outline-none w-full" />
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Filter className="h-3.5 w-3.5" />
            Showing <strong>{filtered.length}</strong> of <strong>{allData.length}</strong>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {["Request ID", "Customer", "Service", "Date", "Amount", "Payment", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {[...Array(8)].map((_, j) => (
                      <td key={j} className="px-4 py-4"><div className="h-3.5 bg-slate-100 rounded-full w-full" /></td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-14 text-slate-400">
                    <ClipboardList className="h-10 w-10 mx-auto mb-2 opacity-20" />
                    <p className="text-sm font-medium">No service requests found</p>
                  </td>
                </tr>
              ) : (
                filtered.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-4 py-3.5 font-mono text-xs font-bold text-blue-600">
                      #{req.id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
                          {(req.customerName || "?")[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 text-xs leading-none">{req.customerName}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{req.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 text-xs max-w-[140px]">
                      <div className="flex items-center gap-1.5">
                        <Wrench className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{req.service}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1 text-slate-500 text-xs">
                        <Calendar className="h-3.5 w-3.5 shrink-0" />
                        {req.date}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-bold text-slate-900 text-xs">{req.amount}</td>
                    <td className="px-4 py-3.5">
                      <PaymentStatusDropdown current={req.paymentStatus || "Paid"} onChange={(s) => updatePaymentStatus(req.id, s)} />
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[req.status || "Pending"] ?? ""}`}>
                        <Circle className="h-1.5 w-1.5 fill-current" />{req.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => setSelected(req)}
                          className="h-7 w-7 rounded-lg hover:bg-blue-50 hover:text-blue-600 text-slate-400 flex items-center justify-center transition-colors" title="View Details">
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <StatusDropdown current={req.status || "Pending"} onChange={(s) => updateStatus(req.id, s)} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100 text-xs text-slate-500">
          <p>Showing {filtered.length} of {allData.length} requests</p>
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-gradient-to-r from-slate-900 to-blue-950 px-6 py-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-white/50 font-mono"># {selected.id.slice(-6).toUpperCase()}</p>
                <p className="text-base font-bold text-white">{selected.customerName}</p>
              </div>
              <button onClick={() => setSelected(null)} className="h-8 w-8 rounded-xl bg-white/10 flex items-center justify-center text-white hover:bg-white/20">
                <XCircle className="h-4 w-4" />
              </button>
            </div>
            <div className="p-6 space-y-3">
              {[
                { icon: Wrench,     label: "Service",    value: selected.service },
                { icon: Calendar,   label: "Date",       value: selected.date },
                { icon: PhoneCall,  label: "Phone",      value: selected.phone },
                { icon: ClipboardList, label: "Amount",  value: selected.amount },
              ].map((row) => (
                <div key={row.label} className="flex items-center gap-3 text-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
                    <row.icon className="h-4 w-4 text-slate-500" />
                  </div>
                  <span className="text-slate-500 w-20 shrink-0">{row.label}</span>
                  <span className="font-semibold text-slate-900">{row.value || "—"}</span>
                </div>
              ))}
              <div className="flex items-center gap-3 text-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
                  <Circle className="h-4 w-4 text-slate-500" />
                </div>
                <span className="text-slate-500 w-20 shrink-0">Status</span>
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_STYLES[selected.status || "Pending"] ?? ""}`}>
                  {selected.status}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
                  <CheckCircle className="h-4 w-4 text-slate-500" />
                </div>
                <span className="text-slate-500 w-20 shrink-0">Payment</span>
                <span className={`text-xs font-bold px-2 py-1 rounded-full border ${PAYMENT_STYLES[selected.paymentStatus || "Unpaid"] ?? ""}`}>
                  {selected.paymentStatus || "Unpaid"}
                </span>
              </div>
              {selected.notes && (
                <div className="mt-2 rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs text-slate-600">
                  <p className="font-semibold mb-1">Notes:</p>
                  <p>{selected.notes}</p>
                </div>
              )}
              {/* Status update */}
              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {STATUSES.map((s) => (
                    <button key={s} onClick={() => updateStatus(selected.id, s)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all ${selected.status === s ? "border-blue-500 bg-blue-600 text-white" : "border-slate-200 text-slate-600 hover:border-blue-400 hover:text-blue-600"}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment status update */}
              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Update Payment Status</p>
                <div className="flex flex-wrap gap-2">
                  {PAYMENT_STATUSES.map((s) => (
                    <button key={s} onClick={() => updatePaymentStatus(selected.id, s)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all ${selected.paymentStatus === s ? "border-green-500 bg-green-600 text-white" : "border-slate-200 text-slate-600 hover:border-green-400 hover:text-green-600"}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
}

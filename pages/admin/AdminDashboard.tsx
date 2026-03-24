import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ref, onValue } from "firebase/database";
import { db } from "@/lib/firebase";
import { motion } from "framer-motion";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { fadeUp, staggerContainer, staggerChild, cardHover, buttonTap } from "@/lib/animations";
import {
  Users, TrendingUp, DollarSign, Wrench, HardDrive,
  Download, Wifi, AlertTriangle, Package, ArrowUpRight, ArrowDownRight,
  Circle, Eye, UserCog, ClipboardList, Star, CheckCircle2,
  Clock, Shield, Headphones, Database, Monitor, BarChart2,
  Filter, ChevronDown, PieChart as PieIcon,
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend, AreaChart, Area,
} from "recharts";

// ─── Static analytics data ────────────────────────────────────────────────────
const revenueData = [
  { day: "Mon", revenue: 4200, target: 5000 },
  { day: "Tue", revenue: 6800, target: 5000 },
  { day: "Wed", revenue: 5100, target: 5500 },
  { day: "Thu", revenue: 8900, target: 6000 },
  { day: "Fri", revenue: 7300, target: 6000 },
  { day: "Sat", revenue: 11200, target: 8000 },
  { day: "Sun", revenue: 9400, target: 7000 },
];

const monthlyData = [
  { month: "Oct", revenue: 52000, orders: 38 },
  { month: "Nov", revenue: 68000, orders: 51 },
  { month: "Dec", revenue: 91000, orders: 74 },
  { month: "Jan", revenue: 73000, orders: 59 },
  { month: "Feb", revenue: 84000, orders: 66 },
  { month: "Mar", revenue: 109000, orders: 87 },
];

const categoryData = [
  { name: "Hardware Repair", value: 35, color: "#3b82f6" },
  { name: "Software Setup",  value: 25, color: "#6366f1" },
  { name: "Data Recovery",   value: 20, color: "#10b981" },
  { name: "Networking",      value: 12, color: "#f59e0b" },
  { name: "AMC Services",    value: 8,  color: "#ec4899" },
];

const recentRequests = [
  { id: "#SRV-2201", customer: "Ravi Kumar",    service: "Laptop Screen Repair", status: "In Progress", date: "17 Mar 2026", priority: "High",   amount: "₹3,500" },
  { id: "#SRV-2202", customer: "Priya Lakshmi", service: "Data Recovery",        status: "Completed",   date: "17 Mar 2026", priority: "Urgent", amount: "₹8,200" },
  { id: "#SRV-2203", customer: "Suresh Babu",   service: "RAM Upgrade",          status: "Pending",     date: "16 Mar 2026", priority: "Normal", amount: "₹2,100" },
  { id: "#SRV-2204", customer: "Anu Devi",       service: "Virus Removal",        status: "Completed",   date: "16 Mar 2026", priority: "Normal", amount: "₹1,500" },
  { id: "#SRV-2205", customer: "Manoj Raj",      service: "Network Setup",        status: "Scheduled",   date: "15 Mar 2026", priority: "High",   amount: "₹5,800" },
];

const STATUS_STYLES: Record<string, string> = {
  "Completed":   "bg-emerald-100 text-emerald-700 border border-emerald-200",
  "In Progress": "bg-blue-100 text-blue-700 border border-blue-200",
  "Pending":     "bg-amber-100 text-amber-700 border border-amber-200",
  "Scheduled":   "bg-indigo-100 text-indigo-700 border border-indigo-200",
  "Cancelled":   "bg-red-100 text-red-700 border border-red-200",
};

const PRIORITY_COLOR: Record<string, string> = {
  "Urgent": "bg-red-100 text-red-600",
  "High":   "bg-orange-100 text-orange-600",
  "Normal": "bg-slate-100 text-slate-500",
};

const serviceCategories = [
  { icon: Monitor,    label: "Hardware Repair", count: 142, pct: 78, color: "from-blue-500 to-blue-700",    bar: "bg-blue-500"    },
  { icon: Download,   label: "Software Setup",  count: 98,  pct: 62, color: "from-violet-500 to-violet-700",bar: "bg-violet-500"  },
  { icon: Database,   label: "Data Recovery",   count: 67,  pct: 48, color: "from-emerald-500 to-green-600",bar: "bg-emerald-500" },
  { icon: Wifi,       label: "Network Setup",   count: 53,  pct: 40, color: "from-cyan-500 to-blue-600",    bar: "bg-cyan-500"    },
  { icon: HardDrive,  label: "Upgrades",        count: 89,  pct: 68, color: "from-orange-400 to-orange-600",bar: "bg-orange-500"  },
  { icon: Shield,     label: "AMC Service",     count: 34,  pct: 30, color: "from-rose-500 to-red-600",     bar: "bg-rose-500"    },
  { icon: Headphones, label: "Remote Support",  count: 121, pct: 73, color: "from-indigo-500 to-indigo-700",bar: "bg-indigo-500"  },
  { icon: Wrench,     label: "Maintenance",     count: 78,  pct: 57, color: "from-amber-400 to-yellow-600", bar: "bg-amber-500"   },
];

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[status] ?? "bg-slate-100 text-slate-600"}`}>
      <Circle className="h-1.5 w-1.5 fill-current" />{status}
    </span>
  );
}

function RevenueTooltip({ active, payload, label }: any) {
  if (active && payload?.length) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-xl px-4 py-3 text-sm">
        <p className="font-bold text-slate-700 mb-1">{label}</p>
        <p className="text-blue-600 font-semibold">Revenue: ₹{payload[0]?.value?.toLocaleString()}</p>
        {payload[1] && <p className="text-slate-400 text-xs mt-0.5">Target: ₹{payload[1]?.value?.toLocaleString()}</p>}
      </div>
    );
  }
  return null;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({ users: 0, orders: 0, quotes: 0 });
  const [activeTab, setActiveTab] = useState<"weekly" | "monthly">("weekly");

  useEffect(() => {
    const unsubs = [
      onValue(ref(db, "users"),         (s) => setCounts((p) => ({ ...p, users:  s.exists() ? Object.keys(s.val()).length : 0 }))),
      onValue(ref(db, "bookings"),      (s) => setCounts((p) => ({ ...p, orders: s.exists() ? Object.keys(s.val()).length : 0 }))),
      onValue(ref(db, "quoteRequests"), (s) => setCounts((p) => ({ ...p, quotes: s.exists() ? Object.keys(s.val()).length : 0 }))),
    ];
    return () => unsubs.forEach((u) => u());
  }, []);

  const kpiCards = [
    {
      title: "Total Revenue",
      value: "₹1.09L",
      rawValue: 109000,
      isString: true,
      change: "+15.3%", up: true,
      sub: "This month",
      icon: DollarSign,
      gradient: "from-emerald-500 to-teal-600",
      bg: "bg-emerald-400/20",
    },
    {
      title: "Active Customers",
      value: counts.users || 284,
      change: "+12.5%", up: true,
      sub: "Registered accounts",
      icon: Users,
      gradient: "from-blue-500 to-blue-700",
      bg: "bg-blue-400/20",
    },
    {
      title: "Jobs Completed",
      value: 1240,
      change: "+8.2%", up: true,
      sub: "Lifetime total",
      icon: CheckCircle2,
      gradient: "from-violet-500 to-purple-700",
      bg: "bg-violet-400/20",
    },
    {
      title: "Pending Orders",
      value: counts.orders || 38,
      change: "-2.1%", up: false,
      sub: "Awaiting action",
      icon: Clock,
      gradient: "from-orange-400 to-orange-600",
      bg: "bg-orange-300/20",
    },
  ];

  const secondaryKpis = [
    { label: "Avg Ticket Value", value: "₹4,280", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Response Time",    value: "2.4 hrs",  icon: Clock,       color: "text-amber-600",  bg: "bg-amber-50"   },
    { label: "Customer Rating",  value: "4.8 ★",    icon: Star,        color: "text-yellow-600", bg: "bg-yellow-50"  },
    { label: "Quote Conversions",value: `${counts.quotes}`,icon: BarChart2,color:"text-blue-600", bg: "bg-blue-50"   },
  ];

  return (
    <motion.div
      className="space-y-6 pb-8"
      initial="hidden"
      animate="visible"
      variants={staggerContainer(0.1, 0.04)}
    >

      {/* ── PAGE HEADER ─────────────────────────────────────────────── */}
      <motion.div variants={fadeUp} className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-foreground flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-primary" />
            Analytics Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Revenue, performance & service metrics — updated live
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground hover:bg-secondary transition-colors">
            <Filter className="h-3.5 w-3.5" />
            Filter
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
          <button
            onClick={() => navigate("/admin/orders")}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:opacity-90 transition-all"
          >
            <Eye className="h-3.5 w-3.5" />
            View All Requests
          </button>
          <button
            onClick={() => navigate("/admin/users")}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:opacity-90 transition-all"
          >
            <UserCog className="h-3.5 w-3.5" />
            Manage Users
          </button>
        </div>
      </motion.div>

      {/* ── KPI CARDS ────────────────────────────────────────────────── */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
        variants={staggerContainer(0.08)}
      >
        {kpiCards.map((card) => (
          <motion.div
            key={card.title}
            variants={staggerChild}
            whileHover={cardHover}
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.gradient} p-5 text-white shadow-lg cursor-default`}
          >
            <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-white/10 blur-sm" />
            <div className="absolute -bottom-8 -right-2 h-20 w-20 rounded-full bg-white/5" />
            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-white/80">{card.title}</p>
                <p className="mt-1.5 text-3xl font-extrabold tracking-tight">
                  {card.isString
                    ? card.value
                    : <AnimatedCounter target={typeof card.value === "number" ? card.value : 0} />
                  }
                </p>
                <div className={`mt-2 flex items-center gap-1 text-xs font-semibold ${card.up ? "text-green-200" : "text-red-200"}`}>
                  {card.up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                  {card.change} vs last month
                </div>
                <p className="mt-1 text-[10px] text-white/50">{card.sub}</p>
              </div>
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${card.bg} backdrop-blur-sm`}>
                <card.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ── SECONDARY METRICS ────────────────────────────────────────── */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {secondaryKpis.map((kpi) => (
          <div key={kpi.label} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${kpi.bg}`}>
              <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
            </div>
            <div>
              <p className="text-base font-extrabold text-foreground">{kpi.value}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{kpi.label}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* ── REVENUE CHART ─────────────────────────────────────────────── */}
      <motion.div variants={fadeUp} className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h2 className="text-sm font-bold text-foreground">Revenue Analytics</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {activeTab === "weekly" ? "This week's daily trend vs target" : "6-month revenue & order trends"}
            </p>
          </div>
          <div className="flex items-center gap-1 rounded-xl border border-border p-1">
            {(["weekly", "monthly"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${activeTab === tab ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                {tab === "weekly" ? "Weekly" : "6-Month"}
              </button>
            ))}
          </div>
        </div>
        <div className="p-5">
          <ResponsiveContainer width="100%" height={240}>
            {activeTab === "weekly" ? (
              <AreaChart data={revenueData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip content={<RevenueTooltip />} />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2.5} fill="url(#revenueGrad)" dot={{ fill: "#3b82f6", r: 4, stroke: "#fff", strokeWidth: 2 }} />
                <Line type="monotone" dataKey="target" stroke="#e2e8f0" strokeWidth={1.5} strokeDasharray="5 5" dot={false} />
              </AreaChart>
            ) : (
              <BarChart data={monthlyData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar yAxisId="left" dataKey="revenue" name="Revenue (₹)" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                <Bar yAxisId="right" dataKey="orders" name="Orders" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* ── SERVICE CATEGORIES + PIE CHART ───────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">

        {/* Service performance bars */}
        <motion.div variants={fadeUp} className="xl:col-span-3 rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div>
              <h2 className="text-sm font-bold text-foreground">Service Category Performance</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Job count & completion rate by type</p>
            </div>
            <button
              onClick={() => navigate("/admin/services")}
              className="text-xs font-semibold text-primary hover:underline"
            >
              Manage →
            </button>
          </div>
          <div className="p-5 space-y-4">
            {serviceCategories.map((cat) => (
              <div key={cat.label} className="flex items-center gap-4">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${cat.color} shadow-sm`}>
                  <cat.icon className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-xs font-semibold text-foreground">{cat.label}</p>
                    <span className="text-xs text-muted-foreground">{cat.count} jobs · {cat.pct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${cat.bar}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${cat.pct}%` }}
                      transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Donut chart */}
        <motion.div variants={fadeUp} className="xl:col-span-2 rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <PieIcon className="h-4 w-4 text-muted-foreground" />
              Service Distribution
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">Share by category (% of total jobs)</p>
          </div>
          <div className="p-5">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  {categoryData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [`${v}%`, "Share"]} contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-1">
              {categoryData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-xs text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="text-xs font-bold text-foreground">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── SERVICE REQUESTS TABLE + ALERTS ───────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Requests table */}
        <motion.div variants={fadeUp} className="xl:col-span-2 rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-gradient-to-r from-slate-900 to-blue-950">
            <div>
              <h2 className="text-sm font-bold text-white">Recent Service Requests</h2>
              <p className="text-xs text-slate-400 mt-0.5">Latest 5 customer orders</p>
            </div>
            <button
              onClick={() => navigate("/admin/orders")}
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors"
            >
              View All →
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-secondary/50">
                  {["ID", "Customer", "Service", "Amount", "Priority", "Status"].map((h) => (
                    <th key={h} className="text-left text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-3.5 font-mono text-xs font-semibold text-blue-600">{req.id}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
                          {req.customer[0]}
                        </div>
                        <span className="text-xs font-medium text-foreground">{req.customer}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-muted-foreground">{req.service}</td>
                    <td className="px-4 py-3.5 text-xs font-bold text-foreground">{req.amount}</td>
                    <td className="px-4 py-3.5">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${PRIORITY_COLOR[req.priority] ?? "bg-slate-100 text-slate-500"}`}>
                        {req.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3.5"><StatusBadge status={req.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Right column */}
        <div className="flex flex-col gap-5">
          {/* Performance panel */}
          <motion.div variants={fadeUp} className="rounded-2xl bg-gradient-to-br from-slate-900 to-blue-950 p-5 text-white shadow-md">
            <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-blue-400" />
              Today's Performance
            </h2>
            <div className="space-y-2.5">
              {[
                { label: "New Requests",    value: "12",   icon: ClipboardList, color: "text-blue-400" },
                { label: "Completed Today", value: "8",    icon: CheckCircle2,  color: "text-emerald-400" },
                { label: "Avg Response",    value: "2.4h", icon: Clock,         color: "text-amber-400" },
                { label: "Customer Rating", value: "4.8★", icon: Star,          color: "text-yellow-400" },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3 border border-white/10">
                  <div className="flex items-center gap-2.5">
                    <s.icon className={`h-4 w-4 ${s.color}`} />
                    <span className="text-xs text-slate-300">{s.label}</span>
                  </div>
                  <span className="text-sm font-extrabold text-white">{s.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Low stock alert */}
          <motion.div variants={fadeUp} className="rounded-2xl border border-amber-200 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3.5 border-b border-amber-100 bg-amber-50">
              <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
              <div>
                <h2 className="text-xs font-bold text-amber-800">Low Stock Alert</h2>
                <p className="text-[10px] text-amber-500">4 items need restocking</p>
              </div>
            </div>
            {[
              { name: "RTX 4060 GPU",   stock: 3,  threshold: 10 },
              { name: "DDR5 16GB RAM",  stock: 5,  threshold: 15 },
              { name: "WD SSD 1TB",     stock: 4,  threshold: 12 },
              { name: 'LG 24" Monitor', stock: 2,  threshold: 8  },
            ].map((item) => (
              <div key={item.name} className="flex items-center justify-between px-4 py-3 border-b border-slate-50 last:border-0 hover:bg-amber-50/40 transition-colors">
                <div className="flex items-center gap-2.5">
                  <div className="h-7 w-7 shrink-0 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Package className="h-3.5 w-3.5 text-amber-600" />
                  </div>
                  <p className="text-xs font-semibold text-slate-800">{item.name}</p>
                </div>
                <div className="text-right">
                  <span className={`text-sm font-extrabold block ${item.stock <= 3 ? "text-red-600" : "text-amber-600"}`}>
                    {item.stock}
                  </span>
                  <span className="text-[9px] text-muted-foreground">/ {item.threshold} min</span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

    </motion.div>
  );
}

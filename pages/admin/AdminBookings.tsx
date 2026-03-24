import { useEffect, useState } from "react";
import { ref, onValue, update, remove } from "firebase/database";
import { db } from "@/lib/firebase";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Trash2, Search, Eye, Calendar, Clock, Wrench, User, Phone, Mail } from "lucide-react";
import { toast } from "sonner";

interface Booking {
  id: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  date: string;
  timeSlot: string;
  deviceType: string;
  issue: string;
  status: string;
  createdAt: string;
  userId?: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-blue-100 text-blue-800",
  "in-progress": "bg-purple-100 text-purple-800",
  completed: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewBooking, setViewBooking] = useState<Booking | null>(null);

  useEffect(() => {
    const unsub = onValue(ref(db, "bookings"), (snap) => {
      if (snap.exists()) {
        const data = snap.val();
        const list = Object.entries(data)
          .map(([id, val]: any) => ({ id, ...val }))
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setBookings(list);
      } else {
        setBookings([]);
      }
    });
    return () => unsub();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await update(ref(db, `bookings/${id}`), { status });
    toast.success(`Booking status updated to ${status}`);
  };

  const deleteBooking = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;
    await remove(ref(db, `bookings/${id}`));
    toast.success("Booking deleted");
  };

  const filtered = bookings.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.service.toLowerCase().includes(search.toLowerCase()) ||
      b.phone.includes(search);
    const matchesStatus = filterStatus === "all" || b.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    completed: bookings.filter((b) => b.status === "completed").length,
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-extrabold text-foreground">Service Bookings</h1>
        <p className="text-sm text-muted-foreground">Manage all customer service appointments.</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4 mb-6">
        <div className="rounded-xl border bg-card p-4 card-shadow">
          <p className="text-xs font-medium text-muted-foreground">Total Bookings</p>
          <p className="text-2xl font-bold text-foreground mt-1">{stats.total}</p>
        </div>
        <div className="rounded-xl border bg-card p-4 card-shadow">
          <p className="text-xs font-medium text-muted-foreground">Pending</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{stats.pending}</p>
        </div>
        <div className="rounded-xl border bg-card p-4 card-shadow">
          <p className="text-xs font-medium text-muted-foreground">Confirmed</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{stats.confirmed}</p>
        </div>
        <div className="rounded-xl border bg-card p-4 card-shadow">
          <p className="text-xs font-medium text-muted-foreground">Completed</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.completed}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, service, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border bg-card card-shadow">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-secondary/50">
              <th className="px-4 py-3 text-left font-semibold text-foreground">Customer</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">Service</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">Date & Time</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">Status</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => (
              <tr key={b.id} className="border-b last:border-0 hover:bg-secondary/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="font-medium text-foreground">{b.name}</div>
                  <div className="text-xs text-muted-foreground">{b.phone}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-foreground">{b.service}</div>
                  {b.deviceType && <div className="text-xs text-muted-foreground">{b.deviceType}</div>}
                </td>
                <td className="px-4 py-3">
                  <div className="text-foreground">{b.date ? new Date(b.date).toLocaleDateString("en-IN") : "—"}</div>
                  <div className="text-xs text-muted-foreground">{b.timeSlot || "—"}</div>
                </td>
                <td className="px-4 py-3">
                  <Select value={b.status} onValueChange={(v) => updateStatus(b.id, v)}>
                    <SelectTrigger className="h-8 w-32">
                      <Badge className={statusColors[b.status] || ""}>{b.status}</Badge>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setViewBooking(b)}>
                      <Eye className="mr-1 h-3 w-3" /> View
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => deleteBooking(b.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  {search || filterStatus !== "all" ? "No bookings match your filters." : "No bookings yet."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* View Booking Dialog */}
      <Dialog open={!!viewBooking} onOpenChange={(v) => !v && setViewBooking(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>
          {viewBooking && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">{viewBooking.name}</p>
                  <p className="text-xs text-muted-foreground">Customer</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{viewBooking.phone}</p>
                    <p className="text-xs text-muted-foreground">Phone</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium truncate">{viewBooking.email || "—"}</p>
                    <p className="text-xs text-muted-foreground">Email</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50">
                <Wrench className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{viewBooking.service}</p>
                  <p className="text-xs text-muted-foreground">Service{viewBooking.deviceType ? ` • ${viewBooking.deviceType}` : ""}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{viewBooking.date ? new Date(viewBooking.date).toLocaleDateString("en-IN") : "—"}</p>
                    <p className="text-xs text-muted-foreground">Date</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{viewBooking.timeSlot || "—"}</p>
                    <p className="text-xs text-muted-foreground">Time</p>
                  </div>
                </div>
              </div>
              {viewBooking.issue && (
                <div className="p-3 rounded-lg bg-secondary/50">
                  <p className="text-xs text-muted-foreground mb-1">Issue / Notes</p>
                  <p className="text-sm text-foreground">{viewBooking.issue}</p>
                </div>
              )}
              <div className="flex items-center justify-between pt-2">
                <Badge className={statusColors[viewBooking.status] || ""}>
                  {viewBooking.status}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Booked: {new Date(viewBooking.createdAt).toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { useEffect, useState } from "react";
import { ref, onValue, update, remove, push } from "firebase/database";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "@/lib/firebase";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Trash2, Search, UserCheck, UserX, Users, ArrowLeft, User, Mail, Save, Phone } from "lucide-react";
import { toast } from "sonner";

interface UserData {
  id: string;
  displayName: string;
  email: string;
  photoURL?: string;
  role: string;
  createdAt: any;
}

export default function AdminUsers() {
  const location = useLocation();
  const navigate = useNavigate();
  const isCreatingNew = location.pathname.endsWith('/new');
  
  const [users, setUsers] = useState<UserData[]>([]);
  const [search, setSearch] = useState("");

  // Form state for creating new user
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    phone: "",
    role: "user"
  });

  useEffect(() => {
    const unsub = onValue(ref(db, "users"), (snap) => {
      if (snap.exists()) {
        const data = snap.val();
        const list = Object.entries(data).map(([id, val]: any) => ({
          id,
          displayName: val.displayName || "No Name",
          email: val.email || "No Email",
          photoURL: val.photoURL || "",
          role: val.role || "user",
          createdAt: val.createdAt || null,
        }));
        // Sort: admins first, then by name
        list.sort((a, b) => {
          if (a.role === "admin" && b.role !== "admin") return -1;
          if (a.role !== "admin" && b.role === "admin") return 1;
          return a.displayName.localeCompare(b.displayName);
        });
        setUsers(list);
      } else {
        setUsers([]);
      }
    });
    return () => unsub();
  }, []);

  const updateRole = async (id: string, role: string) => {
    await update(ref(db, `users/${id}`), { role });
    toast.success(`User role updated to ${role}`);
  };

  const deleteUser = async (id: string) => {
    if (!window.confirm("Are you sure you want to remove this user?")) return;
    await remove(ref(db, `users/${id}`));
    toast.success("User removed");
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.displayName || !formData.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const newUser = {
        displayName: formData.displayName,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        createdAt: new Date().toISOString()
      };

      const newRef = push(ref(db, "users"));
      await update(newRef, newUser);
      
      toast.success("User created successfully!");
      setFormData({
        displayName: "",
        email: "",
        phone: "",
        role: "user"
      });
      
      // Navigate back to main users page
      navigate("/admin/users");
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Failed to create user");
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const filteredUsers = users.filter(
    (u) =>
      u.displayName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const adminCount = users.filter((u) => u.role === "admin").length;
  const userCount = users.filter((u) => u.role === "user").length;

  return (
    <div>
      {isCreatingNew ? (
        // Create New User Form
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => navigate("/admin/users")}
              className="h-10 w-10 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Add New User</h1>
              <p className="text-sm text-slate-500 mt-0.5">Create a new user account</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleCreateUser} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Display Name */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <User className="h-4 w-4" />
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => handleInputChange("displayName", e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter full name"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <Mail className="h-4 w-4" />
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter email address"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <Phone className="h-4 w-4" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter phone number"
                />
              </div>

              {/* Role */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <UserCheck className="h-4 w-4" />
                  User Role *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => handleInputChange("role", e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="user">Regular User</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => navigate("/admin/users")}
                className="px-6 py-2.5 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Create User
              </button>
            </div>
          </form>
        </div>
      ) : (
        // Existing Users List
        <>
          <div className="mb-6">
            <h1 className="font-display text-2xl font-extrabold text-foreground">Users</h1>
            <p className="text-sm text-muted-foreground">Manage all registered users and their roles.</p>
          </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <div className="rounded-xl border bg-card p-5 card-shadow flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500">
            <Users className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{users.length}</p>
            <p className="text-xs text-muted-foreground">Total Users</p>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-5 card-shadow flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500">
            <UserCheck className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{adminCount}</p>
            <p className="text-xs text-muted-foreground">Admins</p>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-5 card-shadow flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500">
            <UserX className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{userCount}</p>
            <p className="text-xs text-muted-foreground">Regular Users</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4 relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border bg-card card-shadow">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-secondary/50">
              <th className="px-4 py-3 text-left font-semibold text-foreground">User</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">Email</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">Role</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">Joined</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u.id} className="border-b last:border-0 hover:bg-secondary/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {u.photoURL ? (
                      <img src={u.photoURL} alt={u.displayName} className="h-8 w-8 rounded-full object-cover" />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                        {u.displayName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="font-medium text-foreground">{u.displayName}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                <td className="px-4 py-3">
                  <Select value={u.role} onValueChange={(v) => updateRole(u.id, v)}>
                    <SelectTrigger className="h-8 w-28">
                      <Badge className={u.role === "admin" ? "bg-emerald-100 text-emerald-800" : "bg-blue-100 text-blue-800"}>
                        {u.role}
                      </Badge>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                </td>
                <td className="px-4 py-3">
                  <Button variant="destructive" size="sm" onClick={() => deleteUser(u.id)}>
                    <Trash2 className="mr-1 h-3 w-3" /> Remove
                  </Button>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  {search ? "No users match your search." : "No users registered yet."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
        </>
      )}
    </div>
  );
}

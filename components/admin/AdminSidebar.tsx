import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Wrench, FileText, ImageIcon, MessageSquare,
  Star, Users, Settings, LogOut, Monitor, ChevronLeft, ChevronRight,
  Home, UserCog, CalendarCheck, BarChart2, Globe,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const menuItems = [
  { icon: Home,          label: "Home",              path: "/admin",           exact: true  },
  { icon: BarChart2,     label: "Analytics",         path: "/admin/dashboard", exact: true  },
  { icon: Wrench,        label: "Services",          path: "/admin/services",  exact: false },
  { icon: CalendarCheck, label: "Bookings",          path: "/admin/bookings",  exact: false },
  { icon: FileText,      label: "Quote Requests",    path: "/admin/quotes",    exact: false },
  { icon: ImageIcon,     label: "Brands",            path: "/admin/brands",    exact: false },
  { icon: Star,          label: "Testimonials",      path: "/admin/testimonials", exact: false },
  { icon: MessageSquare, label: "Contact Messages",  path: "/admin/messages",  exact: false },
  { icon: Users,         label: "Technicians",       path: "/admin/technicians", exact: false },
  { icon: UserCog,       label: "Users",             path: "/admin/users",     exact: false },
  { icon: Settings,      label: "Settings",          path: "/admin/settings",  exact: false },
];

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <aside className={`flex h-screen flex-col border-r bg-sidebar transition-all duration-300 ${collapsed ? "w-16" : "w-64"}`}>
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg hero-gradient">
          <Monitor className="h-4 w-4 text-primary-foreground" />
        </div>
        {!collapsed && <span className="text-sm font-bold text-sidebar-foreground">VC Admin</span>}
      </div>

      {/* Menu */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {menuItems.map((item) => {
          const active = item.exact
            ? location.pathname === item.path
            : location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-sidebar-border p-3 space-y-1">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <Globe className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Visit Public Site</span>}
        </a>
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-muted hover:text-sidebar-foreground"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <><ChevronLeft className="h-4 w-4" /><span>Collapse</span></>}
        </button>
      </div>
    </aside>
  );
}

import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Home, LayoutDashboard, Wrench, Users, ClipboardList,
  Globe, ChevronDown, Bell, Search, LogOut, Menu, X,
  Settings, MessageSquare, UserCog, FileText, BarChart2, ExternalLink,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const languages = [
  { code: "en", label: "English", flag: "🇬🇧" }
];

// All paths stay within /admin — clicking Home goes to Admin Home, not public site
const navItems = [
  { icon: Home,           label: "Home",             path: "/admin",           exact: true  },
  { icon: BarChart2,      label: "Analytics",        path: "/admin/dashboard", exact: true  },
  { icon: Wrench,         label: "Services",         path: "/admin/services",  exact: false },
  { icon: ClipboardList,  label: "Requests",         path: "/admin/orders",    exact: false },
  { icon: FileText,       label: "Quotes",           path: "/admin/quotes",    exact: false },
  { icon: Users,          label: "Customers",        path: "/admin/users",     exact: false },
  { icon: MessageSquare,  label: "Bookings",         path: "/admin/bookings",  exact: false },
  { icon: Settings,       label: "Settings",         path: "/admin/settings",  exact: false },
];

export default function AdminNavbar() {
  const [langOpen, setLangOpen]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState(languages[0]);
  const navigate  = useNavigate();
  const location  = useLocation();
  const { user, signOut } = useAuth();

  // Determine which nav item is active
  const isActive = (item: typeof navItems[0]) => {
    if (item.exact) return location.pathname === item.path;
    return location.pathname.startsWith(item.path);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const initials = user?.displayName
    ? user.displayName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "VM";

  return (
    <header className="h-16 bg-background border-b border-border shadow-sm flex items-center px-4 lg:px-6 gap-4 z-50 sticky top-0">

      {/* Logo */}
      <div className="flex items-center gap-2.5 shrink-0">
        <a href="/" className="flex items-center gap-2 group">
          <img src="/vc-logo.png" alt="Valarmathi Computers"
            className="h-9 w-9 object-contain transition-transform duration-300 group-hover:scale-110 drop-shadow-sm" />
          <div className="hidden sm:block leading-tight select-none">
            <p className="text-sm font-extrabold text-foreground leading-none tracking-tight">VALARMATHI</p>
            <p className="text-[10px] font-semibold tracking-[0.15em] text-primary uppercase leading-none mt-0.5">SERVICE MANAGEMENT</p>
          </div>
        </a>
      </div>

      {/* Desktop Nav */}
      <nav className="hidden lg:flex items-center gap-0.5 ml-4 flex-1">
        {navItems.map((item) => {
          const active = isActive(item);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                active
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                  : "text-muted-foreground hover:text-primary hover:bg-accent"
              }`}
            >
              <item.icon className={`h-3.5 w-3.5 shrink-0 ${active ? "text-primary-foreground" : ""}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Right section */}
      <div className="ml-auto flex items-center gap-2">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-secondary rounded-lg px-3 py-1.5 w-44">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input type="text" placeholder="Search..." className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-full" />
        </div>

        {/* Notification Bell */}
        <button className="relative h-9 w-9 rounded-lg hover:bg-secondary flex items-center justify-center transition-colors">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive ring-2 ring-background" />
        </button>

        {/* Language Selector */}
        <div className="relative">
          <button onClick={() => setLangOpen(!langOpen)}
            className="flex items-center gap-1.5 h-9 px-2.5 rounded-lg hover:bg-secondary text-sm font-medium text-muted-foreground transition-colors">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">{selectedLang.flag} {selectedLang.label}</span>
            <ChevronDown className={`h-3 w-3 transition-transform ${langOpen ? "rotate-180" : ""}`} />
          </button>
          {langOpen && (
            <div className="absolute right-0 top-11 w-40 bg-background rounded-xl border border-border shadow-xl z-50 overflow-hidden">
              {languages.map((lang) => (
                <button key={lang.code} onClick={() => { setSelectedLang(lang); setLangOpen(false); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm hover:bg-accent hover:text-primary transition-colors ${selectedLang.code === lang.code ? "bg-accent text-primary font-semibold" : "text-muted-foreground"}`}>
                  <span>{lang.flag}</span>{lang.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Admin Profile Dropdown */}
        <div className="relative">
          <button onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 h-9 px-2.5 rounded-lg hover:bg-secondary text-muted-foreground transition-colors">
            <div className="h-7 w-7 rounded-full hero-gradient flex items-center justify-center text-primary-foreground text-xs font-bold shadow">
              {initials}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-foreground leading-none">{user?.displayName?.split(" ")[0] || "Admin"}</p>
              <p className="text-[10px] text-primary font-semibold mt-0.5">Administrator</p>
            </div>
            <ChevronDown className={`h-3 w-3 transition-transform ${profileOpen ? "rotate-180" : ""}`} />
          </button>
          {profileOpen && (
            <div className="absolute right-0 top-11 w-52 bg-background rounded-xl border border-border shadow-xl z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-border bg-secondary/50">
                <p className="text-sm font-bold text-foreground">{user?.displayName || "Admin"}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
              <Link to="/admin/settings" onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-muted-foreground hover:bg-accent hover:text-primary transition-colors">
                <UserCog className="h-4 w-4" /> Profile Settings
              </Link>
              <a href="/" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-muted-foreground hover:bg-accent hover:text-primary transition-colors">
                <ExternalLink className="h-4 w-4" /> Visit Public Site
              </a>
              <button onClick={handleSignOut}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors border-t border-border">
                <LogOut className="h-4 w-4" /> Sign Out
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden h-9 w-9 rounded-lg hover:bg-secondary flex items-center justify-center">
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="absolute top-16 left-0 right-0 bg-background border-b border-border shadow-xl lg:hidden z-40">
          <nav className="flex flex-col p-3 gap-1">
            {navItems.map((item) => {
              const active = isActive(item);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    active
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                      : "text-muted-foreground hover:text-primary hover:bg-accent"
                  }`}
                >
                  <item.icon className={`h-5 w-5 ${active ? "text-primary-foreground" : ""}`} />
                  {item.label}
                  {active && <span className="ml-auto h-2 w-2 rounded-full bg-primary-foreground/70" />}
                </Link>
              );
            })}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-destructive hover:bg-destructive/10 transition-all mt-1 border-t border-border">
              <LogOut className="h-5 w-5" /> Sign Out
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}

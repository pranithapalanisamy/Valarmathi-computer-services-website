import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Menu, X, User as UserIcon, LogIn, UserPlus,
  LayoutDashboard, LogOut, ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { label: "Home",        href: "/",           hash: "home"       },
  { label: "Services",    href: "/#services",  hash: "services"   },
  { label: "Book Now",    href: "/#booking",   hash: "booking"    },
  { label: "About",       href: "/#about",     hash: "about"      },
  { label: "Why Us",      href: "/#whyus",     hash: "whyus"      },
  { label: "Contact Us",  href: "/#contact",hash: "contact-us" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();

  const isAdmin = role === "admin";

  // Track active section via IntersectionObserver
  useEffect(() => {
    const sectionIds = ["home", "services", "booking", "about", "whyus", "contact-us"];
    const observers: IntersectionObserver[] = [];
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { 
          if (entry.isIntersecting) {
            console.log(`Section ${id} is now active`); // Debug log
            setActiveSection(id); 
          } 
        },
        // Very strict detection - only trigger when section is clearly in view
        { threshold: 0.5, rootMargin: "-120px 0px -70% 0px" } 
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const isActive = (hash: string) => activeSection === hash;

  // Navigate to homepage section — works from any page (e.g. /dashboard)
  const handleNavClick = (e: React.MouseEvent, link: typeof navLinks[0]) => {
    const isHome = location.pathname === "/";
    if (link.href === "/") {
      // "Home" — just go to /
      if (!isHome) { e.preventDefault(); navigate("/"); }
      return;
    }
    if (!isHome) {
      // Not on homepage — navigate there first, then scroll via hash
      e.preventDefault();
      navigate(link.href);
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between">

        {/* ── Logo ── */}
        <Link to="/" className="flex items-center gap-2 group">
          <img
            src="/vc-logo.png"
            alt="Valarmathi Computers Logo"
            className="h-10 w-10 object-contain transition-transform duration-300 group-hover:scale-110 drop-shadow-sm"
          />
          <div className="leading-tight select-none">
            <p className="text-base font-extrabold tracking-tight text-foreground leading-none">VALARMATHI</p>
            <p className="text-[11px] font-semibold tracking-[0.15em] text-primary uppercase leading-none mt-0.5">COMPUTERS</p>
          </div>
        </Link>

        {/* ── Desktop Nav ── */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((l) => {
            const active = isActive(l.hash);
            return (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => { handleNavClick(e, l); setActiveSection(l.hash); }}
                className={`relative rounded-md px-3 py-2 text-sm font-semibold transition-all duration-200 ${
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l.label}
                {/* Active underline bar */}
                <span
                  className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full bg-primary transition-all duration-300 ${
                    active ? "w-4/5 opacity-100" : "w-0 opacity-0"
                  }`}
                />
              </a>
            );
          })}
          <a href="/#contact-us">
            <Button size="sm" className="ml-2 hero-gradient text-white hover:opacity-90 border-0">Get Quote</Button>
          </a>

          {/* ── User section ── */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-1 flex items-center gap-2 rounded-full pr-3 pl-1 hover:bg-secondary"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || "User"}
                      className="h-8 w-8 rounded-full ring-2 ring-primary/20"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
                      {(user.displayName || "U")[0].toUpperCase()}
                    </div>
                  )}
                  <span className="hidden sm:block text-sm font-semibold text-foreground max-w-[100px] truncate">
                    {user.displayName?.split(" ")[0] || "Account"}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col">
                    <span className="font-bold text-sm">{user.displayName || "My Account"}</span>
                    <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                    <span className={`text-[10px] font-semibold uppercase tracking-widest mt-1 ${isAdmin ? "text-primary" : "text-muted-foreground"}`}>
                      {isAdmin ? "🛡️ Administrator" : "👤 Customer"}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isAdmin && (
                  <DropdownMenuItem onClick={() => navigate("/admin")} className="gap-2 text-primary font-semibold">
                    <LayoutDashboard className="h-4 w-4" /> Admin Dashboard
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={() => signOut()}
                  className="gap-2 text-destructive focus:text-destructive focus:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4" /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-1.5 ml-1">
              <Button variant="outline" size="sm" onClick={() => navigate("/login")} className="gap-1.5">
                <LogIn className="h-4 w-4" /> Login
              </Button>
              <Button size="sm" onClick={() => navigate("/login?mode=signup")} className="gap-1.5 hero-gradient text-white hover:opacity-90 border-0">
                <UserPlus className="h-4 w-4" /> Sign Up
              </Button>
            </div>
          )}
        </div>

        {/* ── Mobile hamburger ── */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-secondary transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* ── Mobile menu ── */}
      {open && (
        <div className="border-t bg-background p-4 md:hidden space-y-1">
          {navLinks.map((l) => {
            const active = isActive(l.hash);
            return (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => { handleNavClick(e, l); setOpen(false); setActiveSection(l.hash); }}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                  active
                    ? "bg-accent text-primary border-l-2 border-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {active && <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />}
                {l.label}
              </a>
            );
          })}

          <div className="pt-2 border-t mt-2 space-y-2">
            <a href="#contact" onClick={() => setOpen(false)}>
              <Button size="sm" className="w-full hero-gradient text-white hover:opacity-90 border-0">Get Quote</Button>
            </a>

            {user ? (
              <div className="border-t pt-3 mt-1">
                {/* User info */}
                <div className="flex items-center gap-3 px-2 mb-3">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="" className="h-9 w-9 rounded-full" />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                      {(user.displayName || "U")[0].toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">{user.displayName || "My Account"}</p>
                    <p className={`text-[10px] font-semibold uppercase tracking-wide ${isAdmin ? "text-primary" : "text-muted-foreground"}`}>
                      {isAdmin ? "🛡️ Administrator" : "👤 Customer"}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-2 text-destructive border-destructive/30 hover:bg-destructive/10"
                  onClick={() => { signOut(); setOpen(false); }}
                >
                  <LogOut className="h-4 w-4" /> Log out
                </Button>
              </div>
            ) : (
              <div className="border-t pt-3 mt-1 space-y-2">
                <Button variant="outline" size="sm" className="w-full gap-1.5" onClick={() => { navigate("/login"); setOpen(false); }}>
                  <LogIn className="h-4 w-4" /> Login
                </Button>
                <Button size="sm" className="w-full gap-1.5 hero-gradient text-white hover:opacity-90 border-0" onClick={() => { navigate("/login?mode=signup"); setOpen(false); }}>
                  <UserPlus className="h-4 w-4" /> Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

// ─── Full-screen loader ───────────────────────────────────────────────────────
function AuthLoader() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <img
            src="/vc-logo.png"
            alt="Valarmathi Computers"
            className="h-16 w-16 object-contain animate-pulse"
          />
          <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
          </span>
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-slate-700">VALARMATHI COMPUTERS</p>
          <p className="text-xs text-slate-400 mt-0.5">Verifying your session...</p>
        </div>
      </div>
    </div>
  );
}

// ─── Admin-only protected route ───────────────────────────────────────────────
// Requires: authenticated + role === "admin"
// Redirects to /admin-login if not authenticated or not admin
export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  if (loading) return <AuthLoader />;

  if (!user) {
    // Not logged in → go to admin login, preserve intended URL
    return <Navigate to="/admin-login" state={{ from: location }} replace />;
  }

  if (role !== "admin") {
    // Logged in but not admin → back to home with message
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

// ─── Customer protected route ─────────────────────────────────────────────────
// Requires: authenticated (any role)
// Redirects to /login if not authenticated
export function UserRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <AuthLoader />;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

// ─── Guest-only route ─────────────────────────────────────────────────────────
// For /login: redirects any logged-in user to home.
// For /admin-login (adminOnly=true): only redirects if user is already an admin
//   — allows non-admin (customer) users through so they can enter admin credentials.
export function GuestRoute({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const { user, role, loading } = useAuth();

  if (loading) return <AuthLoader />;

  if (user) {
    if (adminOnly) {
      // Already an admin → skip login, go straight to dashboard
      if (role === "admin") return <Navigate to="/admin" replace />;
      // Regular customer → allow them to see admin login (they may have admin credentials)
      return <>{children}</>;
    }
    // Non-admin-only guest route (e.g. /login) → redirect home if already signed in
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

import { Outlet, Navigate } from "react-router-dom";
import AdminNavbar from "@/components/admin/AdminNavbar";
import { useAuth } from "@/contexts/AuthContext";
import AccessDenied from "@/pages/AccessDenied";

export default function AdminLayout() {
  const { user, role, loading } = useAuth();

  // Show branded spinner while Firebase checks auth state
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <img
              src="/vc-logo.png"
              alt="Valarmathi Computers"
              className="h-14 w-14 object-contain animate-pulse"
            />
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex h-4 w-4 rounded-full bg-blue-500" />
            </span>
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-slate-700">VALARMATHI COMPUTERS</p>
            <p className="text-xs text-slate-400 mt-0.5">Loading Admin Dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  // Not logged in → redirect to admin login page
  if (!user) {
    return <Navigate to="/admin-login" replace />;
  }

  // Logged in but not admin → show Access Denied page
  if (role !== "admin") {
    return <AccessDenied />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <AdminNavbar />
      <main className="flex-1 overflow-y-auto p-5 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}

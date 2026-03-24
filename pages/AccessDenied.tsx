import { Link, useNavigate } from "react-router-dom";
import { ShieldX, Home, LogIn } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function AccessDenied() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 px-4 text-center">
      {/* Glows */}
      <div className="absolute -top-32 -left-32 h-80 w-80 rounded-full bg-red-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-md w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl">
        {/* Icon */}
        <div className="flex h-20 w-20 mx-auto mb-6 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20">
          <ShieldX className="h-10 w-10 text-red-400" />
        </div>

        <h1 className="text-3xl font-extrabold text-white mb-2">Access Denied</h1>
        <p className="text-slate-400 text-sm leading-relaxed mb-8">
          You don't have permission to view this page. This area is restricted to
          <span className="text-blue-400 font-semibold"> administrators only</span>.
        </p>

        {/* Role badge */}
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-8">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Your role:</span>
          <span className="text-xs font-bold text-orange-400 uppercase tracking-widest">
            {user ? "Customer" : "Guest"}
          </span>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/admin-login")}
            className="flex items-center justify-center gap-2 w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 text-sm transition-all shadow-lg shadow-blue-500/20"
          >
            <LogIn className="h-4 w-4" /> Sign In as Admin
          </button>
          <Link
            to="/"
            className="flex items-center justify-center gap-2 w-full rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 hover:text-white font-semibold py-3 text-sm transition-all"
          >
            <Home className="h-4 w-4" /> Back to Home
          </Link>
        </div>

        <p className="text-xs text-slate-600 mt-6">
          © {new Date().getFullYear()} Valarmathi Computers
        </p>
      </div>
    </div>
  );
}

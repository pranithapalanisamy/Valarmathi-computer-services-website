import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { ref, set, get, serverTimestamp } from "firebase/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Monitor, ShieldCheck, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  const validate = () => {
    const e: Record<string, string> = {};
    if (!email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email address";
    if (!password) e.password = "Password is required";
    else if (password.length < 6) e.password = "Password must be at least 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if user has admin role in database
      const userRef = ref(db, `users/${user.uid}`);
      const userSnap = await get(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.val();
        if (userData.role === "admin") {
          toast.success("Welcome back, Admin!");
          navigate("/admin");
        } else {
          toast.error("You do not have admin privileges.");
          await auth.signOut();
        }
      } else {
        // Create user entry with admin role (first-time admin setup)
        await set(userRef, {
          email: user.email,
          displayName: user.displayName || email.split("@")[0],
          role: "admin",
          createdAt: serverTimestamp(),
        });
        toast.success("Admin account created! Welcome!");
        navigate("/admin");
      }
    } catch (error: any) {
      if (error.code === "auth/user-not-found" || error.code === "auth/invalid-credential") {
        // Auto-create new admin account
        try {
          const newUser = await createUserWithEmailAndPassword(auth, email, password);
          const userRef = ref(db, `users/${newUser.user.uid}`);
          await set(userRef, {
            email: newUser.user.email,
            displayName: email.split("@")[0],
            role: "admin",
            createdAt: serverTimestamp(),
          });
          toast.success("Admin account created! Welcome!");
          navigate("/admin");
        } catch (createError: any) {
          toast.error(createError.message || "Failed to create admin account.");
        }
      } else if (error.code === "auth/wrong-password") {
        toast.error("Invalid password. Please try again.");
      } else {
        toast.error(error.message || "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Forgot password ──────────────────────────────────────────────────
  const handleForgotPassword = async () => {
    if (!email.trim()) { 
      toast.error("Please enter your email address first"); 
      return; 
    }
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent! Check your inbox.");
    } catch {
      toast.error("Failed to send reset email. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Back to site link */}
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-8 group">
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Website
        </Link>

        {/* Login card */}
        <div className="rounded-2xl border border-slate-700/50 bg-slate-800/80 backdrop-blur-xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl hero-gradient mb-4 shadow-lg shadow-primary/25">
              <ShieldCheck className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Admin Login</h1>
            <p className="text-sm text-slate-400 mt-1">Valarmathi Computers — Admin Panel</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Error Display */}
            {errors.email && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg">
                {errors.email}
              </div>
            )}
            {errors.password && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg">
                {errors.password}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Email Address</label>
              <Input
                type="email"
                placeholder="admin@valarmathicomputers.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-primary focus:ring-primary h-11"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-primary focus:ring-primary h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Password Requirements */}
            {password && (
              <div className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-3 text-xs">
                <p className="text-slate-400 font-medium mb-2">Password must contain:</p>
                <div className="grid grid-cols-1 gap-1">
                  <div className={`flex items-center gap-1 ${password.length >= 6 ? "text-green-400" : "text-slate-500"}`}>
                    <div className={`h-1.5 w-1.5 rounded-full ${password.length >= 6 ? "bg-green-400" : "bg-slate-600"}`} />
                    <span>6+ characters</span>
                  </div>
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-11 text-base font-semibold hero-gradient hover:opacity-90 transition-opacity"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign In as Admin"
              )}
            </Button>
          </form>

          {/* Forgot password */}
          <div className="text-right mt-4">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-xs font-semibold text-slate-400 hover:text-slate-300 transition-colors"
            >
              Forgot Password?
            </button>
          </div>

          {/* Footer note */}
          <p className="text-xs text-slate-500 text-center mt-6">
            Authorized personnel only. If you don't have credentials, a new admin account will be created automatically.
          </p>
        </div>

        {/* Bottom branding */}
        <div className="flex items-center justify-center gap-2 mt-6 text-slate-500">
          <div className="flex h-6 w-6 items-center justify-center rounded-md hero-gradient">
            <Monitor className="h-3 w-3 text-primary-foreground" />
          </div>
          <span className="text-xs font-medium">Valarmathi Computers &copy; {new Date().getFullYear()}</span>
        </div>
      </div>
    </div>
  );
}

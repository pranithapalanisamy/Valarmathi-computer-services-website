import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import { ref, set, get, serverTimestamp } from "firebase/database";
import { auth, db, signInWithGoogle } from "@/lib/firebase";
import { Eye, EyeOff, ArrowLeft, Mail, Lock, User, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

// ─── Google icon SVG ─────────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

// ─── Input field with icon ────────────────────────────────────────────────────
interface FieldProps {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  icon: React.ElementType;
  suffix?: React.ReactNode;
}
function Field({ id, label, type, placeholder, value, onChange, error, icon: Icon, suffix }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-semibold text-foreground">{label}</label>
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
          <Icon className="h-4 w-4" />
        </div>
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full rounded-xl border pl-10 pr-${suffix ? "10" : "4"} py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all duration-200
            ${error
              ? "border-destructive bg-destructive/5 focus:border-destructive focus:ring-2 focus:ring-destructive/20"
              : "border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 hover:border-muted-foreground/40"
            }`}
        />
        {suffix && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{suffix}</div>
        )}
      </div>
      {error && (
        <p className="flex items-center gap-1 text-xs text-destructive font-medium">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {error}
        </p>
      )}
    </div>
  );
}

// ─── Password rule indicator ──────────────────────────────────────────────────
function PasswordStrength({ password }: { password: string }) {
  const rules = [
    { label: "6+ characters", ok: password.length >= 6 },
  ];
  if (!password) return null;
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
      {rules.map((r) => (
        <span key={r.label} className={`flex items-center gap-1 text-xs font-medium ${r.ok ? "text-primary" : "text-muted-foreground"}`}>
          <CheckCircle2 className={`h-3 w-3 ${r.ok ? "text-primary" : "text-muted-foreground/40"}`} />
          {r.label}
        </span>
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function UserAuth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isSignUp = mode === "signup";

  const switchMode = (m: "signin" | "signup") => {
    setMode(m);
    setErrors({});
    setName(""); setEmail(""); setPassword(""); setConfirmPassword("");
  };

  // ── Validation ──────────────────────────────────────────────────────────────
  const validate = () => {
    const e: Record<string, string> = {};
    if (isSignUp && !name.trim()) e.name = "Full name is required";
    if (!email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email address";
    if (!password) e.password = "Password is required";
    else if (password.length < 6) e.password = "Password must be at least 6 characters";
    if (isSignUp && password !== confirmPassword) e.confirmPassword = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Save user to Firebase DB ─────────────────────────────────────────────────
  const saveUserToDB = async (uid: string, displayName: string, emailAddr: string, role = "customer") => {
    const userRef = ref(db, `users/${uid}`);
    const snap = await get(userRef);
    if (!snap.exists()) {
      await set(userRef, { displayName, email: emailAddr, role, createdAt: serverTimestamp() });
    }
  };

  // ── Google Sign-In ──────────────────────────────────────────────────────────
  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      const gUser = await signInWithGoogle();
      if (gUser) {
        await saveUserToDB(gUser.uid, gUser.displayName || "User", gUser.email || "");
        toast.success(`Welcome, ${gUser.displayName || "User"}! 🎉`);
        navigate("/");
      }
    } catch (err: any) {
      toast.error(err.message || "Google sign-in failed.");
    } finally {
      setGoogleLoading(false);
    }
  };

  // ── Email submit ─────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      if (isSignUp) {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(cred.user, { displayName: name.trim() });
        await saveUserToDB(cred.user.uid, name.trim(), email);
        toast.success("Account created successfully! Welcome 🎉");
        navigate("/");
      } else {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        await saveUserToDB(cred.user.uid, cred.user.displayName || email.split("@")[0], email);
        toast.success(`Welcome back, ${cred.user.displayName || "User"}!`);
        navigate("/");
      }
    } catch (err: any) {
      const code = err.code;
      if (code === "auth/email-already-in-use") setErrors({ email: "An account with this email already exists" });
      else if (code === "auth/user-not-found" || code === "auth/invalid-credential") setErrors({ email: "No account found with this email" });
      else if (code === "auth/wrong-password") setErrors({ password: "Incorrect password" });
      else toast.error(err.message || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Forgot password ──────────────────────────────────────────────────────────
  const handleForgotPassword = async () => {
    if (!email.trim()) { 
      setErrors({ email: "Please enter your email address above to reset password" }); 
      return; 
    }
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent! Check your inbox (including spam folder).");
    } catch (error: any) {
      console.error("Password reset error:", error);
      if (error.code === "auth/user-not-found") {
        setErrors({ email: "No account found with this email address" });
      } else if (error.code === "auth/invalid-email") {
        setErrors({ email: "Invalid email address format" });
      } else if (error.code === "auth/too-many-requests") {
        setErrors({ email: "Too many reset attempts. Try again later." });
      } else {
        toast.error(error.message || "Failed to send reset email. Please try again.");
      }
    }
  };

  const eyeToggle = (show: boolean, setShow: (v: boolean) => void) => (
    <button type="button" onClick={() => setShow(!show)} className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none">
      {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </button>
  );

  return (
    <div className="min-h-screen flex bg-secondary/30 relative overflow-hidden">
      {/* ── Left panel (desktop only) ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-foreground flex-col items-center justify-center p-12 relative overflow-hidden">
        {/* Decorative blobs — brand red tones */}
        <div className="absolute -top-32 -left-32 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-1/3 right-0 h-64 w-64 rounded-full bg-primary/5 blur-2xl" />

        <div className="relative text-center max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img src="/vc-logo.png" alt="Valarmathi Computers Logo" className="h-24 w-24 object-contain drop-shadow-2xl" />
          </div>
          <h1 className="text-3xl font-extrabold text-primary-foreground tracking-tight mb-3">VALARMATHI<br />COMPUTERS</h1>
          <p className="text-primary-foreground/60 text-sm leading-relaxed mb-10">
            Your trusted partner for professional computer repair, hardware upgrades, and complete IT support services.
          </p>

          {/* Feature list */}
          <div className="space-y-3 text-left">
            {[
              { emoji: "⚡", text: "Same-day repair service" },
              { emoji: "🔒", text: "Secure data recovery" },
              { emoji: "🛡️", text: "90-day repair warranty" },
              { emoji: "📞", text: "24/7 customer support" },
            ].map((f) => (
              <div key={f.text} className="flex items-center gap-3 bg-primary-foreground/5 rounded-xl px-4 py-3 backdrop-blur-sm border border-primary-foreground/10">
                <span className="text-lg">{f.emoji}</span>
                <span className="text-sm font-medium text-primary-foreground/80">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="absolute bottom-6 text-xs text-primary-foreground/30">
          © {new Date().getFullYear()} Valarmathi Computers. All rights reserved.
        </p>
      </div>

      {/* ── Right panel – Auth card ── */}
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Back link */}
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 group">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Website
          </Link>

          {/* Card */}
          <div className="bg-background rounded-3xl shadow-xl shadow-foreground/5 border border-border overflow-hidden">

            {/* Card header */}
            <div className="px-8 pt-8 pb-6 border-b border-border">
              {/* Mobile logo */}
              <div className="flex items-center gap-3 mb-6 lg:hidden">
                <img src="/vc-logo.png" alt="VC Logo" className="h-10 w-10 object-contain" />
                <div>
                  <p className="text-sm font-extrabold text-foreground leading-none tracking-tight">VALARMATHI</p>
                  <p className="text-[10px] font-semibold text-primary uppercase tracking-widest mt-0.5">COMPUTERS</p>
                </div>
              </div>

              <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
                {isSignUp ? "Create Account" : "Welcome Back"}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {isSignUp
                  ? "Sign up to book services and track your repairs"
                  : "Sign in to manage your bookings and profile"}
              </p>
            </div>

            <div className="px-8 pt-6 pb-8 space-y-5">
              {/* Mode toggle tabs */}
              <div className="flex bg-secondary rounded-xl p-1 gap-1">
                {(["signin", "signup"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => switchMode(m)}
                    className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                      mode === m
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {m === "signin" ? "Sign In" : "Sign Up"}
                  </button>
                ))}
              </div>

              {/* Google button */}
              <button
                type="button"
                onClick={handleGoogle}
                disabled={googleLoading}
                className="w-full flex items-center justify-center gap-3 rounded-xl border border-border bg-background py-3 text-sm font-semibold text-foreground hover:bg-secondary hover:border-muted-foreground/30 transition-all duration-200 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                {googleLoading ? (
                  <svg className="h-5 w-5 animate-spin text-muted-foreground" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <GoogleIcon />
                )}
                {googleLoading ? "Connecting..." : `Continue with Google`}
              </button>

              {/* Divider */}
              <div className="relative flex items-center gap-3">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">or</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {isSignUp && (
                  <Field
                    id="name"
                    label="Full Name"
                    type="text"
                    placeholder="e.g. Ravi Kumar"
                    value={name}
                    onChange={setName}
                    error={errors.name}
                    icon={User}
                  />
                )}

                <Field
                  id="email"
                  label="Email Address"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(v) => { setEmail(v); setErrors({ ...errors, email: "" }); }}
                  error={errors.email}
                  icon={Mail}
                />

                <div>
                  <Field
                    id="password"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    placeholder={isSignUp ? "Create a strong password" : "Enter your password"}
                    value={password}
                    onChange={(v) => { setPassword(v); setErrors({ ...errors, password: "" }); }}
                    error={errors.password}
                    icon={Lock}
                    suffix={eyeToggle(showPassword, setShowPassword)}
                  />
                  {isSignUp && <PasswordStrength password={password} />}
                </div>

                {isSignUp && (
                  <Field
                    id="confirmPassword"
                    label="Confirm Password"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(v) => { setConfirmPassword(v); setErrors({ ...errors, confirmPassword: "" }); }}
                    error={errors.confirmPassword}
                    icon={Lock}
                    suffix={eyeToggle(showConfirm, setShowConfirm)}
                  />
                )}

                {/* Forgot password */}
                {!isSignUp && (
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl hero-gradient text-primary-foreground font-bold py-3.5 text-sm transition-all duration-200 shadow-md shadow-primary/20 hover:opacity-90 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
                >
                  {loading ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      {isSignUp ? "Creating Account..." : "Signing In..."}
                    </>
                  ) : (
                    isSignUp ? "Create Account" : "Sign In"
                  )}
                </button>
              </form>

              {/* Toggle link */}
              <p className="text-center text-sm text-muted-foreground">
                {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => switchMode(isSignUp ? "signin" : "signup")}
                  className="font-bold text-primary hover:text-primary/80 underline underline-offset-2 transition-colors"
                >
                  {isSignUp ? "Sign In" : "Sign Up for free"}
                </button>
              </p>

              {/* Admin link */}
              <div className="border-t border-border pt-3 text-center">
                <Link
                  to="/admin-login"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  🔐 Admin? Go to Admin Login →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

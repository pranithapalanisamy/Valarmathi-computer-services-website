import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { AlertTriangle, ArrowLeft, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative z-10 text-center px-6">
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl hero-gradient shadow-lg shadow-primary/25">
          <AlertTriangle className="h-9 w-9 text-primary-foreground" />
        </div>

        {/* Code */}
        <p className="text-7xl font-extrabold text-gradient mb-2">404</p>
        <h1 className="text-2xl font-extrabold text-foreground mb-3 tracking-tight">Page Not Found</h1>
        <p className="text-muted-foreground mb-8 max-w-sm mx-auto leading-relaxed">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="btn-primary"
          >
            <Home className="h-4 w-4" /> Back to Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn-outline"
          >
            <ArrowLeft className="h-4 w-4" /> Go Back
          </button>
        </div>

        {/* Branding */}
        <p className="mt-12 text-xs text-muted-foreground">
          Valarmathi Computers — Service Management
        </p>
      </div>
    </div>
  );
};

export default NotFound;

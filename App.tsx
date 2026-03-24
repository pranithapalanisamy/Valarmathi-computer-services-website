import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminHome from "./pages/admin/AdminHome";
import AdminServices from "./pages/admin/AdminServices";
import AdminQuotes from "./pages/admin/AdminQuotes";
import AdminBrands from "./pages/admin/AdminBrands";
import AdminTestimonials from "./pages/admin/AdminTestimonials";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminTechnicians from "./pages/admin/AdminTechnicians";
import AdminSettings from "./pages/admin/AdminSettings";
import { AuthProvider } from "./contexts/AuthContext";
import AdminLogin from "./pages/AdminLogin";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminOrderManager from "./pages/admin/AdminOrderManager";
import UserAuth from "./pages/UserAuth";
import UserDashboard from "./pages/UserDashboard";
import { GuestRoute, UserRoute } from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route
              path="/dashboard"
              element={
                <UserRoute>
                  <UserDashboard />
                </UserRoute>
              }
            />
            <Route
              path="/login"
              element={
                <GuestRoute>
                  <UserAuth />
                </GuestRoute>
              }
            />
            <Route
              path="/admin-login"
              element={
                <GuestRoute adminOnly>
                  <AdminLogin />
                </GuestRoute>
              }
            />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminHome />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="services" element={<AdminServices />} />
              <Route path="quotes" element={<AdminQuotes />} />
              <Route path="quotes/new" element={<AdminQuotes />} />
              <Route path="brands" element={<AdminBrands />} />
              <Route path="testimonials" element={<AdminTestimonials />} />
              <Route path="messages" element={<AdminMessages />} />
              <Route path="technicians" element={<AdminTechnicians />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="users/new" element={<AdminUsers />} />
              <Route path="bookings" element={<AdminBookings />} />
              <Route path="bookings/new" element={<AdminBookings />} />
              <Route path="orders" element={<AdminOrderManager />} />
              <Route path="orders/new" element={<AdminOrderManager />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

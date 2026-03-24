import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/website/Navbar";
import HeroSection from "@/components/website/HeroSection";
import ServicesSection from "@/components/website/ServicesSection";
import BrandsSection from "@/components/website/BrandsSection";
import WhyUsSection from "@/components/website/WhyUsSection";
import AboutSection from "@/components/website/AboutSection";
import ContactSection from "@/components/website/ContactSection";
import GetQuoteSection from "@/components/website/GetQuoteSection";
import ReviewsSection from "@/components/website/ReviewsSection";
import BookingSection from "@/components/website/BookingSection";
import Footer from "@/components/website/Footer";
import LocationSection from "@/components/website/LocationSection";
import { AIChartBot } from "@/components/website/AIChartBot";

const Index = () => {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();

  // Only redirect admins to their dashboard; regular users stay on the main site
  useEffect(() => {
    if (loading) return;
    if (!user) return;
    if (role === "admin") {
      navigate("/admin", { replace: true });
    }
  }, [user, role, loading, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <BookingSection />
      <AboutSection />
      <WhyUsSection />
      <BrandsSection />
      <ReviewsSection />
      <GetQuoteSection />
      <ContactSection />
      <LocationSection />
      <Footer />
      {/* Floating AI Chart Bot */}
      <AIChartBot />
    </div>
  );
};

export default Index;

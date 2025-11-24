import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import SidebarLayout from "./components/ui/SidebarLayout";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";
import { runAllMigrations } from "./utils/migrateImageData";
import "./utils/resetData"; // Import untuk expose ke window
import { useDataValidation, useAutoSync } from "./hooks/useDataValidation";
import DataValidationAlert from "./components/DataValidationAlert";
import { autoFixAllData } from "./utils/dataValidation";
import Dashboard from "./pages/dashboard";
import CalendarScheduling from "./pages/calendar-scheduling";
import ClientManagement from "./pages/client-management";
import FinancialTracking from "./pages/financial-tracking";
import Login from "./pages/login";
import PaymentTracking from "./pages/payment-tracking";
import ServicePackages from "./pages/service-packages";
import Signup from "./pages/signup";
import NotFound from "./pages/NotFound";
import Leads from "./pages/leads";
import Settings from "./pages/settings";
import Profile from "./pages/profile";
import PublicLeadForm from "./pages/leads/PublicLeadForm";
import Booking from "./pages/booking";
import PublicBookingForm from "./pages/booking/PublicBookingForm";
import Gallery from "./pages/gallery";
import PublicGallery from "./pages/gallery/PublicGallery";
import Pricelist from "./pages/pricelist";
import PublicPricelist from "./pages/pricelist/PublicPricelist";
import ProjectManagement from "./pages/project-management";
import PublicPackages from "./pages/service-packages/PublicPackages";
import Team from "./pages/team";
import Promotions from "./pages/promotions";
import ClientKPI from "./pages/client-kpi";
import KPIManagement from "./pages/client-kpi/KPIManagement";
import PublicClient from "./pages/public-client";
import ClientPortal from "./pages/client-management/ClientPortal";
import Homepage from "./pages/homepage";
import Testimonials from "./pages/testimonials";
import PublicTestimonialForm from "./pages/testimonials/PublicTestimonialForm";
import PublicTestimonials from "./pages/testimonials/PublicTestimonials";

// Layout wrapper component for protected routes
const ProtectedLayout = () => {
  return (
    <ProtectedRoute>
      <SidebarLayout>
        <Outlet />
      </SidebarLayout>
    </ProtectedRoute>
  );
};

function App() {
    const { validationResults, isValidating, runValidation, hasIssues } = useDataValidation(false);
    const [showValidationAlert, setShowValidationAlert] = useState(false);
    
    useAutoSync();

    // Run data migrations on app load
    useEffect(() => {
        runAllMigrations();
    }, []);

    // Show validation alert if there are issues, hide when resolved
    useEffect(() => {
        if (hasIssues && !isValidating) {
            setShowValidationAlert(true);
        } else if (!hasIssues && !isValidating && validationResults) {
            setShowValidationAlert(false);
        }
    }, [hasIssues, isValidating, validationResults]);

    const handleRunFix = () => {
        runValidation(true);
    };

    const handleCloseAlert = () => {
        setShowValidationAlert(false);
        setTimeout(() => {
            runValidation(false);
        }, 2000);
    };

    return (
        <ErrorBoundary>
            <Router>
                <div className="min-h-screen bg-background text-foreground font-sans">
                    {showValidationAlert && validationResults && (
                        <DataValidationAlert
                            validationResults={validationResults}
                            onClose={handleCloseAlert}
                            onRunFix={handleRunFix}
                        />
                    )}
                    <Routes>
                    {/* Homepage */}
                    <Route path="/" element={<Homepage />} />
                    
                    {/* Public routes without sidebar */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/public-lead-form" element={<PublicLeadForm />} />
                    <Route path="/booking/public" element={<PublicBookingForm />} />
                    <Route path="/packages/public" element={<PublicPackages />} />
                    <Route path="/gallery/public/:publicId" element={<PublicGallery />} />
                    <Route path="/pricelist/public/:publicId" element={<PublicPricelist />} />
                    <Route path="/client/public/:publicId" element={<PublicClient />} />
                    <Route path="/portal-klien/:clientId" element={<ClientPortal />} />
                    <Route path="/testimonial/public" element={<PublicTestimonialForm />} />
                    <Route path="/testimonials/public" element={<PublicTestimonials />} />

                    {/* Protected routes with sidebar - nested under ProtectedLayout */}
                    <Route path="/app" element={<ProtectedLayout />}>
                        <Route index element={<Navigate to="/app/dashboard" replace />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="calendar-scheduling" element={<CalendarScheduling />} />
                        <Route path="client-management" element={<ClientManagement />} />
                        <Route path="financial-tracking" element={<FinancialTracking />} />
                        <Route path="leads" element={<Leads />} />
                        <Route path="payment-tracking" element={<PaymentTracking />} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="service-packages" element={<ServicePackages />} />
                        <Route path="settings" element={<Settings />} />
                        <Route path="booking" element={<Booking />} />
                        <Route path="gallery" element={<Gallery />} />
                        <Route path="pricelist" element={<Pricelist />} />
                        <Route path="project-management" element={<ProjectManagement />} />
                        <Route path="team" element={<Team />} />
                        <Route path="promotions" element={<Promotions />} />
                        <Route path="client-kpi" element={<ClientKPI />} />
                        <Route path="kpi-management" element={<KPIManagement />} />
                        <Route path="testimonials" element={<Testimonials />} />
                    </Route>

                    {/* 404 Not Found */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
        </Router>
        </ErrorBoundary>
    );
}

export default App;

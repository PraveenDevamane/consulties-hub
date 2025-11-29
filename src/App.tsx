import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/lib/auth";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import SelectRole from "./pages/SelectRole";
import About from "./pages/About";
import UserDashboard from "./pages/UserDashboard";
import PublisherDashboard from "./pages/PublisherDashboard";
import Categories from "./pages/Categories";
import Services from "./pages/Services";
import UserBookings from "./pages/UserBookings";
import AddBusiness from "./pages/AddBusiness";
import Advertisements from "./pages/Advertisements";
import PublisherFeedback from "./pages/PublisherFeedback";
import PublisherSettings from "./pages/PublisherSettings";
import PublisherUpgrade from "./pages/PublisherUpgrade";
import UserFeedback from "./pages/UserFeedback";
import RoleDebug from "./components/RoleDebug";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/home" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/select-role" element={<SelectRole />} />
            <Route path="/about" element={<About />} />
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/user/bookings" element={<UserBookings />} />
            <Route path="/user/categories" element={<Categories />} />
            <Route path="/publisher/dashboard" element={<PublisherDashboard />} />
            <Route path="/publisher/add-business" element={<AddBusiness />} />
            <Route path="/publisher/advertisements" element={<Advertisements />} />
            <Route path="/publisher/feedback" element={<PublisherFeedback />} />
            <Route path="/publisher/settings" element={<PublisherSettings />} />
            <Route path="/publisher/upgrade" element={<PublisherUpgrade />} />
            <Route path="/services" element={<Services />} />
            <Route path="/user/feedback" element={<UserFeedback />} />
            <Route path="/debug/role" element={<RoleDebug />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;


import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AppLayout from "@/components/layout/AppLayout";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Index from "./pages/Index";

// App Pages
import Dashboard from "./pages/Dashboard";
import Income from "./pages/Income";
import Projects from "./pages/Projects";
import Analytics from "./pages/Analytics";
import Forecasting from "./pages/Forecasting";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            {/* Root Route */}
            <Route path="/" element={<Index />} />
            
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* App Routes - Protected */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
              <Route path="/income" element={<AppLayout><Income /></AppLayout>} />
              <Route path="/projects" element={<AppLayout><Projects /></AppLayout>} />
              <Route path="/analytics" element={<AppLayout><Analytics /></AppLayout>} />
              <Route path="/forecasting" element={<AppLayout><Forecasting /></AppLayout>} />
              <Route path="/settings" element={<AppLayout><Settings /></AppLayout>} />
            </Route>

            {/* Not Found Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;

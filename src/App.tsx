
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

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
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* App Routes - Protected */}
            <Route element={<ProtectedRoute />}>
              <Route element={<SidebarProvider><Dashboard /></SidebarProvider>} path="/dashboard" />
              <Route element={<SidebarProvider><Income /></SidebarProvider>} path="/income" />
              <Route element={<SidebarProvider><Projects /></SidebarProvider>} path="/projects" />
              <Route element={<SidebarProvider><Analytics /></SidebarProvider>} path="/analytics" />
              <Route element={<SidebarProvider><Forecasting /></SidebarProvider>} path="/forecasting" />
              <Route element={<SidebarProvider><Settings /></SidebarProvider>} path="/settings" />
            </Route>

            {/* Default Routes */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

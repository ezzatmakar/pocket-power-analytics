
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

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
              <Route path="/dashboard" element={
                <SidebarProvider>
                  <Dashboard />
                </SidebarProvider>
              } />
              <Route path="/income" element={
                <SidebarProvider>
                  <Income />
                </SidebarProvider>
              } />
              <Route path="/projects" element={
                <SidebarProvider>
                  <Projects />
                </SidebarProvider>
              } />
              <Route path="/analytics" element={
                <SidebarProvider>
                  <Analytics />
                </SidebarProvider>
              } />
              <Route path="/forecasting" element={
                <SidebarProvider>
                  <Forecasting />
                </SidebarProvider>
              } />
              <Route path="/settings" element={
                <SidebarProvider>
                  <Settings />
                </SidebarProvider>
              } />
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

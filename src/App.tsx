
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import LeaderDashboard from "./pages/LeaderDashboard";
import AttendanceForm from "./pages/AttendanceForm";
import NotFound from "./pages/NotFound";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

// Create a client
const queryClient = new QueryClient();

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
    };

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    checkSession();

    // Cleanup
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Show nothing until we know the auth state
  if (isAuthenticated === null) {
    return null;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected routes */}
          <Route path="/admin" element={
            <AuthGuard>
              <AdminDashboard />
            </AuthGuard>
          } />
          <Route path="/dashboard" element={
            <AuthGuard>
              <LeaderDashboard />
            </AuthGuard>
          } />
          <Route path="/attendance/:sessionId" element={
            <AuthGuard>
              <AttendanceForm />
            </AuthGuard>
          } />
          <Route path="/attendance/new" element={
            <AuthGuard>
              <AttendanceForm />
            </AuthGuard>
          } />
          
          {/* Redirect to login by default */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

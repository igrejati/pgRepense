
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import LeaderDashboard from "./pages/LeaderDashboard";
import AttendanceForm from "./pages/AttendanceForm";
import NotFound from "./pages/NotFound";

// Create a client
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Use LeaderDashboard as the default landing page */}
          <Route path="/" element={<LeaderDashboard />} />
          
          {/* Direct access to all existing pages without auth */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/dashboard" element={<LeaderDashboard />} />
          <Route path="/attendance/:sessionId" element={<AttendanceForm />} />
          <Route path="/attendance/new" element={<AttendanceForm />} />
          
          {/* Redirect login route to dashboard */}
          <Route path="/login" element={<Navigate to="/dashboard" />} />
          
          {/* Redirect paths for removed pages */}
          <Route path="/courses" element={<Navigate to="/dashboard" />} />
          <Route path="/sessions" element={<Navigate to="/dashboard" />} />
          <Route path="/students" element={<Navigate to="/dashboard" />} />
          <Route path="/leaders" element={<Navigate to="/admin" />} />
          <Route path="/settings" element={<Navigate to="/dashboard" />} />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

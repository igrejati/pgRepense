
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
          
          {/* Direct access to all pages without auth */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/dashboard" element={<LeaderDashboard />} />
          <Route path="/attendance/:sessionId" element={<AttendanceForm />} />
          <Route path="/attendance/new" element={<AttendanceForm />} />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

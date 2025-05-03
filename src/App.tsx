
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import LeaderDashboard from "./pages/LeaderDashboard";
import AttendanceForm from "./pages/AttendanceForm";

// Create a client
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Direct access to all pages without authentication */}
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/dashboard" element={<LeaderDashboard />} />
          <Route path="/attendance/:sessionId" element={<AttendanceForm />} />
          <Route path="/attendance/new" element={<AttendanceForm />} />
          <Route path="/courses" element={<Navigate to="/admin" />} />
          <Route path="/sessions" element={<Navigate to="/admin" />} />
          <Route path="/students" element={<Navigate to="/admin" />} />
          <Route path="/leaders" element={<Navigate to="/admin" />} />
          <Route path="/settings" element={<Navigate to="/admin" />} />
          
          {/* Redirect any other paths to the admin dashboard */}
          <Route path="*" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

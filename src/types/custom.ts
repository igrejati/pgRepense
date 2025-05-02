
// Custom application types that are not directly from the Supabase schema

import { Database } from "@/integrations/supabase/types";

// Re-export useful types from the Supabase schema
export type Leader = Database["public"]["Tables"]["leaders"]["Row"];
export type Course = Database["public"]["Tables"]["courses"]["Row"];
export type CourseSession = Database["public"]["Tables"]["course_sessions"]["Row"];
export type Student = Database["public"]["Tables"]["students"]["Row"];
export type Attendance = Database["public"]["Tables"]["attendance"]["Row"];

// Add any custom types below
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "admin" | "leader";
  isActive: boolean;
}

export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

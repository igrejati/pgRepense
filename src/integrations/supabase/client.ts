// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://kpeymtbnvdubxmfuejmj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwZXltdGJudmR1YnhtZnVlam1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1MDkwNTAsImV4cCI6MjA2MTA4NTA1MH0.pw7_W24Q11AKJpg-saJ-l5kFjU1Jh2h-mLcvZ_v_MvY";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
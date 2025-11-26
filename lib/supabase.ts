import { createClient } from "@supabase/supabase-js";

// Types for our database tables
export interface Order {
  id: string;
  customer_email: string;
  total_quantity: number;
  stripe_session_id?: string;
  created_at: string;
}

export interface Stats {
  id: number;
  total_orders: number;
  total_customers: number;
  total_hats: number;
  updated_at: string;
}

// Create a Supabase client for server-side operations
// Uses the service role key for full access (webhooks, etc.)
export function createServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase environment variables");
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// Create a Supabase client for public/anon operations (reading stats)
export function createPublicClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables");
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

// Helper function to get stats for the homepage
export async function getStats(): Promise<Stats | null> {
  const supabase = createPublicClient();
  
  const { data, error } = await supabase
    .from("stats")
    .select("*")
    .eq("id", 1)
    .single();

  if (error) {
    console.error("Error fetching stats:", error);
    return null;
  }

  return data;
}




import { NextResponse } from "next/server";
import { getSiteStats } from "@/lib/supabase";

export const revalidate = 60; // Revalidate every 60 seconds

export async function GET() {
  try {
    const stats = await getSiteStats();

    if (!stats) {
      // Return default values if no stats found
      return NextResponse.json({
        total_hats_produced: 15624,
        total_orders: 976,
        total_customers: 301,
      });
    }

    return NextResponse.json({
      total_hats_produced: stats.total_hats_produced,
      total_orders: stats.total_orders,
      total_customers: stats.total_customers,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    // Return default values on error
    return NextResponse.json({
      total_hats_produced: 15624,
      total_orders: 976,
      total_customers: 301,
    });
  }
}


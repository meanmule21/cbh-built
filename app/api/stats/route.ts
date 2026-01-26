import { NextResponse } from "next/server";

export const revalidate = 60; // Revalidate every 60 seconds

export async function GET() {
  try {
    // TODO: Fetch stats from Drupal
    // For now, return default values
    return NextResponse.json({
      total_hats_produced: 15624,
      total_orders: 976,
      total_customers: 301,
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


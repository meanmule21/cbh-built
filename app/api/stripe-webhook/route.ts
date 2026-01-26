import { NextRequest, NextResponse } from "next/server";

// Placeholder route - Stripe removed, using Drupal instead
export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: "Webhook processing not yet implemented" },
    { status: 501 }
  );
}

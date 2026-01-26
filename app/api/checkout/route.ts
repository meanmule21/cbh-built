import { NextRequest, NextResponse } from "next/server";

// Placeholder route - Stripe removed, using Drupal instead
export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: "Payment processing not yet implemented. Please contact sales@meanmuleapparel.com" },
    { status: 501 }
  );
}

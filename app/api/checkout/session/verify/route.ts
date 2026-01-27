import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "customer"],
    });

    if (!session) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    // Format the response
    const orderDetails = {
      id: session.id,
      amount_total: session.amount_total || 0,
      currency: session.currency || "usd",
      customer_email: session.customer_email || (session.customer as Stripe.Customer)?.email || "",
      customer_name: (session.customer as Stripe.Customer)?.name || "",
      shipping_address: session.shipping_details?.address || null,
      shipping_name: session.shipping_details?.name || null,
      line_items: session.line_items?.data.map((item: any) => ({
        description: item.description,
        quantity: item.quantity,
        amount_total: item.amount_total,
      })) || [],
      metadata: session.metadata || {},
      payment_status: session.payment_status,
      created: session.created,
    };

    return NextResponse.json(orderDetails);
  } catch (error: any) {
    console.error("Stripe session verification error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to verify session" },
      { status: 500 }
    );
  }
}

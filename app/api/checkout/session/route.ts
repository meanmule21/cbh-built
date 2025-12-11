import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
});

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Missing session_id parameter" },
        { status: 400 }
      );
    }

    // Retrieve the checkout session with line items and customer details
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    });

    // Get line items with product details
    const lineItems = await stripe.checkout.sessions.listLineItems(sessionId);

    // Access shipping details (collected via shipping_address_collection)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const shippingDetails = (session as any).shipping_details;

    return NextResponse.json({
      id: session.id,
      amount_total: session.amount_total,
      currency: session.currency,
      customer_email: session.customer_details?.email,
      customer_name: session.customer_details?.name,
      shipping_address: shippingDetails?.address,
      shipping_name: shippingDetails?.name,
      line_items: lineItems.data.map((item) => ({
        description: item.description,
        quantity: item.quantity,
        amount_total: item.amount_total,
      })),
      metadata: session.metadata,
      payment_status: session.payment_status,
      created: session.created,
    });
  } catch (error) {
    console.error("Error retrieving session:", error);
    return NextResponse.json(
      { error: "Failed to retrieve session" },
      { status: 500 }
    );
  }
}

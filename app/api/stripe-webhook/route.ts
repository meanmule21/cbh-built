import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createServiceClient } from "@/lib/supabase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    console.error("No Stripe signature found");
    return NextResponse.json(
      { error: "No signature" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error(`Webhook signature verification failed: ${errorMessage}`);
    return NextResponse.json(
      { error: `Webhook Error: ${errorMessage}` },
      { status: 400 }
    );
  }

  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      await handleSuccessfulCheckout(session);
    } catch (error) {
      console.error("Error processing checkout:", error);
      return NextResponse.json(
        { error: "Error processing checkout" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}

async function handleSuccessfulCheckout(session: Stripe.Checkout.Session) {
  const supabase = createServiceClient();

  // Get customer email from the session
  const customerEmail = session.customer_details?.email;
  
  if (!customerEmail) {
    console.error("No customer email in session");
    throw new Error("No customer email found");
  }

  // Get the line items to calculate total quantity of hats
  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
    limit: 100,
  });

  // Calculate total quantity of hats in this order
  const totalQuantity = lineItems.data.reduce((sum, item) => {
    return sum + (item.quantity || 0);
  }, 0);

  // Check for idempotency - don't process the same session twice
  const { data: existingOrder } = await supabase
    .from("orders")
    .select("id")
    .eq("stripe_session_id", session.id)
    .single();

  if (existingOrder) {
    console.log(`Order already processed for session: ${session.id}`);
    return;
  }

  // Check if this customer has any previous orders
  const { data: previousOrders, error: lookupError } = await supabase
    .from("orders")
    .select("id")
    .eq("customer_email", customerEmail)
    .limit(1);

  if (lookupError) {
    console.error("Error checking for previous orders:", lookupError);
    throw lookupError;
  }

  const isNewCustomer = !previousOrders || previousOrders.length === 0;

  // Insert the new order
  const { error: insertError } = await supabase.from("orders").insert({
    customer_email: customerEmail,
    total_quantity: totalQuantity,
    stripe_session_id: session.id,
  });

  if (insertError) {
    console.error("Error inserting order:", insertError);
    throw insertError;
  }

  // Update the stats table
  // Increment total_orders by 1
  // Increment total_hats by totalQuantity
  // Increment total_customers by 1 only if new customer
  const { error: updateError } = await supabase.rpc("increment_stats", {
    order_quantity: totalQuantity,
    is_new_customer: isNewCustomer,
  });

  // If the RPC function doesn't exist, fall back to direct update
  if (updateError) {
    console.log("RPC not available, using direct update");
    
    // Get current stats
    const { data: currentStats } = await supabase
      .from("stats")
      .select("*")
      .eq("id", 1)
      .single();

    if (currentStats) {
      const { error: directUpdateError } = await supabase
        .from("stats")
        .update({
          total_orders: currentStats.total_orders + 1,
          total_hats: currentStats.total_hats + totalQuantity,
          total_customers: currentStats.total_customers + (isNewCustomer ? 1 : 0),
          updated_at: new Date().toISOString(),
        })
        .eq("id", 1);

      if (directUpdateError) {
        console.error("Error updating stats:", directUpdateError);
        throw directUpdateError;
      }
    }
  }

  console.log(`✅ Order processed: ${totalQuantity} hats for ${customerEmail} (new customer: ${isNewCustomer})`);
}




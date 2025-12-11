import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { processCompletedOrder, ProcessOrderParams } from "@/lib/supabase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Handle checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      // Get line items
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

      // Parse metadata
      const metadata = session.metadata || {};
      const embroideryType = (metadata.embroideryType as "standard" | "puff") || "standard";
      const frontLocation = metadata.frontLocation || "front-center";
      const extraLocations = metadata.extraLocations
        ? metadata.extraLocations.split(",").filter(Boolean)
        : [];
      const artworkFilename = metadata.artworkFileName !== "none" ? metadata.artworkFileName : undefined;

      // Build items array from line items
      const items = lineItems.data
        .filter((item) => !item.description?.includes("Setup") && !item.description?.includes("Embroidery") && !item.description?.includes("Locations"))
        .map((item) => ({
          id: item.id,
          name: item.description || "Custom Hat",
          model: extractModel(item.description || ""),
          color: extractColor(item.description || ""),
          quantity: item.quantity || 1,
          unitPrice: (item.amount_total || 0) / 100 / (item.quantity || 1),
        }));

      // Calculate totals from line items
      const hatSubtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
      const totalHats = items.reduce((sum, item) => sum + item.quantity, 0);

      // Find fees from line items
      let artworkFee = 0;
      let puffFee = 0;
      let extraLocationsFee = 0;

      for (const item of lineItems.data) {
        const desc = item.description || "";
        if (desc.includes("Artwork Setup")) {
          artworkFee = (item.amount_total || 0) / 100;
        } else if (desc.includes("3D Puff") || desc.includes("Puff Embroidery")) {
          puffFee = (item.amount_total || 0) / 100;
        } else if (desc.includes("Extra") && desc.includes("Location")) {
          extraLocationsFee = (item.amount_total || 0) / 100;
        }
      }

      // Get shipping details
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const shippingDetails = (session as any).shipping_details;

      // Process the order
      const orderParams: ProcessOrderParams = {
        stripeSessionId: session.id,
        stripePaymentIntent: session.payment_intent as string,
        email: session.customer_details?.email || "",
        customerName: session.customer_details?.name || undefined,
        items,
        embroideryType,
        frontLocation,
        extraLocations,
        artworkFilename,
        hatSubtotal,
        volumeDiscount: 0, // Could calculate from metadata if stored
        artworkFee,
        puffEmbroideryFee: puffFee,
        extraLocationsFee,
        totalAmount: (session.amount_total || 0) / 100,
        totalHats,
        shippingName: shippingDetails?.name || undefined,
        shippingAddress: shippingDetails?.address
          ? {
              line1: shippingDetails.address.line1 || "",
              line2: shippingDetails.address.line2 || undefined,
              city: shippingDetails.address.city || "",
              state: shippingDetails.address.state || "",
              postal_code: shippingDetails.address.postal_code || "",
              country: shippingDetails.address.country || "US",
            }
          : undefined,
      };

      const { order, customer } = await processCompletedOrder(orderParams);

      if (order) {
        console.log(`Order ${order.order_number} created for ${customer?.email}`);
      } else {
        console.error("Failed to process order for session:", session.id);
      }
    } catch (error) {
      console.error("Error processing checkout session:", error);
      // Don't return error - Stripe will retry
    }
  }

  return NextResponse.json({ received: true });
}

// Helper functions to extract model and color from description
function extractModel(description: string): string {
  // Try to extract model like "Richardson 112" or "Yupoong 6606"
  const modelMatch = description.match(/(Richardson|Yupoong)\s+\d+\w*/i);
  if (modelMatch) {
    return modelMatch[0];
  }
  // Fallback - take first part before dash
  const parts = description.split(" - ");
  return parts[0] || "Unknown";
}

function extractColor(description: string): string {
  // Take part after dash
  const parts = description.split(" - ");
  return parts[1] || "Unknown";
}


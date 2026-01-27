import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      cartItems,
      embroideryOptions,
      customerInfo,
      orderTotal,
      artworkFileName,
      specialInstructions,
    } = body;

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    if (!orderTotal || orderTotal <= 0) {
      return NextResponse.json(
        { error: "Invalid order total" },
        { status: 400 }
      );
    }

    // Build line items for Stripe
    const lineItems = cartItems.map((item: any) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          description: `Quantity: ${item.quantity}`,
        },
        unit_amount: Math.round((item.unitPrice - (item.discountPerHat || 0)) * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    // Add embroidery options as line items if applicable
    if (embroideryOptions?.type === "puff") {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "3D Puff Embroidery",
            description: `3D Puff embroidery for ${cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0)} hat(s)`,
          },
          unit_amount: Math.round((embroideryOptions.puffTotal || 0) * 100),
        },
        quantity: 1,
      });
    }

    if (embroideryOptions?.extraLocations?.length > 0) {
      const extraLocationCount = embroideryOptions.extraLocations.length;
      const totalHats = cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0);
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "Extra Embroidery Locations",
            description: `${extraLocationCount} extra location(s) × ${totalHats} hat(s)`,
          },
          unit_amount: Math.round((embroideryOptions.extraTotal || 0) * 100),
        },
        quantity: 1,
      });
    }

    if (embroideryOptions?.artworkSetupFee > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "Artwork Setup Fee",
            description: "One-time artwork setup and digitization fee",
          },
          unit_amount: Math.round(embroideryOptions.artworkSetupFee * 100),
        },
        quantity: 1,
      });
    }

    // Calculate total from line items to verify
    const calculatedTotal = lineItems.reduce((sum, item) => {
      return sum + (item.price_data.unit_amount * (item.quantity || 1));
    }, 0);
    const expectedTotal = Math.round(orderTotal * 100);

    // Verify totals match (allow small rounding differences)
    if (Math.abs(calculatedTotal - expectedTotal) > 1) {
      console.warn(`Total mismatch: calculated ${calculatedTotal}, expected ${expectedTotal}`);
      // Use a single line item with the verified total if there's a mismatch
      return NextResponse.json(
        { error: "Order total calculation mismatch. Please refresh and try again." },
        { status: 400 }
      );
    }

    // Get the base URL
    const origin = request.headers.get("origin") || 
                   process.env.NEXT_PUBLIC_BASE_URL || 
                   "http://localhost:3000";

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${origin}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/order/checkout?canceled=true`,
      customer_email: customerInfo?.email || undefined,
      metadata: {
        artworkFileName: artworkFileName || "",
        embroideryType: embroideryOptions?.type || "standard",
        frontLocation: embroideryOptions?.frontLocation || "front-center",
        extraLocations: JSON.stringify(embroideryOptions?.extraLocations || []),
        specialInstructions: specialInstructions || "",
        customerEmail: customerInfo?.email || "",
        rewardTier: customerInfo?.reward_tier || "",
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error: any) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}

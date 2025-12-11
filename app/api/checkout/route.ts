import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
});

interface CartItem {
  id: string;
  name: string;
  unitPrice: number;
  quantity: number;
}

interface CheckoutRequest {
  cartItems: CartItem[];
  embroideryOptions: {
    type: "standard" | "puff";
    frontLocation: string;
    extraLocations: string[];
  };
  totals: {
    hatSubtotal: number;
    volumeDiscount: number;
    discountedHatSubtotal: number;
    extraEmbroideryTotal: number;
    puffEmbroideryTotal: number;
    artworkSetupFee: number;
    orderTotal: number;
    discountPerHat: number;
  };
  artworkFileName: string | null;
}

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutRequest = await request.json();
    const { cartItems, embroideryOptions, totals, artworkFileName } = body;

    // Determine the base URL from the request (works in all environments)
    const protocol = request.headers.get("x-forwarded-proto") || "https";
    const host = request.headers.get("host") || "localhost:3000";
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`;

    // Build line items for Stripe
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    // Add each hat as a line item (with discount applied)
    for (const item of cartItems) {
      const discountedPrice = item.unitPrice - totals.discountPerHat;
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            description: `Custom embroidered hat`,
          },
          unit_amount: Math.round(discountedPrice * 100), // Stripe uses cents
        },
        quantity: item.quantity,
      });
    }

    // Add artwork setup fee if applicable
    if (totals.artworkSetupFee > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "Artwork Setup Fee",
            description: "One-time setup for your custom embroidery design",
          },
          unit_amount: Math.round(totals.artworkSetupFee * 100),
        },
        quantity: 1,
      });
    }

    // Add 3D puff embroidery charge if applicable
    if (totals.puffEmbroideryTotal > 0) {
      const totalHats = cartItems.reduce((sum, item) => sum + item.quantity, 0);
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "3D Puff Embroidery Upgrade",
            description: "Premium 3D puff embroidery on front logo",
          },
          unit_amount: Math.round((totals.puffEmbroideryTotal / totalHats) * 100),
        },
        quantity: totalHats,
      });
    }

    // Add extra embroidery locations if applicable
    if (totals.extraEmbroideryTotal > 0) {
      const totalHats = cartItems.reduce((sum, item) => sum + item.quantity, 0);
      const extraLocations = embroideryOptions.extraLocations.length;
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: `Extra Embroidery Locations (${extraLocations})`,
            description: embroideryOptions.extraLocations.join(", "),
          },
          unit_amount: Math.round((totals.extraEmbroideryTotal / totalHats) * 100),
        },
        quantity: totalHats,
      });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${baseUrl}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/order/checkout`,
      shipping_address_collection: {
        allowed_countries: ["US"],
      },
      metadata: {
        embroideryType: embroideryOptions.type,
        frontLocation: embroideryOptions.frontLocation,
        extraLocations: embroideryOptions.extraLocations.join(","),
        artworkFileName: artworkFileName || "none",
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}


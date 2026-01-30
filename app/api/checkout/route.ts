import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cartItems, embroideryOptions, customerInfo, totals, artworkFileName, specialInstructions } = body;

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Create line items for Stripe
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = cartItems.map((item: any) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          description: `Custom embroidered hat - ${item.quantity} units`,
        },
        unit_amount: Math.round((item.unitPrice - (totals.discountPerHat || 0)) * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    // Add 3D Puff embroidery if applicable
    if (totals.puffEmbroideryTotal > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "3D Puff Embroidery",
            description: `Premium 3D puff embroidery for ${totals.totalHats} hats`,
          },
          unit_amount: Math.round(totals.puffEmbroideryTotal * 100),
        },
        quantity: 1,
      });
    }

    // Add extra embroidery locations if applicable
    if (totals.extraEmbroideryTotal > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "Extra Embroidery Locations",
            description: `${embroideryOptions.extraLocations.length} additional location(s)`,
          },
          unit_amount: Math.round(totals.extraEmbroideryTotal * 100),
        },
        quantity: 1,
      });
    }

    // Add artwork setup fee if not waived
    if (totals.artworkSetupFee > 0 && !totals.artworkSetupWaived) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "Artwork Setup Fee",
            description: "One-time artwork digitization and setup",
          },
          unit_amount: Math.round(totals.artworkSetupFee * 100),
        },
        quantity: 1,
      });
    }

    // Apply rewards discount if applicable
    const discounts: Stripe.Checkout.SessionCreateParams.Discount[] = [];
    if (totals.rewardsDiscount > 0) {
      // Create a coupon for the rewards discount
      const coupon = await stripe.coupons.create({
        amount_off: Math.round(totals.rewardsDiscount * 100),
        currency: "usd",
        duration: "once",
        name: `Rewards Cash (${totals.rewardsDiscountPercent}%)`,
      });
      discounts.push({ coupon: coupon.id });
    }

    // Get the base URL for redirects
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                    request.headers.get("origin") || 
                    "http://localhost:3000";

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      discounts: discounts.length > 0 ? discounts : undefined,
      mode: "payment",
      success_url: `${baseUrl}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/order/checkout`,
      customer_email: customerInfo.email,
      metadata: {
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone || "",
        shippingAddress: customerInfo.shippingAddress || "",
        embroideryType: embroideryOptions.type,
        frontLocation: embroideryOptions.frontLocation,
        extraLocations: embroideryOptions.extraLocations.join(", "),
        artworkFileName: artworkFileName || "",
        specialInstructions: specialInstructions || "",
        totalHats: totals.totalHats?.toString() || "0",
      },
      shipping_address_collection: {
        allowed_countries: ["US"],
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}

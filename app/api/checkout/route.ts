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

    const totalHats = cartItems.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0);

    // Stripe minimum is 50 cents per line item (USD)
    const toCents = (d: number) => Math.max(50, Math.round(d * 100));

    // Create line items for Stripe
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = cartItems.map((item: any) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          description: `Custom embroidered hat - ${item.quantity} units`,
        },
        unit_amount: toCents((item.unitPrice || 0) - (totals?.discountPerHat || 0)),
      },
      quantity: item.quantity,
    }));

    // Add 3D Puff embroidery if applicable
    if (totals?.puffEmbroideryTotal > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "3D Puff Embroidery",
            description: `Premium 3D puff embroidery for ${totalHats} hats`,
          },
          unit_amount: toCents(totals.puffEmbroideryTotal),
        },
        quantity: 1,
      });
    }

    // Add extra embroidery locations if applicable
    if (totals?.extraEmbroideryTotal > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "Extra Embroidery Locations",
            description: `${(embroideryOptions?.extraLocations || []).length} additional location(s)`,
          },
          unit_amount: toCents(totals.extraEmbroideryTotal),
        },
        quantity: 1,
      });
    }

    // Add artwork setup fee if not waived
    if (totals?.artworkSetupFee > 0 && !totals?.artworkSetupWaived) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "Artwork Setup Fee",
            description: "One-time artwork digitization and setup",
          },
          unit_amount: toCents(totals.artworkSetupFee),
        },
        quantity: 1,
      });
    }

    // Apply rewards discount if applicable
    const discounts: Stripe.Checkout.SessionCreateParams.Discount[] = [];
    if (totals?.rewardsDiscount > 0) {
      try {
        const coupon = await stripe.coupons.create({
          amount_off: Math.round(totals.rewardsDiscount * 100),
          currency: "usd",
          duration: "once",
          name: `Rewards Cash (${totals.rewardsDiscountPercent ?? 0}%)`,
        });
        discounts.push({ coupon: coupon.id });
      } catch (e) {
        console.warn("Could not create rewards coupon, continuing without:", e);
      }
    }

    // Get the base URL for redirects
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                    request.headers.get("origin") || 
                    "http://localhost:3000";

    // customer_email optional (guest checkout when customerInfo is null)
    const customerEmail = customerInfo?.email?.trim() || undefined;

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      discounts: discounts.length > 0 ? discounts : undefined,
      mode: "payment",
      success_url: `${baseUrl}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/order/checkout`,
      ...(customerEmail ? { customer_email: customerEmail } : {}),
      metadata: {
        customerName: (customerInfo as any)?.name ?? "",
        customerEmail: customerEmail ?? "",
        customerPhone: (customerInfo as any)?.phone ?? "",
        shippingAddress: (customerInfo as any)?.shippingAddress ?? "",
        embroideryType: embroideryOptions?.type ?? "standard",
        frontLocation: embroideryOptions?.frontLocation ?? "front-center",
        extraLocations: (embroideryOptions?.extraLocations || []).join(", "),
        artworkFileName: artworkFileName || "",
        specialInstructions: specialInstructions || "",
        totalHats: String(totalHats),
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

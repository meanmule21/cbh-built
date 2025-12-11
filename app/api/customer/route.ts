import { NextRequest, NextResponse } from "next/server";
import { getCustomerByEmail, getCustomerOrders, getCustomerLogos } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  try {
    const customer = await getCustomerByEmail(email);

    if (!customer) {
      return NextResponse.json({ customer: null, orders: [], logos: [] });
    }

    const [orders, logos] = await Promise.all([
      getCustomerOrders(email),
      getCustomerLogos(email),
    ]);

    return NextResponse.json({
      customer: {
        id: customer.id,
        email: customer.email,
        name: customer.name,
        total_lifetime_spend: customer.total_lifetime_spend,
        total_hats_ordered: customer.total_hats_ordered,
        reward_tier: customer.reward_tier,
        has_setup_fee_paid: customer.has_setup_fee_paid,
      },
      orders: orders.map((order) => ({
        id: order.id,
        order_number: order.order_number,
        total_amount: order.total_amount,
        total_hats: order.total_hats,
        status: order.status,
        created_at: order.created_at,
        items: order.items,
      })),
      logos: logos.map((logo) => ({
        id: logo.id,
        filename: logo.filename,
        public_url: logo.public_url,
        created_at: logo.created_at,
      })),
    });
  } catch (error) {
    console.error("Error fetching customer:", error);
    return NextResponse.json({ error: "Failed to fetch customer" }, { status: 500 });
  }
}


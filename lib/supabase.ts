import { createClient, SupabaseClient } from "@supabase/supabase-js";
import {
  Customer,
  CustomerInsert,
  Order,
  OrderInsert,
  OrderItem,
  Logo,
  LogoInsert,
  HatSaleInsert,
  RevenueInsert,
  SiteStats,
  calculateRewardTier,
} from "./database.types";

// =====================================================
// SUPABASE CLIENTS
// =====================================================

// Service client for server-side operations (full access)
let serviceClient: SupabaseClient | null = null;

export function getServiceClient(): SupabaseClient {
  if (!serviceClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase environment variables");
    }

    serviceClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
  return serviceClient;
}

// Public client for client-side operations (anon access)
let publicClient: SupabaseClient | null = null;

export function getPublicClient(): SupabaseClient {
  if (!publicClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Missing Supabase environment variables");
    }

    publicClient = createClient(supabaseUrl, supabaseAnonKey);
  }
  return publicClient;
}

// =====================================================
// SITE STATS (PUBLIC)
// =====================================================

export async function getSiteStats(): Promise<SiteStats | null> {
  const supabase = getPublicClient();

  const { data, error } = await supabase
    .from("site_stats")
    .select("*")
    .eq("id", 1)
    .single();

  if (error) {
    console.error("Error fetching site stats:", error);
    return null;
  }

  return data as SiteStats;
}

// =====================================================
// CUSTOMERS
// =====================================================

export async function getCustomerByEmail(email: string): Promise<Customer | null> {
  const supabase = getServiceClient();

  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("email", email.toLowerCase())
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching customer:", error);
  }

  return data as Customer | null;
}

export async function createCustomer(customer: CustomerInsert): Promise<Customer | null> {
  const supabase = getServiceClient();

  const { data, error } = await supabase
    .from("customers")
    .insert({
      ...customer,
      email: customer.email.toLowerCase(),
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating customer:", error);
    return null;
  }

  return data as Customer;
}

export async function getOrCreateCustomer(
  email: string,
  name?: string,
  phone?: string
): Promise<Customer | null> {
  // Try to get existing customer
  let customer = await getCustomerByEmail(email);

  // Create if doesn't exist
  if (!customer) {
    customer = await createCustomer({
      email: email.toLowerCase(),
      name: name || null,
      phone: phone || null,
    });
  }

  return customer;
}

export async function updateCustomerAfterOrder(
  customerId: string,
  orderTotal: number,
  hatCount: number
): Promise<Customer | null> {
  const supabase = getServiceClient();

  // Get current customer data
  const { data: current, error: fetchError } = await supabase
    .from("customers")
    .select("total_lifetime_spend, total_hats_ordered")
    .eq("id", customerId)
    .single();

  if (fetchError) {
    console.error("Error fetching customer for update:", fetchError);
    return null;
  }

  const newLifetimeSpend = (current.total_lifetime_spend || 0) + orderTotal;
  const newTotalHats = (current.total_hats_ordered || 0) + hatCount;
  const newTier = calculateRewardTier(newLifetimeSpend);

  const { data, error } = await supabase
    .from("customers")
    .update({
      total_lifetime_spend: newLifetimeSpend,
      total_hats_ordered: newTotalHats,
      reward_tier: newTier,
      has_setup_fee_paid: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", customerId)
    .select()
    .single();

  if (error) {
    console.error("Error updating customer:", error);
    return null;
  }

  return data as Customer;
}

// =====================================================
// ORDERS
// =====================================================

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `CBH-${timestamp}-${random}`;
}

export async function createOrder(order: OrderInsert): Promise<Order | null> {
  const supabase = getServiceClient();

  const { data, error } = await supabase
    .from("orders")
    .insert(order)
    .select()
    .single();

  if (error) {
    console.error("Error creating order:", error);
    return null;
  }

  return data as Order;
}

export async function getOrderByStripeSession(sessionId: string): Promise<Order | null> {
  const supabase = getServiceClient();

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("stripe_session_id", sessionId)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching order:", error);
  }

  return data as Order | null;
}

export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  const supabase = getServiceClient();

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("order_number", orderNumber)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching order:", error);
  }

  return data as Order | null;
}

export async function getCustomerOrders(email: string): Promise<Order[]> {
  const supabase = getServiceClient();

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("email", email.toLowerCase())
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching customer orders:", error);
    return [];
  }

  return data as Order[];
}

export async function updateOrderStatus(
  orderId: string,
  status: Order["status"]
): Promise<Order | null> {
  const supabase = getServiceClient();

  const { data, error } = await supabase
    .from("orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", orderId)
    .select()
    .single();

  if (error) {
    console.error("Error updating order status:", error);
    return null;
  }

  return data as Order;
}

// =====================================================
// LOGOS / ARTWORK STORAGE
// =====================================================

export async function uploadLogo(
  file: File,
  email: string,
  customerId?: string
): Promise<Logo | null> {
  const supabase = getServiceClient();

  // Generate unique filename
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const storagePath = `${email.toLowerCase()}/${timestamp}-${safeName}`;

  // Upload to storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("logos")
    .upload(storagePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    console.error("Error uploading logo:", uploadError);
    return null;
  }

  // Get public URL
  const { data: urlData } = supabase.storage.from("logos").getPublicUrl(storagePath);

  // Save to logos table
  const logoInsert: LogoInsert = {
    customer_id: customerId || null,
    email: email.toLowerCase(),
    filename: file.name,
    storage_path: storagePath,
    public_url: urlData.publicUrl,
    file_size: file.size,
    mime_type: file.type,
  };

  const { data, error } = await supabase.from("logos").insert(logoInsert).select().single();

  if (error) {
    console.error("Error saving logo record:", error);
    return null;
  }

  return data as Logo;
}

export async function getCustomerLogos(email: string): Promise<Logo[]> {
  const supabase = getServiceClient();

  const { data, error } = await supabase
    .from("logos")
    .select("*")
    .eq("email", email.toLowerCase())
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching customer logos:", error);
    return [];
  }

  return data as Logo[];
}

// =====================================================
// HAT SALES ANALYTICS
// =====================================================

export async function recordHatSales(
  orderId: string,
  items: OrderItem[]
): Promise<void> {
  const supabase = getServiceClient();

  const salesRecords: HatSaleInsert[] = items.map((item) => {
    // Parse model and color from item name (e.g., "Richardson 112 - Black")
    const nameParts = item.name.split(" - ");
    const model = item.model || nameParts[0] || "Unknown";
    const color = item.color || nameParts[1] || "Unknown";

    return {
      order_id: orderId,
      hat_model: model,
      hat_color: color,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      total_price: item.unitPrice * item.quantity,
    };
  });

  const { error } = await supabase.from("hat_sales").insert(salesRecords);

  if (error) {
    console.error("Error recording hat sales:", error);
  }
}

// =====================================================
// REVENUE ANALYTICS
// =====================================================

export async function recordRevenue(
  orderId: string,
  amount: number,
  type: "sale" | "refund" = "sale"
): Promise<void> {
  const supabase = getServiceClient();

  const revenue: RevenueInsert = {
    order_id: orderId,
    amount: type === "refund" ? -Math.abs(amount) : amount,
    revenue_type: type,
  };

  const { error } = await supabase.from("revenue").insert(revenue);

  if (error) {
    console.error("Error recording revenue:", error);
  }
}

// =====================================================
// COMPLETE ORDER PROCESSING
// =====================================================

export interface ProcessOrderParams {
  stripeSessionId: string;
  stripePaymentIntent?: string;
  email: string;
  customerName?: string;
  items: OrderItem[];
  embroideryType: "standard" | "puff";
  frontLocation: string;
  extraLocations: string[];
  artworkFilename?: string;
  hatSubtotal: number;
  volumeDiscount: number;
  artworkFee: number;
  puffEmbroideryFee: number;
  extraLocationsFee: number;
  totalAmount: number;
  totalHats: number;
  shippingName?: string;
  shippingAddress?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
}

export async function processCompletedOrder(
  params: ProcessOrderParams
): Promise<{ order: Order | null; customer: Customer | null }> {
  // 1. Get or create customer
  const customer = await getOrCreateCustomer(params.email, params.customerName);

  if (!customer) {
    console.error("Failed to get/create customer");
    return { order: null, customer: null };
  }

  // 2. Check if customer has paid setup fee before
  const shouldChargeSetupFee = !customer.has_setup_fee_paid;
  const actualArtworkFee = shouldChargeSetupFee ? params.artworkFee : 0;

  // 3. Create order
  const orderInsert: OrderInsert = {
    order_number: generateOrderNumber(),
    customer_id: customer.id,
    email: params.email.toLowerCase(),
    stripe_session_id: params.stripeSessionId,
    stripe_payment_intent: params.stripePaymentIntent || null,
    items: params.items,
    embroidery_type: params.embroideryType,
    front_location: params.frontLocation,
    extra_locations: params.extraLocations,
    artwork_filename: params.artworkFilename || null,
    hat_subtotal: params.hatSubtotal,
    volume_discount: params.volumeDiscount,
    artwork_fee: actualArtworkFee,
    puff_embroidery_fee: params.puffEmbroideryFee,
    extra_locations_fee: params.extraLocationsFee,
    total_amount: params.totalAmount,
    total_hats: params.totalHats,
    shipping_name: params.shippingName || null,
    shipping_address: params.shippingAddress || null,
    status: "paid",
  };

  const order = await createOrder(orderInsert);

  if (!order) {
    console.error("Failed to create order");
    return { order: null, customer };
  }

  // 4. Update customer stats (triggers will also run)
  const updatedCustomer = await updateCustomerAfterOrder(
    customer.id,
    params.totalAmount,
    params.totalHats
  );

  // 5. Record hat sales analytics
  await recordHatSales(order.id, params.items);

  // 6. Record revenue
  await recordRevenue(order.id, params.totalAmount);

  return { order, customer: updatedCustomer || customer };
}

// =====================================================
// ANALYTICS QUERIES
// =====================================================

export async function getHatSalesAnalytics(
  startDate?: Date,
  endDate?: Date
): Promise<{ model: string; color: string; total_qty: number; total_revenue: number }[]> {
  const supabase = getServiceClient();

  let query = supabase
    .from("hat_sales")
    .select("hat_model, hat_color, quantity, total_price");

  if (startDate) {
    query = query.gte("sale_date", startDate.toISOString().split("T")[0]);
  }
  if (endDate) {
    query = query.lte("sale_date", endDate.toISOString().split("T")[0]);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching hat sales analytics:", error);
    return [];
  }

  // Aggregate by model and color
  const aggregated: Record<string, { model: string; color: string; total_qty: number; total_revenue: number }> = {};

  for (const sale of data) {
    const key = `${sale.hat_model}|${sale.hat_color}`;
    if (!aggregated[key]) {
      aggregated[key] = {
        model: sale.hat_model,
        color: sale.hat_color,
        total_qty: 0,
        total_revenue: 0,
      };
    }
    aggregated[key].total_qty += sale.quantity;
    aggregated[key].total_revenue += sale.total_price;
  }

  return Object.values(aggregated).sort((a, b) => b.total_qty - a.total_qty);
}

export async function getRevenueAnalytics(
  period: "day" | "week" | "month" | "year"
): Promise<{ date: string; amount: number }[]> {
  const supabase = getServiceClient();

  const now = new Date();
  let startDate: Date;

  switch (period) {
    case "day":
      startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      break;
    case "week":
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case "month":
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case "year":
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
  }

  const { data, error } = await supabase
    .from("revenue")
    .select("revenue_date, amount")
    .gte("revenue_date", startDate.toISOString().split("T")[0])
    .order("revenue_date", { ascending: true });

  if (error) {
    console.error("Error fetching revenue analytics:", error);
    return [];
  }

  // Aggregate by date
  const aggregated: Record<string, number> = {};

  for (const rev of data) {
    if (!aggregated[rev.revenue_date]) {
      aggregated[rev.revenue_date] = 0;
    }
    aggregated[rev.revenue_date] += rev.amount;
  }

  return Object.entries(aggregated).map(([date, amount]) => ({ date, amount }));
}

// Mock data for self-contained site
import type { Customer, Order, Logo, SiteStats } from "@/lib/database.types";

export const MOCK_SITE_STATS: SiteStats = {
  id: 1,
  total_hats_produced: 15624,
  total_orders: 976,
  total_customers: 301,
  updated_at: new Date().toISOString(),
};

// Mock customer data (for returning customers)
export const MOCK_CUSTOMERS: Record<string, Customer> = {};

// Mock orders data
export const MOCK_ORDERS: Order[] = [];

// Mock logos data
export const MOCK_LOGOS: Logo[] = [];

// Helper functions that return mock data
export function getSiteStats(): SiteStats {
  return MOCK_SITE_STATS;
}

export function getCustomerByEmail(email: string): Customer | null {
  return MOCK_CUSTOMERS[email.toLowerCase()] || null;
}

export function getCustomerOrders(email: string): Order[] {
  return MOCK_ORDERS.filter(order => order.email.toLowerCase() === email.toLowerCase());
}

export function getCustomerLogos(email: string): Logo[] {
  return MOCK_LOGOS.filter(logo => logo.email.toLowerCase() === email.toLowerCase());
}

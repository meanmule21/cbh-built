// =====================================================
// CUSTOM BUSINESS HATS - DATABASE TYPES
// =====================================================

export type RewardTier = 'Bronze' | 'Silver' | 'Gold' | 'VIP' | 'Elite' | 'Diamond' | 'Platinum';
export type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type EmbroideryType = 'standard' | 'puff';

// =====================================================
// CUSTOMERS
// =====================================================
export interface Customer {
  id: string;
  email: string;
  phone: string | null;
  name: string | null;
  total_lifetime_spend: number;
  total_hats_ordered: number;
  reward_tier: RewardTier;
  has_setup_fee_paid: boolean;
  created_at: string;
  updated_at: string;
}

export interface CustomerInsert {
  email: string;
  phone?: string | null;
  name?: string | null;
  total_lifetime_spend?: number;
  total_hats_ordered?: number;
  reward_tier?: RewardTier;
  has_setup_fee_paid?: boolean;
}

export interface CustomerUpdate {
  email?: string;
  phone?: string | null;
  name?: string | null;
  total_lifetime_spend?: number;
  total_hats_ordered?: number;
  reward_tier?: RewardTier;
  has_setup_fee_paid?: boolean;
  updated_at?: string;
}

// =====================================================
// ORDERS
// =====================================================
export interface OrderItem {
  id: string;
  name: string;
  model: string;
  color: string;
  quantity: number;
  unitPrice: number;
}

export interface ShippingAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id: string | null;
  email: string;
  stripe_session_id: string | null;
  stripe_payment_intent: string | null;
  items: OrderItem[];
  embroidery_type: EmbroideryType | null;
  front_location: string | null;
  extra_locations: string[] | null;
  artwork_filename: string | null;
  artwork_url: string | null;
  hat_subtotal: number;
  volume_discount: number;
  artwork_fee: number;
  puff_embroidery_fee: number;
  extra_locations_fee: number;
  total_amount: number;
  total_hats: number;
  shipping_name: string | null;
  shipping_address: ShippingAddress | null;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
}

export interface OrderInsert {
  order_number: string;
  customer_id?: string | null;
  email: string;
  stripe_session_id?: string | null;
  stripe_payment_intent?: string | null;
  items: OrderItem[];
  embroidery_type?: EmbroideryType | null;
  front_location?: string | null;
  extra_locations?: string[] | null;
  artwork_filename?: string | null;
  artwork_url?: string | null;
  hat_subtotal: number;
  volume_discount?: number;
  artwork_fee?: number;
  puff_embroidery_fee?: number;
  extra_locations_fee?: number;
  total_amount: number;
  total_hats: number;
  shipping_name?: string | null;
  shipping_address?: ShippingAddress | null;
  status?: OrderStatus;
}

// =====================================================
// LOGOS
// =====================================================
export interface Logo {
  id: string;
  customer_id: string | null;
  email: string;
  filename: string;
  storage_path: string;
  public_url: string | null;
  file_size: number | null;
  mime_type: string | null;
  created_at: string;
}

export interface LogoInsert {
  customer_id?: string | null;
  email: string;
  filename: string;
  storage_path: string;
  public_url?: string | null;
  file_size?: number | null;
  mime_type?: string | null;
}

// =====================================================
// HAT SALES ANALYTICS
// =====================================================
export interface HatSale {
  id: string;
  order_id: string | null;
  hat_model: string;
  hat_color: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  sale_date: string;
  created_at: string;
}

export interface HatSaleInsert {
  order_id?: string | null;
  hat_model: string;
  hat_color: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  sale_date?: string;
}

// =====================================================
// REVENUE ANALYTICS
// =====================================================
export interface Revenue {
  id: string;
  order_id: string | null;
  amount: number;
  revenue_date: string;
  revenue_type: 'sale' | 'refund';
  created_at: string;
}

export interface RevenueInsert {
  order_id?: string | null;
  amount: number;
  revenue_date?: string;
  revenue_type?: 'sale' | 'refund';
}

// =====================================================
// SITE STATS
// =====================================================
export interface SiteStats {
  id: number;
  total_hats_produced: number;
  total_orders: number;
  total_customers: number;
  updated_at: string;
}

// =====================================================
// REWARD TIER THRESHOLDS
// =====================================================
export const REWARD_TIERS: { tier: RewardTier; minSpend: number; discount: number }[] = [
  { tier: 'Bronze', minSpend: 0, discount: 0 },
  { tier: 'Silver', minSpend: 250, discount: 5 },
  { tier: 'Gold', minSpend: 500, discount: 10 },
  { tier: 'VIP', minSpend: 1000, discount: 15 },
  { tier: 'Elite', minSpend: 2500, discount: 20 },
  { tier: 'Diamond', minSpend: 5000, discount: 25 },
  { tier: 'Platinum', minSpend: 10000, discount: 30 },
];

export function calculateRewardTier(lifetimeSpend: number): RewardTier {
  for (let i = REWARD_TIERS.length - 1; i >= 0; i--) {
    if (lifetimeSpend >= REWARD_TIERS[i].minSpend) {
      return REWARD_TIERS[i].tier;
    }
  }
  return 'Bronze';
}

export function getRewardDiscount(tier: RewardTier): number {
  const found = REWARD_TIERS.find(t => t.tier === tier);
  return found?.discount || 0;
}

export function getNextTier(tier: RewardTier): { tier: RewardTier; amountNeeded: number } | null {
  const currentIndex = REWARD_TIERS.findIndex(t => t.tier === tier);
  if (currentIndex < REWARD_TIERS.length - 1) {
    const next = REWARD_TIERS[currentIndex + 1];
    return { tier: next.tier, amountNeeded: next.minSpend };
  }
  return null;
}


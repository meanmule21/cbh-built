-- =====================================================
-- CUSTOM BUSINESS HATS - SUPABASE SCHEMA
-- Run this entire script in your Supabase SQL Editor
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- CUSTOMERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS customers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  name TEXT,
  total_lifetime_spend NUMERIC DEFAULT 0,
  total_hats_ordered INTEGER DEFAULT 0,
  reward_tier TEXT DEFAULT 'Bronze' CHECK (reward_tier IN ('Bronze', 'Silver', 'Gold', 'VIP', 'Elite', 'Diamond', 'Platinum')),
  has_setup_fee_paid BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast email lookups
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);

-- =====================================================
-- ORDERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES customers(id),
  email TEXT NOT NULL,
  stripe_session_id TEXT UNIQUE,
  stripe_payment_intent TEXT,
  
  -- Order details (JSON for flexibility)
  items JSONB NOT NULL DEFAULT '[]',
  
  -- Embroidery details
  embroidery_type TEXT, -- 'standard' or 'puff'
  front_location TEXT,
  extra_locations TEXT[],
  artwork_filename TEXT,
  artwork_url TEXT,
  
  -- Pricing
  hat_subtotal NUMERIC NOT NULL DEFAULT 0,
  volume_discount NUMERIC DEFAULT 0,
  artwork_fee NUMERIC DEFAULT 0,
  puff_embroidery_fee NUMERIC DEFAULT 0,
  extra_locations_fee NUMERIC DEFAULT 0,
  total_amount NUMERIC NOT NULL,
  
  -- Counts
  total_hats INTEGER NOT NULL DEFAULT 0,
  
  -- Shipping
  shipping_name TEXT,
  shipping_address JSONB,
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled')),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(email);
CREATE INDEX IF NOT EXISTS idx_orders_stripe_session ON orders(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at);

-- =====================================================
-- LOGOS TABLE (Customer artwork/logos)
-- =====================================================
CREATE TABLE IF NOT EXISTS logos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id),
  email TEXT NOT NULL,
  filename TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  public_url TEXT,
  file_size INTEGER,
  mime_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_logos_customer ON logos(customer_id);
CREATE INDEX IF NOT EXISTS idx_logos_email ON logos(email);

-- =====================================================
-- HAT SALES ANALYTICS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS hat_sales (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES orders(id),
  hat_model TEXT NOT NULL,
  hat_color TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC NOT NULL,
  total_price NUMERIC NOT NULL,
  sale_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_hat_sales_model ON hat_sales(hat_model);
CREATE INDEX IF NOT EXISTS idx_hat_sales_date ON hat_sales(sale_date);
CREATE INDEX IF NOT EXISTS idx_hat_sales_model_color ON hat_sales(hat_model, hat_color);

-- =====================================================
-- REVENUE ANALYTICS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS revenue (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES orders(id),
  amount NUMERIC NOT NULL,
  revenue_date DATE DEFAULT CURRENT_DATE,
  revenue_type TEXT DEFAULT 'sale' CHECK (revenue_type IN ('sale', 'refund')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_revenue_date ON revenue(revenue_date);

-- =====================================================
-- SITE STATS TABLE (For homepage counters)
-- =====================================================
CREATE TABLE IF NOT EXISTS site_stats (
  id INTEGER PRIMARY KEY DEFAULT 1,
  total_hats_produced INTEGER DEFAULT 0,
  total_orders INTEGER DEFAULT 0,
  total_customers INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure only one row
  CONSTRAINT single_row CHECK (id = 1)
);

-- Insert initial stats row
INSERT INTO site_stats (id, total_hats_produced, total_orders, total_customers)
VALUES (1, 15624, 976, 301)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- REWARD TIERS REFERENCE
-- =====================================================
-- Bronze: $0 - $249
-- Silver: $250 - $499
-- Gold: $500 - $999
-- VIP: $1,000 - $2,499
-- Elite: $2,500 - $4,999
-- Diamond: $5,000 - $9,999
-- Platinum: $10,000+

-- =====================================================
-- FUNCTION: Calculate Reward Tier
-- =====================================================
CREATE OR REPLACE FUNCTION calculate_reward_tier(lifetime_spend NUMERIC)
RETURNS TEXT AS $$
BEGIN
  IF lifetime_spend >= 10000 THEN RETURN 'Platinum';
  ELSIF lifetime_spend >= 5000 THEN RETURN 'Diamond';
  ELSIF lifetime_spend >= 2500 THEN RETURN 'Elite';
  ELSIF lifetime_spend >= 1000 THEN RETURN 'VIP';
  ELSIF lifetime_spend >= 500 THEN RETURN 'Gold';
  ELSIF lifetime_spend >= 250 THEN RETURN 'Silver';
  ELSE RETURN 'Bronze';
  END IF;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCTION: Update Customer Stats After Order
-- =====================================================
CREATE OR REPLACE FUNCTION update_customer_after_order()
RETURNS TRIGGER AS $$
BEGIN
  -- Update customer totals and reward tier
  UPDATE customers
  SET 
    total_lifetime_spend = total_lifetime_spend + NEW.total_amount,
    total_hats_ordered = total_hats_ordered + NEW.total_hats,
    reward_tier = calculate_reward_tier(total_lifetime_spend + NEW.total_amount),
    has_setup_fee_paid = TRUE,
    updated_at = NOW()
  WHERE id = NEW.customer_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for customer updates
DROP TRIGGER IF EXISTS trigger_update_customer_after_order ON orders;
CREATE TRIGGER trigger_update_customer_after_order
  AFTER INSERT ON orders
  FOR EACH ROW
  WHEN (NEW.status = 'paid')
  EXECUTE FUNCTION update_customer_after_order();

-- =====================================================
-- FUNCTION: Update Site Stats After Order
-- =====================================================
CREATE OR REPLACE FUNCTION update_site_stats_after_order()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE site_stats
  SET 
    total_hats_produced = total_hats_produced + NEW.total_hats,
    total_orders = total_orders + 1,
    updated_at = NOW()
  WHERE id = 1;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for site stats
DROP TRIGGER IF EXISTS trigger_update_site_stats ON orders;
CREATE TRIGGER trigger_update_site_stats
  AFTER INSERT ON orders
  FOR EACH ROW
  WHEN (NEW.status = 'paid')
  EXECUTE FUNCTION update_site_stats_after_order();

-- =====================================================
-- FUNCTION: Increment Customer Count
-- =====================================================
CREATE OR REPLACE FUNCTION increment_customer_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE site_stats
  SET 
    total_customers = total_customers + 1,
    updated_at = NOW()
  WHERE id = 1;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for new customers
DROP TRIGGER IF EXISTS trigger_increment_customer_count ON customers;
CREATE TRIGGER trigger_increment_customer_count
  AFTER INSERT ON customers
  FOR EACH ROW
  EXECUTE FUNCTION increment_customer_count();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE logos ENABLE ROW LEVEL SECURITY;
ALTER TABLE hat_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_stats ENABLE ROW LEVEL SECURITY;

-- Public read access to site_stats
CREATE POLICY "Public can read site stats" ON site_stats
  FOR SELECT USING (true);

-- Service role has full access (for webhooks/server)
CREATE POLICY "Service role full access to customers" ON customers
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to orders" ON orders
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to logos" ON logos
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to hat_sales" ON hat_sales
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to revenue" ON revenue
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to site_stats" ON site_stats
  FOR ALL USING (auth.role() = 'service_role');

-- =====================================================
-- STORAGE BUCKET FOR LOGOS
-- =====================================================
-- Run this separately or in Supabase Storage settings:
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('logos', 'logos', true)
-- ON CONFLICT DO NOTHING;

-- =====================================================
-- DONE! Your database is ready.
-- =====================================================

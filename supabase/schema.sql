-- =====================================================
-- SUPABASE SCHEMA FOR CUSTOM BUSINESS HATS
-- Run this SQL in your Supabase SQL Editor
-- =====================================================

-- 1. Create the orders table
-- Stores each completed order with customer info and hat quantity
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_email TEXT NOT NULL,
  total_quantity INTEGER NOT NULL DEFAULT 0,
  stripe_session_id TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create an index on customer_email for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);

-- Create an index on stripe_session_id for webhook idempotency
CREATE INDEX IF NOT EXISTS idx_orders_stripe_session_id ON orders(stripe_session_id);


-- 2. Create the stats table
-- Single row table to track aggregate statistics
CREATE TABLE IF NOT EXISTS stats (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  total_orders INTEGER NOT NULL DEFAULT 0,
  total_customers INTEGER NOT NULL DEFAULT 0,
  total_hats INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert the initial stats row (will be updated by webhook)
INSERT INTO stats (id, total_orders, total_customers, total_hats)
VALUES (1, 0, 0, 0)
ON CONFLICT (id) DO NOTHING;


-- 3. Enable Row Level Security (RLS)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE stats ENABLE ROW LEVEL SECURITY;

-- Policy: Allow service role (webhook) to insert orders
CREATE POLICY "Service role can insert orders"
  ON orders FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Policy: Allow service role to select orders (for customer check)
CREATE POLICY "Service role can select orders"
  ON orders FOR SELECT
  TO service_role
  USING (true);

-- Policy: Allow anon/public to read stats (for homepage)
CREATE POLICY "Anyone can read stats"
  ON stats FOR SELECT
  TO anon, authenticated
  USING (true);

-- Policy: Allow service role to update stats
CREATE POLICY "Service role can update stats"
  ON stats FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);


-- 4. Create a function to update stats (optional helper)
CREATE OR REPLACE FUNCTION increment_stats(
  order_quantity INTEGER,
  is_new_customer BOOLEAN
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE stats
  SET
    total_orders = total_orders + 1,
    total_hats = total_hats + order_quantity,
    total_customers = total_customers + CASE WHEN is_new_customer THEN 1 ELSE 0 END,
    updated_at = NOW()
  WHERE id = 1;
END;
$$;




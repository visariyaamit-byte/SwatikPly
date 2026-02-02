-- Challan System Database Schema
-- Run this in Supabase SQL Editor

-- 1. Create challans table
CREATE TABLE IF NOT EXISTS challans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  challan_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  date DATE NOT NULL,
  total_amount DECIMAL(10,2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create challan_items table
CREATE TABLE IF NOT EXISTS challan_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  challan_id UUID NOT NULL REFERENCES challans(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  rate DECIMAL(10,2),
  amount DECIMAL(10,2),
  inventory_id UUID REFERENCES inventory(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create indexes
CREATE INDEX IF NOT EXISTS idx_challans_number ON challans(challan_number);
CREATE INDEX IF NOT EXISTS idx_challans_date ON challans(date DESC);
CREATE INDEX IF NOT EXISTS idx_challan_items_challan ON challan_items(challan_id);

-- 4. Enable RLS
ALTER TABLE challans ENABLE ROW LEVEL SECURITY;
ALTER TABLE challan_items ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS policies
DROP POLICY IF EXISTS "Allow all for authenticated users" ON challans;
CREATE POLICY "Allow all for authenticated users" ON challans
  FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow all for authenticated users" ON challan_items;
CREATE POLICY "Allow all for authenticated users" ON challan_items
  FOR ALL USING (auth.role() = 'authenticated');

-- Done! Challan tables created successfully.

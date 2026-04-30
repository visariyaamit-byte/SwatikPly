-- Complete Inventory Schema Setup
-- Run this ONCE in Supabase SQL Editor

-- 1. Create companies table
CREATE TABLE IF NOT EXISTS companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create inventory table
CREATE TABLE IF NOT EXISTS inventory (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_type TEXT NOT NULL CHECK (product_type IN ('Plywood', 'Board', 'MDF', 'Flexi')),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  grade TEXT,
  measurement TEXT,
  thickness TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT check_product_type_fields CHECK (
    (product_type = 'Plywood' AND company_id IS NOT NULL AND grade IS NULL) OR
    (product_type = 'Board' AND grade IS NOT NULL AND company_id IS NULL) OR
    (product_type = 'MDF' AND grade IS NOT NULL AND company_id IS NULL) OR
    (product_type = 'Flexi' AND grade IS NOT NULL AND company_id IS NULL)
  )
);

-- 3. Create unique indexes to prevent duplicates
DROP INDEX IF EXISTS idx_inventory_unique_plywood;
DROP INDEX IF EXISTS idx_inventory_unique_board;
DROP INDEX IF EXISTS idx_inventory_unique_mdf;
DROP INDEX IF EXISTS idx_inventory_unique_flexi;

CREATE UNIQUE INDEX idx_inventory_unique_plywood 
  ON inventory (product_type, company_id, measurement, thickness)
  WHERE product_type = 'Plywood';

CREATE UNIQUE INDEX idx_inventory_unique_board 
  ON inventory (product_type, grade, measurement, thickness)
  WHERE product_type = 'Board';

CREATE UNIQUE INDEX idx_inventory_unique_mdf 
  ON inventory (product_type, grade, thickness)
  WHERE product_type = 'MDF';

CREATE UNIQUE INDEX idx_inventory_unique_flexi 
  ON inventory (product_type, grade, thickness)
  WHERE product_type = 'Flexi';

-- 4. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_inventory_product_type ON inventory(product_type);
CREATE INDEX IF NOT EXISTS idx_inventory_company_id ON inventory(company_id);
CREATE INDEX IF NOT EXISTS idx_inventory_grade ON inventory(grade);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS policies (allow all for authenticated users)
DROP POLICY IF EXISTS "Allow all for authenticated users" ON companies;
CREATE POLICY "Allow all for authenticated users" ON companies
  FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow all for authenticated users" ON inventory;
CREATE POLICY "Allow all for authenticated users" ON inventory
  FOR ALL USING (auth.role() = 'authenticated');

-- Done! Now you can use the Initialize Inventory button in the app.

-- Companies table (for Plywood only)
CREATE TABLE companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inventory table (supports both Plywood and Board)
CREATE TABLE inventory (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_type TEXT NOT NULL CHECK (product_type IN ('Plywood', 'Board')),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  grade TEXT,
  measurement TEXT NOT NULL,
  thickness TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  minimum_stock INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT check_plywood_has_company CHECK (
    (product_type = 'Plywood' AND company_id IS NOT NULL) OR
    (product_type = 'Board' AND grade IS NOT NULL)
  )
);

-- Stock history table (for tracking additions and removals)
CREATE TABLE stock_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  inventory_id UUID NOT NULL REFERENCES inventory(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('addition', 'removal')),
  quantity INTEGER NOT NULL,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_inventory_company ON inventory(company_id);
CREATE INDEX idx_inventory_product_type ON inventory(product_type);
CREATE INDEX idx_stock_history_inventory ON stock_history(inventory_id);
CREATE INDEX idx_inventory_low_stock ON inventory(quantity, minimum_stock);

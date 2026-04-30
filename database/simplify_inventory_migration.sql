-- Migration to simplify inventory system
-- Run this in Supabase SQL Editor

-- Drop stock_history table (no longer needed)
DROP TABLE IF EXISTS stock_history;

-- Remove minimum_stock column from inventory
ALTER TABLE inventory DROP COLUMN IF EXISTS minimum_stock;

-- Add unique constraint to prevent duplicates
-- For Plywood: product_type + company_id + measurement + thickness must be unique
-- For Board/MDF/Flexi: product_type + grade + measurement + thickness must be unique

-- First, we need to handle the case where measurement can be NULL for MDF/Flexi
-- Create a unique index that handles this properly
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

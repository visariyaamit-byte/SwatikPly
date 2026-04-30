-- Migration to add MDF and FLEXI support
-- Run this in Supabase SQL Editor

-- Update the product_type constraint to include MDF and FLEXI
ALTER TABLE inventory DROP CONSTRAINT IF EXISTS inventory_product_type_check;
ALTER TABLE inventory ADD CONSTRAINT inventory_product_type_check 
  CHECK (product_type IN ('Plywood', 'Board', 'MDF', 'Flexi'));

-- Update the check constraint to handle all product types
ALTER TABLE inventory DROP CONSTRAINT IF EXISTS check_plywood_has_company;
ALTER TABLE inventory ADD CONSTRAINT check_product_type_fields CHECK (
  (product_type = 'Plywood' AND company_id IS NOT NULL AND grade IS NULL) OR
  (product_type = 'Board' AND grade IS NOT NULL AND company_id IS NULL) OR
  (product_type = 'MDF' AND grade IS NOT NULL AND company_id IS NULL) OR
  (product_type = 'Flexi' AND grade IS NOT NULL AND company_id IS NULL)
);

-- Note: 
-- - MDF uses 'grade' field for color (Pink, Green)
-- - Flexi uses 'grade' field for type (H.W, GURJAN)
-- - MDF doesn't use measurement field (can be NULL or empty)
-- - Flexi doesn't use measurement field (can be NULL or empty)

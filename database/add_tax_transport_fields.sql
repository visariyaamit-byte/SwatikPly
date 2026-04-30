-- Add CGST, SGST, and Transport fields to challans table

ALTER TABLE challans
ADD COLUMN cgst_percentage DECIMAL(5,2) DEFAULT 0,
ADD COLUMN sgst_percentage DECIMAL(5,2) DEFAULT 0,
ADD COLUMN transport_charges DECIMAL(10,2) DEFAULT 0,
ADD COLUMN subtotal DECIMAL(10,2) DEFAULT 0,
ADD COLUMN cgst_amount DECIMAL(10,2) DEFAULT 0,
ADD COLUMN sgst_amount DECIMAL(10,2) DEFAULT 0;

-- Update existing challans to set subtotal = total_amount
UPDATE challans SET subtotal = total_amount WHERE subtotal = 0;

COMMENT ON COLUMN challans.cgst_percentage IS 'CGST percentage (e.g., 9 for 9%)';
COMMENT ON COLUMN challans.sgst_percentage IS 'SGST percentage (e.g., 9 for 9%)';
COMMENT ON COLUMN challans.transport_charges IS 'Flat transport charges amount';
COMMENT ON COLUMN challans.subtotal IS 'Subtotal before taxes';
COMMENT ON COLUMN challans.cgst_amount IS 'Calculated CGST amount';
COMMENT ON COLUMN challans.sgst_amount IS 'Calculated SGST amount';

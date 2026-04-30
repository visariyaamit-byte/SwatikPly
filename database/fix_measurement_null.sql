-- Fix for measurement column - allow NULL for MDF and Flexi
-- Run this in Supabase SQL Editor

-- Drop the NOT NULL constraint on measurement column
ALTER TABLE inventory ALTER COLUMN measurement DROP NOT NULL;

-- Now you can click "Initialize Inventory" again and it will work!

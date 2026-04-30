-- User Roles Table Schema (Actual from Supabase)
-- This is the current schema in your database

CREATE TABLE public.user_roles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  email text NOT NULL,
  role text NOT NULL,
  created_at timestamp with time zone NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT user_roles_pkey PRIMARY KEY (id),
  CONSTRAINT user_roles_email_key UNIQUE (email),
  CONSTRAINT user_roles_role_check CHECK (
    role = ANY (ARRAY['manager'::text, 'staff'::text, 'viewer'::text])
  )
) TABLESPACE pg_default;

-- Create index for efficient querying
CREATE INDEX IF NOT EXISTS idx_user_roles_email ON user_roles(email);

-- Enable RLS (if not already enabled)
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- ============================================
-- USAGE EXAMPLES
-- ============================================

-- 1. View all users and their roles
SELECT * FROM user_roles ORDER BY created_at DESC;

-- 2. Set a user as STAFF
-- Replace 'user@example.com' with the actual email
INSERT INTO user_roles (email, role)
VALUES ('user@example.com', 'staff')
ON CONFLICT (email) DO UPDATE SET role = 'staff', created_at = NOW();

-- 3. Set a user as MANAGER
-- Replace 'user@example.com' with the actual email
INSERT INTO user_roles (email, role)
VALUES ('user@example.com', 'manager')
ON CONFLICT (email) DO UPDATE SET role = 'manager', created_at = NOW();

-- 4. Set a user as VIEWER
-- Replace 'user@example.com' with the actual email
INSERT INTO user_roles (email, role)
VALUES ('user@example.com', 'viewer')
ON CONFLICT (email) DO UPDATE SET role = 'viewer', created_at = NOW();

-- 5. Check a specific user's role
SELECT email, role, created_at 
FROM user_roles 
WHERE email = 'user@example.com';

-- 6. Update an existing user's role
UPDATE user_roles 
SET role = 'staff' 
WHERE email = 'user@example.com';

-- 7. Delete a user's role
DELETE FROM user_roles WHERE email = 'user@example.com';

-- 8. Count users by role
SELECT role, COUNT(*) as count 
FROM user_roles 
GROUP BY role;

-- ============================================
-- QUICK COMMAND TO SET USER AS STAFF
-- ============================================
-- Just replace the email and run this:

-- INSERT INTO user_roles (email, role)
-- VALUES ('YOUR_EMAIL_HERE@example.com', 'staff')
-- ON CONFLICT (email) DO UPDATE SET role = 'staff';

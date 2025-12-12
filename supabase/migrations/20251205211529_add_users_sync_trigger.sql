/*
  # Add User Auto-Sync Trigger and Missing Columns

  1. Schema Updates
    - Add `last_sign_in_at` column to track user login activity
    - Ensure all existing columns are properly configured

  2. Trigger Function
    - Automatically creates/updates a user profile in public.users when a user signs up/signs in
    - Syncs user metadata (email, name) from auth.users to public.users
    - Updates last_sign_in_at timestamp on each login
    - Sets default role to 'user' if not specified
    - Sets default risk_preference to 'Moderate' if not specified

  3. Indexes
    - Ensure indexes exist for performance

  4. Important Notes
    - Works with existing users table schema (uses 'name' column, not 'full_name')
    - Trigger ensures every authenticated user has a profile
    - Existing auth users will be backfilled automatically
    - risk_preference must be: 'Conservative', 'Moderate', or 'Aggressive'
    - role must be: 'user' or 'admin'
*/

-- =====================================================
-- 1. ADD MISSING COLUMNS TO USERS TABLE
-- =====================================================

-- Add last_sign_in_at column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'users' 
    AND column_name = 'last_sign_in_at'
  ) THEN
    ALTER TABLE public.users ADD COLUMN last_sign_in_at timestamptz;
  END IF;
END $$;

-- =====================================================
-- 2. ENSURE INDEXES EXIST
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

-- =====================================================
-- 3. ENSURE RLS IS ENABLED
-- =====================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 4. ADD SERVICE ROLE POLICY IF IT DOESN'T EXIST
-- =====================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'users' 
    AND policyname = 'Service role has full access to users'
  ) THEN
    CREATE POLICY "Service role has full access to users"
      ON public.users
      FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- =====================================================
-- 5. CREATE TRIGGER FUNCTION FOR AUTO-SYNC
-- =====================================================

-- Function to handle new user creation and updates
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role, created_at, last_sign_in_at, risk_preference)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'role', 'user'),
    new.created_at,
    new.last_sign_in_at,
    COALESCE(new.raw_user_meta_data->>'risk_preference', 'Moderate')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = COALESCE(NULLIF(EXCLUDED.name, ''), public.users.name),
    last_sign_in_at = EXCLUDED.last_sign_in_at,
    updated_at = now();
  
  RETURN new;
END;
$$;

-- Add comment to explain the function
COMMENT ON FUNCTION public.handle_new_user() IS 
'Automatically creates or updates a user profile in public.users when a user signs up or signs in via Supabase Auth. Syncs email, name, role, and last_sign_in_at.';

-- =====================================================
-- 6. CREATE TRIGGER ON AUTH.USERS
-- =====================================================

-- Drop trigger if it exists (for idempotency)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger that fires after INSERT or UPDATE on auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- 7. GRANT NECESSARY PERMISSIONS
-- =====================================================

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO postgres;

-- Grant table permissions
GRANT SELECT, UPDATE ON public.users TO authenticated;
GRANT ALL ON public.users TO service_role;

-- =====================================================
-- 8. BACKFILL EXISTING AUTH USERS
-- =====================================================

-- Insert profiles for any existing auth users that don't have a profile yet
INSERT INTO public.users (id, email, name, role, created_at, last_sign_in_at, risk_preference)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', au.raw_user_meta_data->>'name', split_part(au.email, '@', 1)),
  COALESCE(au.raw_user_meta_data->>'role', 'user'),
  au.created_at,
  au.last_sign_in_at,
  COALESCE(au.raw_user_meta_data->>'risk_preference', 'Moderate')
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM public.users pu WHERE pu.id = au.id
)
ON CONFLICT (id) DO UPDATE SET
  last_sign_in_at = EXCLUDED.last_sign_in_at,
  updated_at = now();

-- =====================================================
-- 9. SUCCESS LOG
-- =====================================================

DO $$
DECLARE
  user_count integer;
  auth_count integer;
BEGIN
  SELECT COUNT(*) INTO user_count FROM public.users;
  SELECT COUNT(*) INTO auth_count FROM auth.users;
  RAISE NOTICE 'User sync complete! Public users: %, Auth users: %. Auto-sync trigger is now active.', user_count, auth_count;
END $$;
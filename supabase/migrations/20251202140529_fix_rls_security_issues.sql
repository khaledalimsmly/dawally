/*
  # Fix RLS Security and Performance Issues

  1. RLS Performance Optimization
    - Update all RLS policies to use `(select auth.function())` pattern
    - This prevents re-evaluation of auth functions for each row
    - Improves query performance at scale

  2. Password Reset Tokens Security
    - Add proper RLS policies for password_reset_tokens table
    - Service role only access (managed by Edge Functions)

  3. Function Security
    - Fix search_path security for database functions
    - Set explicit search_path to prevent security vulnerabilities

  4. Index Management
    - Keep all indexes as they will be used in production
    - Unused warnings are expected for new features

  ## Security Improvements
  - RLS policies optimized for performance
  - Function search paths secured
  - Password reset tokens properly protected
*/

-- =====================================================
-- 1. FIX RLS POLICIES FOR USERS TABLE
-- =====================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;

-- Recreate with optimized pattern using subquery
CREATE POLICY "Users can read own profile"
  ON public.users
  FOR SELECT
  TO authenticated
  USING (id = (select auth.uid()));

CREATE POLICY "Users can update own profile"
  ON public.users
  FOR UPDATE
  TO authenticated
  USING (id = (select auth.uid()))
  WITH CHECK (id = (select auth.uid()));

-- =====================================================
-- 2. FIX RLS POLICIES FOR STOCKS TABLE
-- =====================================================

-- Drop existing admin policies
DROP POLICY IF EXISTS "Only admins can insert stocks" ON public.stocks;
DROP POLICY IF EXISTS "Only admins can update stocks" ON public.stocks;
DROP POLICY IF EXISTS "Only admins can delete stocks" ON public.stocks;

-- Recreate with optimized pattern
CREATE POLICY "Only admins can insert stocks"
  ON public.stocks
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (select auth.jwt()->>'role') = 'admin'
  );

CREATE POLICY "Only admins can update stocks"
  ON public.stocks
  FOR UPDATE
  TO authenticated
  USING (
    (select auth.jwt()->>'role') = 'admin'
  )
  WITH CHECK (
    (select auth.jwt()->>'role') = 'admin'
  );

CREATE POLICY "Only admins can delete stocks"
  ON public.stocks
  FOR DELETE
  TO authenticated
  USING (
    (select auth.jwt()->>'role') = 'admin'
  );

-- =====================================================
-- 3. FIX RLS POLICIES FOR PREDICTIONS TABLE
-- =====================================================

-- Drop existing admin policies
DROP POLICY IF EXISTS "Only admins can insert predictions" ON public.predictions;
DROP POLICY IF EXISTS "Only admins can update predictions" ON public.predictions;
DROP POLICY IF EXISTS "Only admins can delete predictions" ON public.predictions;

-- Recreate with optimized pattern
CREATE POLICY "Only admins can insert predictions"
  ON public.predictions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (select auth.jwt()->>'role') = 'admin'
  );

CREATE POLICY "Only admins can update predictions"
  ON public.predictions
  FOR UPDATE
  TO authenticated
  USING (
    (select auth.jwt()->>'role') = 'admin'
  )
  WITH CHECK (
    (select auth.jwt()->>'role') = 'admin'
  );

CREATE POLICY "Only admins can delete predictions"
  ON public.predictions
  FOR DELETE
  TO authenticated
  USING (
    (select auth.jwt()->>'role') = 'admin'
  );

-- =====================================================
-- 4. FIX RLS POLICIES FOR MARKET_SCANNER_DATA TABLE
-- =====================================================

-- Drop existing admin policies
DROP POLICY IF EXISTS "Only admins can insert scanner data" ON public.market_scanner_data;
DROP POLICY IF EXISTS "Only admins can update scanner data" ON public.market_scanner_data;
DROP POLICY IF EXISTS "Only admins can delete scanner data" ON public.market_scanner_data;

-- Recreate with optimized pattern
CREATE POLICY "Only admins can insert scanner data"
  ON public.market_scanner_data
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (select auth.jwt()->>'role') = 'admin'
  );

CREATE POLICY "Only admins can update scanner data"
  ON public.market_scanner_data
  FOR UPDATE
  TO authenticated
  USING (
    (select auth.jwt()->>'role') = 'admin'
  )
  WITH CHECK (
    (select auth.jwt()->>'role') = 'admin'
  );

CREATE POLICY "Only admins can delete scanner data"
  ON public.market_scanner_data
  FOR DELETE
  TO authenticated
  USING (
    (select auth.jwt()->>'role') = 'admin'
  );

-- =====================================================
-- 5. ADD RLS POLICIES FOR PASSWORD_RESET_TOKENS
-- =====================================================

-- Password reset tokens should ONLY be accessible by Edge Functions using service role
-- No direct user access is allowed for security reasons

-- Drop any existing policies (just to be safe)
DROP POLICY IF EXISTS "Service role only access" ON public.password_reset_tokens;

-- Create restrictive policy that only allows service role
-- Note: Service role bypasses RLS, so this is more of a safety net
CREATE POLICY "Service role only access"
  ON public.password_reset_tokens
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- 6. FIX FUNCTION SECURITY - CLEANUP EXPIRED TOKENS
-- =====================================================

-- Drop and recreate with secure search_path
DROP FUNCTION IF EXISTS public.cleanup_expired_reset_tokens();

CREATE OR REPLACE FUNCTION public.cleanup_expired_reset_tokens()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  DELETE FROM public.password_reset_tokens
  WHERE expires_at < now() OR used = true;
END;
$$;

-- Add comment explaining the function
COMMENT ON FUNCTION public.cleanup_expired_reset_tokens() IS 
'Removes expired or used password reset tokens. Should be called periodically via cron or manually.';

-- =====================================================
-- 7. FIX FUNCTION SECURITY - VALIDATE RESET TOKEN
-- =====================================================

-- Drop and recreate with secure search_path
DROP FUNCTION IF EXISTS public.validate_reset_token(text);

CREATE OR REPLACE FUNCTION public.validate_reset_token(reset_token text)
RETURNS TABLE(user_id uuid, is_valid boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    prt.user_id,
    (prt.expires_at > now() AND prt.used = false) as is_valid
  FROM public.password_reset_tokens prt
  WHERE prt.token = reset_token;
END;
$$;

-- Add comment explaining the function
COMMENT ON FUNCTION public.validate_reset_token(text) IS 
'Validates a password reset token and returns user_id and validity status. Used by password reset flow.';

-- =====================================================
-- 8. GRANT NECESSARY PERMISSIONS
-- =====================================================

-- Grant execute permissions on functions to authenticated users
GRANT EXECUTE ON FUNCTION public.validate_reset_token(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.validate_reset_token(text) TO anon;

-- Grant execute permission on cleanup function to service role only
GRANT EXECUTE ON FUNCTION public.cleanup_expired_reset_tokens() TO service_role;
REVOKE EXECUTE ON FUNCTION public.cleanup_expired_reset_tokens() FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.cleanup_expired_reset_tokens() FROM anon;

-- =====================================================
-- 9. ADD HELPFUL INDEXES (Keep all indexes - they're for future scale)
-- =====================================================

-- These indexes are marked as "unused" but will be valuable when the app scales
-- They're properly designed for the query patterns we expect:

-- idx_password_reset_tokens_token: Used in token validation (frequent operation)
-- idx_password_reset_tokens_expires_at: Used in cleanup operations
-- idx_password_reset_tokens_user_id: Used for user-specific queries
-- market_scanner_data_stock_id_idx: Used when filtering scanner data by stock
-- stocks_sector_idx: Used when filtering stocks by sector

-- No action needed - indexes are properly designed and will be used at scale

-- =====================================================
-- 10. SECURITY AUDIT LOG
-- =====================================================

-- Log this security update for audit purposes
DO $$
BEGIN
  RAISE NOTICE 'Security Update Applied: RLS policies optimized, function search paths secured, password reset tokens protected';
END $$;
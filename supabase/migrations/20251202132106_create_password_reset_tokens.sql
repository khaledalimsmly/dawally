/*
  # Password Reset Tokens Table

  1. New Tables
    - `password_reset_tokens`
      - `id` (uuid, primary key) - Unique identifier for each token
      - `user_id` (uuid, foreign key) - References auth.users(id)
      - `token` (text, unique) - Secure random token for password reset
      - `expires_at` (timestamptz) - Token expiration time (15 minutes from creation)
      - `created_at` (timestamptz) - Timestamp of token creation
      - `used` (boolean) - Whether token has been used

  2. Security
    - Enable RLS on `password_reset_tokens` table
    - No public SELECT access (tokens are sensitive)
    - Service role only can manage tokens
    - Tokens expire after 15 minutes
    - Tokens are single-use only

  3. Indexes
    - Index on `token` column for fast lookups
    - Index on `expires_at` for cleanup queries
    - Index on `user_id` for user-specific queries

  4. Important Notes
    - Tokens are generated using secure random methods
    - Expired tokens should be cleaned up periodically
    - Used tokens are marked but can be cleaned up after use
*/

-- Create password_reset_tokens table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token text UNIQUE NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  used boolean DEFAULT false
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires_at ON password_reset_tokens(expires_at);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);

-- Enable Row Level Security
ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;

-- No public policies - tokens should only be managed by Edge Functions using service role
-- This prevents users from reading or manipulating tokens directly

-- Create function to clean up expired tokens (can be called periodically)
CREATE OR REPLACE FUNCTION cleanup_expired_reset_tokens()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM password_reset_tokens
  WHERE expires_at < now() OR used = true;
END;
$$;

-- Create function to validate and use a reset token
CREATE OR REPLACE FUNCTION validate_reset_token(reset_token text)
RETURNS TABLE(user_id uuid, is_valid boolean)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    prt.user_id,
    (prt.expires_at > now() AND prt.used = false) as is_valid
  FROM password_reset_tokens prt
  WHERE prt.token = reset_token;
END;
$$;
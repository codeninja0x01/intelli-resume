-- Migration: Add isFirstTimeUser column to profiles table
-- Purpose: Track if user needs onboarding/welcome experience

-- Add the isFirstTimeUser column
ALTER TABLE profiles 
ADD COLUMN is_first_time_user BOOLEAN NOT NULL DEFAULT true;

-- Add comment for documentation
COMMENT ON COLUMN profiles.is_first_time_user IS 'Tracks whether user needs onboarding experience (true for first-time users)';

-- Create index for potential filtering by first-time users
CREATE INDEX idx_profiles_is_first_time_user ON profiles (is_first_time_user);

-- Update existing users to be non-first-time users (since they already exist)
-- You may want to comment this out if you want existing users to see onboarding
UPDATE profiles SET is_first_time_user = false WHERE created_at < NOW(); 
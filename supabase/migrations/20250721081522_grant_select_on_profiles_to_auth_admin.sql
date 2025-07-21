-- Grant select permission on user_profiles to supabase_auth_admin
-- This allows the custom_access_token_hook to read the user's role
GRANT SELECT ON TABLE public.user_profiles TO supabase_auth_admin;

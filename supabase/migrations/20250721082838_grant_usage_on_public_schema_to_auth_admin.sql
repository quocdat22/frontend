-- Grant usage on the public schema to supabase_auth_admin
-- This allows the auth hook to access objects within the public schema.
GRANT USAGE ON SCHEMA public TO supabase_auth_admin;

-- Create missing RPC functions that the application is calling

-- Function to check if a user is admin (wrapper around existing is_admin function)
CREATE OR REPLACE FUNCTION public.check_user_is_admin(check_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN public.is_admin(check_user_id);
END;
$$;

-- Function to get user profile with role
CREATE OR REPLACE FUNCTION public.get_user_profile_with_role(user_id uuid)
RETURNS TABLE(
  id uuid,
  email text,
  full_name text,
  avatar_url text,
  role user_role,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    up.id,
    up.email,
    up.full_name,
    up.avatar_url,
    up.role,
    up.created_at,
    up.updated_at
  FROM user_profiles up
  WHERE up.id = user_id;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.check_user_is_admin(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_user_is_admin(uuid) TO anon;

GRANT EXECUTE ON FUNCTION public.get_user_profile_with_role(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_profile_with_role(uuid) TO anon;
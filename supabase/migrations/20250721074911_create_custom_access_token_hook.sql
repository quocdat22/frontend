-- Create the function to add the user's role to the JWT access token
create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb
language plpgsql
stable
as $$
declare
  claims jsonb;
  user_role public.user_role; -- Use the existing enum type
begin
  -- Select the role from the user_profiles table
  select role into user_role from public.user_profiles
  where id = (event->>'user_id')::uuid limit 1;

  claims := event->'claims';

  -- Set the 'user_role' claim
  if user_role is not null then
    claims := jsonb_set(claims, '{user_role}', to_jsonb(user_role));
  else
    -- It's good practice to set it to null if not found
    claims := jsonb_set(claims, '{user_role}', 'null');
  end if;

  -- Update the event with the new claims
  event := jsonb_set(event, '{claims}', claims);

  return event;
end;
$$;

-- Grant execute permission on the function to the supabase_auth_admin role
grant execute on function public.custom_access_token_hook to supabase_auth_admin;

-- Grant usage on the user_role type to supabase_auth_admin
-- This is necessary for the function to execute correctly under the auth admin context
grant usage on type public.user_role to supabase_auth_admin;

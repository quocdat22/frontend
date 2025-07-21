-- Restore the original logic but add SECURITY DEFINER
-- This is the correct and robust way to handle permissions for auth hooks.
create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb
language plpgsql
security definer -- <<< THE CRUCIAL FIX
as $$
declare
  claims jsonb;
  user_role public.user_role;
begin
  -- Select the role from the user_profiles table
  select role into user_role from public.user_profiles
  where id = (event->>'user_id')::uuid limit 1;

  claims := event->'claims';

  -- Set the 'user_role' claim
  if user_role is not null then
    claims := jsonb_set(claims, '{user_role}', to_jsonb(user_role));
  else
    claims := jsonb_set(claims, '{user_role}', 'null');
  end if;

  -- Update the event with the new claims
  event := jsonb_set(event, '{claims}', claims);

  return event;
end;
$$;

-- Grant execute permission on the function to the supabase_auth_admin role
grant execute on function public.custom_access_token_hook to supabase_auth_admin;

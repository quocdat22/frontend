-- Overwrite the hook with a simplified version for diagnosis.
-- This version does NOT access the database and only adds a hardcoded claim.
-- This helps to isolate if the issue is with DB access or the hook mechanism itself.
create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb
language plpgsql
stable
as $$
declare
  claims jsonb;
begin
  claims := event->'claims';

  -- Add a hardcoded role for testing purposes
  claims := jsonb_set(claims, '{user_role}', '"test_role"');

  -- Update the event with the new claims
  event := jsonb_set(event, '{claims}', claims);

  return event;
end;
$$;

-- Allow authenticated users to read organization names/cities for marketplace discovery.
-- This fixes producer display names being masked as generic fallbacks in the mobile app.

drop policy if exists org_select on public.organizations;

create policy org_select on public.organizations
for select
using (auth.uid() is not null);

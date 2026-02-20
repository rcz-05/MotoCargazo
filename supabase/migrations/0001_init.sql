-- MotoCargo MVP core schema
create extension if not exists pgcrypto with schema extensions;
create extension if not exists citext with schema extensions;
create extension if not exists pg_cron with schema extensions;

create type public.user_role as enum ('restaurant', 'producer', 'admin');
create type public.organization_type as enum ('restaurant', 'producer', 'admin');
create type public.contract_status as enum ('draft', 'revision_requested', 'accepted', 'active', 'suspended', 'expired');
create type public.order_status as enum ('proposed', 'submitted', 'accepted_by_producer', 'preparing', 'out_for_delivery', 'delivered', 'cancelled');
create type public.invitation_status as enum ('pending', 'accepted', 'expired', 'revoked');
create type public.notification_channel as enum ('in_app', 'email', 'push');

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  legal_name text,
  type public.organization_type not null,
  city text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email extensions.citext unique not null,
  full_name text,
  preferred_locale text not null default 'es-ES',
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  organization_id uuid not null references public.organizations (id) on delete cascade,
  role public.user_role not null,
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  unique (user_id, organization_id, role)
);

create table public.city_zones (
  id uuid primary key default gen_random_uuid(),
  city text not null,
  zone_code text not null,
  zone_name text not null,
  low_emission_only boolean not null default false,
  max_vehicle_weight_kg numeric(10,2) not null default 3500,
  max_vehicle_height_cm numeric(10,2) not null default 220,
  restriction_notes text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (city, zone_code)
);

create table public.zone_rules (
  id uuid primary key default gen_random_uuid(),
  city_zone_id uuid not null references public.city_zones (id) on delete cascade,
  rule_type text not null check (rule_type in ('vehicle', 'time', 'permit')),
  rule_payload jsonb not null default '{}'::jsonb,
  enforced_from timestamptz not null default now(),
  enforced_until timestamptz,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.restaurants (
  id uuid primary key references public.organizations (id) on delete cascade,
  address text not null,
  postal_code text,
  city_zone_id uuid references public.city_zones (id),
  invoice_terms text not null default 'settlement_30d',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.producers (
  id uuid primary key references public.organizations (id) on delete cascade,
  address text,
  support_email text,
  support_phone text,
  rating numeric(3,2) not null default 4.8,
  average_delivery_fee_eur numeric(10,2) not null default 11.09,
  default_lead_time_hours integer not null default 24,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.producer_categories (
  id uuid primary key default gen_random_uuid(),
  producer_id uuid not null references public.producers (id) on delete cascade,
  category_code text not null check (category_code in ('meat', 'seafood', 'produce')),
  label_es text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (producer_id, category_code)
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  producer_id uuid not null references public.producers (id) on delete cascade,
  category_code text not null check (category_code in ('meat', 'seafood', 'produce')),
  name text not null,
  description text,
  unit text not null check (unit in ('kg', 'piece')),
  base_price_eur numeric(10,2) not null,
  image_url text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.delivery_windows (
  id uuid primary key default gen_random_uuid(),
  producer_id uuid not null references public.producers (id) on delete cascade,
  day_of_week integer not null check (day_of_week between 0 and 6),
  start_time time not null,
  end_time time not null,
  same_day_allowed boolean not null default true,
  next_day_allowed boolean not null default true,
  max_orders integer,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (producer_id, day_of_week, start_time, end_time)
);

create table public.vehicle_profiles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  label text not null,
  is_electric boolean not null default true,
  weight_kg numeric(10,2) not null,
  height_cm numeric(10,2) not null,
  plate_mask text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.contracts (
  id uuid primary key default gen_random_uuid(),
  producer_organization_id uuid not null references public.producers (id) on delete cascade,
  restaurant_organization_id uuid not null references public.restaurants (id) on delete cascade,
  status public.contract_status not null default 'draft',
  current_version integer not null default 1,
  active_from date,
  active_until date,
  created_by uuid references auth.users (id),
  updated_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.contract_versions (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid not null references public.contracts (id) on delete cascade,
  version_number integer not null,
  terms_json jsonb not null,
  change_note text,
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  unique (contract_id, version_number)
);

create table public.contract_acceptances (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid not null references public.contracts (id) on delete cascade,
  version_number integer not null,
  accepted_by_user_id uuid not null references auth.users (id) on delete cascade,
  acceptance_method text not null check (acceptance_method in ('in_app_checkbox', 'otp_email')),
  accepted_at timestamptz not null default now(),
  ip_address text,
  user_agent text,
  audit_payload jsonb not null default '{}'::jsonb
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid references public.contracts (id) on delete set null,
  producer_organization_id uuid not null references public.producers (id) on delete restrict,
  restaurant_organization_id uuid not null references public.restaurants (id) on delete restrict,
  status public.order_status not null default 'proposed',
  scheduled_delivery_start timestamptz not null,
  scheduled_delivery_end timestamptz not null,
  delivery_window_id uuid references public.delivery_windows (id) on delete set null,
  vehicle_profile_id uuid references public.vehicle_profiles (id) on delete set null,
  subtotal_eur numeric(12,2) not null default 0,
  delivery_fee_eur numeric(12,2) not null default 0,
  total_eur numeric(12,2) not null default 0,
  currency text not null default 'EUR',
  payment_mode text not null default 'invoice_settlement',
  invoice_status text not null default 'pending',
  compliance_snapshot jsonb not null default '{}'::jsonb,
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete restrict,
  quantity numeric(12,3) not null,
  unit text not null check (unit in ('kg', 'piece')),
  unit_price_eur numeric(12,2) not null,
  line_total_eur numeric(12,2) not null,
  notes text,
  created_at timestamptz not null default now()
);

create table public.order_events (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  previous_status public.order_status,
  next_status public.order_status not null,
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now()
);

create table public.recurring_plans (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid not null references public.contracts (id) on delete cascade,
  producer_organization_id uuid not null references public.producers (id) on delete cascade,
  restaurant_organization_id uuid not null references public.restaurants (id) on delete cascade,
  name text not null,
  cron_expression text not null,
  line_items jsonb not null,
  auto_confirm boolean not null default false,
  active boolean not null default true,
  last_run_at timestamptz,
  next_run_at timestamptz,
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_user_id uuid not null references auth.users (id) on delete cascade,
  organization_id uuid references public.organizations (id) on delete set null,
  channel public.notification_channel not null,
  event_type text not null,
  title text not null,
  body text not null,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'queued',
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.invitations (
  id uuid primary key default gen_random_uuid(),
  email extensions.citext not null,
  role public.user_role not null,
  organization_id uuid not null references public.organizations (id) on delete cascade,
  invited_by uuid references auth.users (id),
  token text not null unique default encode(gen_random_bytes(32), 'hex'),
  status public.invitation_status not null default 'pending',
  city text not null,
  expires_at timestamptz not null,
  accepted_at timestamptz,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested_role public.user_role;
  invite_row public.invitations%rowtype;
  new_org_id uuid;
  display_name text;
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do update
    set email = excluded.email,
        full_name = excluded.full_name,
        updated_at = now();

  requested_role := coalesce((new.raw_user_meta_data ->> 'requested_role')::public.user_role, 'restaurant');

  select *
  into invite_row
  from public.invitations i
  where lower(i.email::text) = lower(new.email)
    and i.role = requested_role
    and i.status = 'pending'
    and i.expires_at > now()
  order by i.created_at desc
  limit 1;

  if requested_role = 'producer' then
    if invite_row.id is null then
      raise exception 'producer_invitation_required';
    end if;

    insert into public.memberships (user_id, organization_id, role, is_primary)
    values (new.id, invite_row.organization_id, 'producer', true)
    on conflict (user_id, organization_id, role) do update
      set is_primary = true;

    update public.invitations
    set status = 'accepted',
        accepted_at = now()
    where id = invite_row.id;

    return new;
  end if;

  if requested_role = 'restaurant' then
    if invite_row.id is not null then
      insert into public.memberships (user_id, organization_id, role, is_primary)
      values (new.id, invite_row.organization_id, 'restaurant', true)
      on conflict (user_id, organization_id, role) do update
        set is_primary = true;

      update public.invitations
      set status = 'accepted',
          accepted_at = now()
      where id = invite_row.id;

      return new;
    end if;

    new_org_id := gen_random_uuid();
    display_name := coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1));

    insert into public.organizations (id, name, legal_name, type, city)
    values (
      new_org_id,
      format('Restaurante %s', display_name),
      format('Restaurante %s', display_name),
      'restaurant',
      'Sevilla'
    );

    insert into public.restaurants (id, address, postal_code)
    values (new_org_id, 'Dirección pendiente de completar', '41001');

    insert into public.memberships (user_id, organization_id, role, is_primary)
    values (new.id, new_org_id, 'restaurant', true)
    on conflict (user_id, organization_id, role) do update
      set is_primary = true;

    return new;
  end if;

  if requested_role = 'admin' then
    if invite_row.id is null then
      raise exception 'admin_invitation_required';
    end if;

    insert into public.memberships (user_id, organization_id, role, is_primary)
    values (new.id, invite_row.organization_id, 'admin', true)
    on conflict (user_id, organization_id, role) do update
      set is_primary = true;

    update public.invitations
    set status = 'accepted',
        accepted_at = now()
    where id = invite_row.id;
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create index idx_memberships_user on public.memberships (user_id);
create index idx_memberships_org on public.memberships (organization_id);
create index idx_products_producer on public.products (producer_id);
create index idx_products_category on public.products (category_code);
create index idx_delivery_windows_producer on public.delivery_windows (producer_id, day_of_week);
create index idx_contracts_restaurant on public.contracts (restaurant_organization_id, status);
create index idx_contracts_producer on public.contracts (producer_organization_id, status);
create unique index idx_contracts_one_active_pair
  on public.contracts (producer_organization_id, restaurant_organization_id)
  where status = 'active';
create index idx_orders_restaurant on public.orders (restaurant_organization_id, status, created_at desc);
create index idx_orders_producer on public.orders (producer_organization_id, status, created_at desc);
create index idx_order_events_order on public.order_events (order_id, created_at desc);
create index idx_recurring_plans_next_run on public.recurring_plans (active, next_run_at);
create index idx_notifications_recipient on public.notifications (recipient_user_id, created_at desc);
create index idx_invitations_email_status on public.invitations (email, status);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_organizations_updated_at before update on public.organizations for each row execute function public.set_updated_at();
create trigger trg_profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger trg_restaurants_updated_at before update on public.restaurants for each row execute function public.set_updated_at();
create trigger trg_producers_updated_at before update on public.producers for each row execute function public.set_updated_at();
create trigger trg_products_updated_at before update on public.products for each row execute function public.set_updated_at();
create trigger trg_vehicle_profiles_updated_at before update on public.vehicle_profiles for each row execute function public.set_updated_at();
create trigger trg_contracts_updated_at before update on public.contracts for each row execute function public.set_updated_at();
create trigger trg_orders_updated_at before update on public.orders for each row execute function public.set_updated_at();
create trigger trg_recurring_plans_updated_at before update on public.recurring_plans for each row execute function public.set_updated_at();
create trigger trg_city_zones_updated_at before update on public.city_zones for each row execute function public.set_updated_at();

create or replace function public.is_member(org_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.memberships m
    where m.organization_id = org_id
      and m.user_id = auth.uid()
  );
$$;

create or replace function public.has_role(required_role public.user_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.memberships m
    where m.user_id = auth.uid()
      and m.role = required_role
  );
$$;

create or replace function public.can_access_contract(contract_ref uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.contracts c
    where c.id = contract_ref
      and (public.is_member(c.producer_organization_id) or public.is_member(c.restaurant_organization_id))
  );
$$;

create or replace function public.can_access_order(order_ref uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.orders o
    where o.id = order_ref
      and (public.is_member(o.producer_organization_id) or public.is_member(o.restaurant_organization_id))
  );
$$;

create or replace function public.is_valid_order_transition(from_status public.order_status, to_status public.order_status)
returns boolean
language sql
immutable
as $$
  select case
    when from_status = to_status then true
    when from_status = 'proposed' and to_status in ('submitted', 'cancelled') then true
    when from_status = 'submitted' and to_status in ('accepted_by_producer', 'cancelled') then true
    when from_status = 'accepted_by_producer' and to_status in ('preparing', 'cancelled') then true
    when from_status = 'preparing' and to_status in ('out_for_delivery', 'cancelled') then true
    when from_status = 'out_for_delivery' and to_status in ('delivered', 'cancelled') then true
    else false
  end;
$$;

create or replace function public.enforce_order_transition()
returns trigger
language plpgsql
as $$
begin
  if old.status is distinct from new.status then
    if not public.is_valid_order_transition(old.status, new.status) then
      raise exception 'Invalid order transition from % to %', old.status, new.status;
    end if;

    insert into public.order_events (order_id, previous_status, next_status, event_type, payload, created_by)
    values (
      old.id,
      old.status,
      new.status,
      'status_transition',
      jsonb_build_object('from', old.status, 'to', new.status),
      auth.uid()
    );
  end if;

  return new;
end;
$$;

create trigger trg_orders_transition
before update on public.orders
for each row
execute function public.enforce_order_transition();

create or replace function public.validate_delivery_compliance(
  producer_id_input uuid,
  restaurant_id_input uuid,
  delivery_window_id_input uuid,
  vehicle_profile_id_input uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_zone public.city_zones%rowtype;
  v_vehicle public.vehicle_profiles%rowtype;
  v_delivery_window public.delivery_windows%rowtype;
  v_reasons text[] := array[]::text[];
  v_fallback_slots jsonb := '[]'::jsonb;
  v_alternate_producers jsonb := '[]'::jsonb;
  v_is_compliant boolean := true;
begin
  select cz.*
    into v_zone
  from public.restaurants r
  join public.city_zones cz on cz.id = r.city_zone_id
  where r.id = restaurant_id_input;

  select *
    into v_vehicle
  from public.vehicle_profiles
  where id = vehicle_profile_id_input
    and active = true;

  select *
    into v_delivery_window
  from public.delivery_windows
  where id = delivery_window_id_input
    and producer_id = producer_id_input
    and active = true;

  if v_zone.id is null then
    v_reasons := array_append(v_reasons, 'No se encontró zona de entrega para el restaurante.');
    v_is_compliant := false;
  end if;

  if v_delivery_window.id is null then
    v_reasons := array_append(v_reasons, 'La franja horaria seleccionada no está disponible para este proveedor.');
    v_is_compliant := false;
  end if;

  if v_vehicle.id is null then
    v_reasons := array_append(v_reasons, 'No se encontró un perfil de vehículo válido.');
    v_is_compliant := false;
  else
    if v_zone.id is not null and v_vehicle.weight_kg > v_zone.max_vehicle_weight_kg then
      v_reasons := array_append(v_reasons, format('El peso del vehículo (%.2f kg) supera el límite de la zona (%.2f kg).', v_vehicle.weight_kg, v_zone.max_vehicle_weight_kg));
      v_is_compliant := false;
    end if;

    if v_zone.id is not null and v_vehicle.height_cm > v_zone.max_vehicle_height_cm then
      v_reasons := array_append(v_reasons, format('La altura del vehículo (%.2f cm) supera el límite de la zona (%.2f cm).', v_vehicle.height_cm, v_zone.max_vehicle_height_cm));
      v_is_compliant := false;
    end if;

    if v_zone.id is not null and v_zone.low_emission_only and not v_vehicle.is_electric then
      v_reasons := array_append(v_reasons, 'La zona seleccionada solo permite vehículos de bajas emisiones.');
      v_is_compliant := false;
    end if;
  end if;

  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'slotId', dw.id,
        'startAt', (
          date_trunc('day', now())
          + (((dw.day_of_week - extract(dow from now())::int + 7) % 7) || ' days')::interval
          + dw.start_time
        ),
        'endAt', (
          date_trunc('day', now())
          + (((dw.day_of_week - extract(dow from now())::int + 7) % 7) || ' days')::interval
          + dw.end_time
        ),
        'reason', 'Franja alternativa válida para la zona y el proveedor.'
      )
    ),
    '[]'::jsonb
  )
  into v_fallback_slots
  from (
    select dw.*
    from public.delivery_windows dw
    where dw.producer_id = producer_id_input
      and dw.active = true
    order by dw.day_of_week asc, dw.start_time asc
    limit 3
  ) dw;

  select coalesce(
    jsonb_agg(org.id),
    '[]'::jsonb
  )
  into v_alternate_producers
  from public.organizations org
  join public.producers p on p.id = org.id
  where org.type = 'producer'
    and org.is_active = true
    and org.city = (select city from public.organizations where id = restaurant_id_input)
    and p.id <> producer_id_input
  limit 3;

  return jsonb_build_object(
    'isCompliant', v_is_compliant,
    'reasons', to_jsonb(v_reasons),
    'fallbackSlots', v_fallback_slots,
    'alternateProducerIds', v_alternate_producers
  );
end;
$$;

create or replace function public.generate_recurring_orders(plan_filter uuid default null)
returns table(plan_id uuid, order_id uuid, generated_status text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_plan record;
  v_item record;
  v_order_id uuid;
  v_status public.order_status;
  v_subtotal numeric(12,2);
  v_delivery_fee numeric(12,2);
  v_line_total numeric(12,2);
  v_product_price numeric(12,2);
  v_now timestamptz := now();
begin
  for v_plan in
    select rp.*
    from public.recurring_plans rp
    where rp.active = true
      and (plan_filter is null or rp.id = plan_filter)
      and (rp.next_run_at is null or rp.next_run_at <= v_now)
    order by rp.next_run_at nulls first
  loop
    v_status := case when v_plan.auto_confirm then 'submitted'::public.order_status else 'proposed'::public.order_status end;
    v_subtotal := 0;
    v_delivery_fee := 0;

    insert into public.orders (
      contract_id,
      producer_organization_id,
      restaurant_organization_id,
      status,
      scheduled_delivery_start,
      scheduled_delivery_end,
      subtotal_eur,
      delivery_fee_eur,
      total_eur,
      compliance_snapshot
    )
    values (
      v_plan.contract_id,
      v_plan.producer_organization_id,
      v_plan.restaurant_organization_id,
      v_status,
      coalesce(v_plan.next_run_at, v_now + interval '1 day'),
      coalesce(v_plan.next_run_at, v_now + interval '1 day') + interval '2 hour',
      0,
      0,
      0,
      jsonb_build_object('source', 'recurring_plan', 'planId', v_plan.id)
    )
    returning id into v_order_id;

    for v_item in
      select *
      from jsonb_to_recordset(v_plan.line_items) as x(product_id uuid, quantity numeric, unit text)
    loop
      select p.base_price_eur
      into v_product_price
      from public.products p
      where p.id = v_item.product_id
        and p.active = true;

      if v_product_price is null then
        continue;
      end if;

      v_line_total := round((v_product_price * v_item.quantity)::numeric, 2);
      v_subtotal := v_subtotal + v_line_total;

      insert into public.order_items (
        order_id,
        product_id,
        quantity,
        unit,
        unit_price_eur,
        line_total_eur
      )
      values (
        v_order_id,
        v_item.product_id,
        v_item.quantity,
        v_item.unit,
        v_product_price,
        v_line_total
      );
    end loop;

    update public.orders
    set subtotal_eur = v_subtotal,
        delivery_fee_eur = v_delivery_fee,
        total_eur = v_subtotal + v_delivery_fee
    where id = v_order_id;

    insert into public.order_events (
      order_id,
      previous_status,
      next_status,
      event_type,
      payload,
      created_by
    )
    values (
      v_order_id,
      null,
      v_status,
      'recurring_generated',
      jsonb_build_object('planId', v_plan.id, 'autoConfirm', v_plan.auto_confirm),
      v_plan.created_by
    );

    update public.recurring_plans
    set last_run_at = v_now,
        next_run_at = coalesce(v_plan.next_run_at, v_now) + interval '1 day'
    where id = v_plan.id;

    plan_id := v_plan.id;
    order_id := v_order_id;
    generated_status := v_status::text;
    return next;
  end loop;

  return;
end;
$$;

-- RLS
alter table public.organizations enable row level security;
alter table public.profiles enable row level security;
alter table public.memberships enable row level security;
alter table public.city_zones enable row level security;
alter table public.zone_rules enable row level security;
alter table public.restaurants enable row level security;
alter table public.producers enable row level security;
alter table public.producer_categories enable row level security;
alter table public.products enable row level security;
alter table public.delivery_windows enable row level security;
alter table public.vehicle_profiles enable row level security;
alter table public.contracts enable row level security;
alter table public.contract_versions enable row level security;
alter table public.contract_acceptances enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_events enable row level security;
alter table public.recurring_plans enable row level security;
alter table public.notifications enable row level security;
alter table public.invitations enable row level security;

create policy org_select on public.organizations for select using (public.is_member(id) or has_role('admin'));
create policy org_insert on public.organizations for insert with check (has_role('admin'));
create policy org_update on public.organizations for update using (has_role('admin')) with check (has_role('admin'));

create policy profile_select on public.profiles for select using (id = auth.uid() or has_role('admin'));
create policy profile_insert on public.profiles for insert with check (id = auth.uid() or has_role('admin'));
create policy profile_update on public.profiles for update using (id = auth.uid() or has_role('admin')) with check (id = auth.uid() or has_role('admin'));

create policy memberships_select on public.memberships for select using (user_id = auth.uid() or has_role('admin') or public.is_member(organization_id));
create policy memberships_insert on public.memberships for insert with check (has_role('admin'));
create policy memberships_update on public.memberships for update using (has_role('admin')) with check (has_role('admin'));

create policy city_zones_select on public.city_zones for select using (auth.uid() is not null);
create policy zone_rules_select on public.zone_rules for select using (auth.uid() is not null);
create policy zone_rules_manage on public.zone_rules for all using (has_role('admin')) with check (has_role('admin'));

create policy restaurants_select on public.restaurants for select using (public.is_member(id) or has_role('admin'));
create policy restaurants_update on public.restaurants for update using (public.is_member(id) or has_role('admin')) with check (public.is_member(id) or has_role('admin'));

create policy producers_select on public.producers for select using (auth.uid() is not null);
create policy producers_update on public.producers for update using (public.is_member(id) or has_role('admin')) with check (public.is_member(id) or has_role('admin'));

create policy producer_categories_select on public.producer_categories for select using (auth.uid() is not null);
create policy producer_categories_manage on public.producer_categories for all using (public.is_member(producer_id) or has_role('admin')) with check (public.is_member(producer_id) or has_role('admin'));

create policy products_select on public.products for select using (active = true or public.is_member(producer_id) or has_role('admin'));
create policy products_manage on public.products for all using (public.is_member(producer_id) or has_role('admin')) with check (public.is_member(producer_id) or has_role('admin'));

create policy delivery_windows_select on public.delivery_windows for select using (auth.uid() is not null);
create policy delivery_windows_manage on public.delivery_windows for all using (public.is_member(producer_id) or has_role('admin')) with check (public.is_member(producer_id) or has_role('admin'));

create policy vehicle_profiles_select on public.vehicle_profiles for select using (public.is_member(organization_id) or has_role('admin'));
create policy vehicle_profiles_manage on public.vehicle_profiles for all using (public.is_member(organization_id) or has_role('admin')) with check (public.is_member(organization_id) or has_role('admin'));

create policy contracts_select on public.contracts for select using (
  public.is_member(producer_organization_id)
  or public.is_member(restaurant_organization_id)
  or has_role('admin')
);
create policy contracts_insert on public.contracts for insert with check (
  public.is_member(producer_organization_id)
  or has_role('admin')
);
create policy contracts_update on public.contracts for update using (
  public.is_member(producer_organization_id)
  or public.is_member(restaurant_organization_id)
  or has_role('admin')
) with check (
  public.is_member(producer_organization_id)
  or public.is_member(restaurant_organization_id)
  or has_role('admin')
);

create policy contract_versions_select on public.contract_versions for select using (public.can_access_contract(contract_id) or has_role('admin'));
create policy contract_versions_insert on public.contract_versions for insert with check (public.can_access_contract(contract_id) or has_role('admin'));

create policy contract_acceptances_select on public.contract_acceptances for select using (public.can_access_contract(contract_id) or has_role('admin'));
create policy contract_acceptances_insert on public.contract_acceptances for insert with check (accepted_by_user_id = auth.uid() or has_role('admin'));

create policy orders_select on public.orders for select using (
  public.is_member(producer_organization_id)
  or public.is_member(restaurant_organization_id)
  or has_role('admin')
);
create policy orders_insert on public.orders for insert with check (
  public.is_member(restaurant_organization_id)
  or has_role('admin')
);
create policy orders_update on public.orders for update using (
  public.is_member(producer_organization_id)
  or public.is_member(restaurant_organization_id)
  or has_role('admin')
) with check (
  public.is_member(producer_organization_id)
  or public.is_member(restaurant_organization_id)
  or has_role('admin')
);

create policy order_items_select on public.order_items for select using (public.can_access_order(order_id) or has_role('admin'));
create policy order_items_insert on public.order_items for insert with check (public.can_access_order(order_id) or has_role('admin'));
create policy order_items_update on public.order_items for update using (public.can_access_order(order_id) or has_role('admin')) with check (public.can_access_order(order_id) or has_role('admin'));

create policy order_events_select on public.order_events for select using (public.can_access_order(order_id) or has_role('admin'));
create policy order_events_insert on public.order_events for insert with check (public.can_access_order(order_id) or has_role('admin'));

create policy recurring_plans_select on public.recurring_plans for select using (
  public.is_member(producer_organization_id)
  or public.is_member(restaurant_organization_id)
  or has_role('admin')
);
create policy recurring_plans_manage on public.recurring_plans for all using (
  public.is_member(restaurant_organization_id)
  or has_role('admin')
) with check (
  public.is_member(restaurant_organization_id)
  or has_role('admin')
);

create policy notifications_select on public.notifications for select using (recipient_user_id = auth.uid() or has_role('admin'));
create policy notifications_insert on public.notifications for insert with check (has_role('admin') or auth.uid() is not null);
create policy notifications_update on public.notifications for update using (recipient_user_id = auth.uid() or has_role('admin')) with check (recipient_user_id = auth.uid() or has_role('admin'));

create policy invitations_select on public.invitations for select using (
  public.is_member(organization_id)
  or has_role('admin')
  or lower(email::text) = lower(coalesce(auth.jwt() ->> 'email', ''))
);
create policy invitations_insert on public.invitations for insert with check (has_role('admin') or public.is_member(organization_id));
create policy invitations_update on public.invitations for update using (has_role('admin') or public.is_member(organization_id)) with check (has_role('admin') or public.is_member(organization_id));

-- recurring cron registration
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    IF NOT EXISTS (
      SELECT 1
      FROM cron.job
      WHERE jobname = 'motocargo_generate_recurring'
    ) THEN
      PERFORM cron.schedule(
        'motocargo_generate_recurring',
        '0 5 * * *',
        $job$select public.generate_recurring_orders(null);$job$
      );
    END IF;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'pg_cron registration skipped: %', SQLERRM;
END;
$$;

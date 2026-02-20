-- Seville-first seed dataset for MotoCargo MVP

-- Organizations
insert into public.organizations (id, name, legal_name, type, city)
values
  ('11111111-1111-1111-1111-111111111111', 'Tu Restaurante', 'Tu Restaurante S.L.', 'restaurant', 'Sevilla'),
  ('22222222-2222-2222-2222-222222222222', 'Carnicería EL ORIGEN', 'Carnicería EL ORIGEN S.L.', 'producer', 'Sevilla'),
  ('33333333-3333-3333-3333-333333333333', 'Carnicería Almansa', 'Almansa Cárnicas S.L.', 'producer', 'Sevilla'),
  ('44444444-4444-4444-4444-444444444444', 'Pescadería Julia', 'Pescadería Julia S.L.', 'producer', 'Sevilla'),
  ('99999999-9999-9999-9999-999999999999', 'MotoCargo Admin', 'MotoCargo Operations S.L.', 'admin', 'Sevilla')
on conflict (id) do nothing;

insert into public.city_zones (
  id,
  city,
  zone_code,
  zone_name,
  low_emission_only,
  max_vehicle_weight_kg,
  max_vehicle_height_cm,
  restriction_notes
)
values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'Sevilla', 'CASCO_ANTIGUO', 'Casco Antiguo', true, 3500, 220, 'Acceso restringido con prioridad a vehículos de bajas emisiones.'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'Sevilla', 'NERVION', 'Nervión', false, 7500, 250, 'Sin restricciones especiales para reparto ligero.'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'Sevilla', 'TRIANA', 'Triana', true, 3500, 220, 'Control por franjas horarias en horario de alta afluencia.')
on conflict (id) do nothing;

insert into public.zone_rules (id, city_zone_id, rule_type, rule_payload)
values
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'vehicle',
    '{"requiresElectric": true, "maxWeightKg": 3500, "maxHeightCm": 220}'::jsonb
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3',
    'time',
    '{"blockedHours": ["13:00-16:00"], "reason": "Alta densidad turística"}'::jsonb
  )
on conflict (id) do nothing;

insert into public.restaurants (id, address, postal_code, city_zone_id, invoice_terms)
values
  (
    '11111111-1111-1111-1111-111111111111',
    'Pje. de Vila, 8, Casco Antiguo, 41004 Sevilla',
    '41004',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'settlement_30d'
  )
on conflict (id) do nothing;

insert into public.producers (id, address, support_email, support_phone, rating, average_delivery_fee_eur, default_lead_time_hours)
values
  (
    '22222222-2222-2222-2222-222222222222',
    'Mercasevilla, Nave 12, Sevilla',
    'pedidos@elorigen.es',
    '+34 954 111 111',
    4.80,
    11.09,
    24
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'Polígono Store, Sevilla',
    'ventas@almansa.es',
    '+34 954 222 222',
    4.70,
    12.50,
    24
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    'Mercado de Triana, Sevilla',
    'hola@pescaderiajulia.es',
    '+34 954 333 333',
    4.90,
    9.90,
    12
  )
on conflict (id) do nothing;

insert into public.producer_categories (id, producer_id, category_code, label_es)
values
  ('cccccccc-cccc-cccc-cccc-cccccccccc01', '22222222-2222-2222-2222-222222222222', 'meat', 'Carnicerías'),
  ('cccccccc-cccc-cccc-cccc-cccccccccc02', '33333333-3333-3333-3333-333333333333', 'meat', 'Carnicerías'),
  ('cccccccc-cccc-cccc-cccc-cccccccccc03', '44444444-4444-4444-4444-444444444444', 'seafood', 'Pescaderías')
on conflict (id) do nothing;

insert into public.products (
  id,
  producer_id,
  category_code,
  name,
  description,
  unit,
  base_price_eur,
  image_url
)
values
  (
    'dddddddd-dddd-dddd-dddd-dddddddddd01',
    '22222222-2222-2222-2222-222222222222',
    'meat',
    'Paleta Iberica (Pieza de 5KG)',
    'Se obtiene las patas delanteras del cerdo, con un sabor intenso y textura firme.',
    'piece',
    160.00,
    'https://images.unsplash.com/photo-1615937691194-97dbd3f3dc29?auto=format&fit=crop&w=800&q=80'
  ),
  (
    'dddddddd-dddd-dddd-dddd-dddddddddd02',
    '22222222-2222-2222-2222-222222222222',
    'meat',
    'Cinta Lomo',
    'Cerdo ibérico para restaurantes de alta rotación.',
    'kg',
    21.90,
    'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=800&q=80'
  ),
  (
    'dddddddd-dddd-dddd-dddd-dddddddddd03',
    '22222222-2222-2222-2222-222222222222',
    'meat',
    'Entrecot',
    'Ternera premium de corte grueso.',
    'kg',
    24.90,
    'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80'
  ),
  (
    'dddddddd-dddd-dddd-dddd-dddddddddd04',
    '33333333-3333-3333-3333-333333333333',
    'meat',
    'Chuleta Premium',
    'Corte premium para parrilla.',
    'kg',
    29.90,
    'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=800&q=80'
  ),
  (
    'dddddddd-dddd-dddd-dddd-dddddddddd05',
    '44444444-4444-4444-4444-444444444444',
    'seafood',
    'Gamba Blanca',
    'Marisco fresco para cocina mediterránea.',
    'kg',
    26.00,
    'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=80'
  )
on conflict (id) do nothing;

insert into public.delivery_windows (
  id,
  producer_id,
  day_of_week,
  start_time,
  end_time,
  same_day_allowed,
  next_day_allowed,
  max_orders
)
values
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee01', '22222222-2222-2222-2222-222222222222', 1, '06:00', '08:00', true, true, 30),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee02', '22222222-2222-2222-2222-222222222222', 2, '06:00', '08:00', true, true, 30),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee03', '22222222-2222-2222-2222-222222222222', 3, '06:00', '08:00', true, true, 30),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee04', '33333333-3333-3333-3333-333333333333', 1, '07:00', '09:00', true, true, 20),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee05', '44444444-4444-4444-4444-444444444444', 1, '05:30', '07:30', true, true, 15)
on conflict (id) do nothing;

insert into public.vehicle_profiles (
  id,
  organization_id,
  label,
  is_electric,
  weight_kg,
  height_cm,
  plate_mask
)
values
  (
    'ffffffff-ffff-ffff-ffff-fffffffffff1',
    '11111111-1111-1111-1111-111111111111',
    'Furgoneta eléctrica ligera',
    true,
    2800,
    205,
    '0000-XXX'
  ),
  (
    'ffffffff-ffff-ffff-ffff-fffffffffff2',
    '11111111-1111-1111-1111-111111111111',
    'Camión diésel mediano',
    false,
    5200,
    245,
    '1111-YYY'
  )
on conflict (id) do nothing;

insert into public.invitations (
  id,
  email,
  role,
  organization_id,
  city,
  expires_at,
  status
)
values
  (
    'abababab-abab-abab-abab-ababababab00',
    'restaurante-demo@motocargo.es',
    'restaurant',
    '11111111-1111-1111-1111-111111111111',
    'Sevilla',
    now() + interval '30 day',
    'pending'
  ),
  (
    'abababab-abab-abab-abab-ababababab01',
    'proveedor-demo@motocargo.es',
    'producer',
    '22222222-2222-2222-2222-222222222222',
    'Sevilla',
    now() + interval '15 day',
    'pending'
  )
on conflict (id) do nothing;

insert into public.contracts (
  id,
  producer_organization_id,
  restaurant_organization_id,
  status,
  current_version,
  active_from,
  active_until
)
values
  (
    '12345678-1111-2222-3333-1234567890ab',
    '22222222-2222-2222-2222-222222222222',
    '11111111-1111-1111-1111-111111111111',
    'active',
    1,
    current_date,
    current_date + interval '180 day'
  ),
  (
    '12345678-1111-2222-3333-1234567890ac',
    '33333333-3333-3333-3333-333333333333',
    '11111111-1111-1111-1111-111111111111',
    'active',
    1,
    current_date,
    current_date + interval '180 day'
  ),
  (
    '12345678-1111-2222-3333-1234567890ad',
    '44444444-4444-4444-4444-444444444444',
    '11111111-1111-1111-1111-111111111111',
    'active',
    1,
    current_date,
    current_date + interval '180 day'
  )
on conflict (id) do nothing;

insert into public.contract_versions (
  id,
  contract_id,
  version_number,
  terms_json,
  change_note
)
values
  (
    '12345678-aaaa-bbbb-cccc-1234567890ab',
    '12345678-1111-2222-3333-1234567890ab',
    1,
    '{
      "minimumOrderValueEur": 150,
      "minimumOrderWeightKg": 10,
      "leadTimeHours": 24,
      "defaultDeliveryFeeEur": 11.09,
      "cutOffTimeLocal": "17:00",
      "deliveryWindowIds": ["eeeeeeee-eeee-eeee-eeee-eeeeeeeeee01"],
      "serviceZoneIds": ["aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1"],
      "productPriceOverrides": [
        {
          "productId": "dddddddd-dddd-dddd-dddd-dddddddddd01",
          "negotiatedUnitPriceEur": 160,
          "minimumQuantity": 1
        }
      ],
      "cancellationWindowMinutes": 120
    }'::jsonb,
    'Contrato inicial del piloto Seville v1'
  ),
  (
    '12345678-aaaa-bbbb-cccc-1234567890ac',
    '12345678-1111-2222-3333-1234567890ac',
    1,
    '{
      "minimumOrderValueEur": 120,
      "minimumOrderWeightKg": 8,
      "leadTimeHours": 24,
      "defaultDeliveryFeeEur": 12.5,
      "cutOffTimeLocal": "17:30",
      "deliveryWindowIds": ["eeeeeeee-eeee-eeee-eeee-eeeeeeeeee04"],
      "serviceZoneIds": ["aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1", "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2"],
      "cancellationWindowMinutes": 120
    }'::jsonb,
    'Contrato activo para Carnicería Almansa'
  ),
  (
    '12345678-aaaa-bbbb-cccc-1234567890ad',
    '12345678-1111-2222-3333-1234567890ad',
    1,
    '{
      "minimumOrderValueEur": 90,
      "minimumOrderWeightKg": 5,
      "leadTimeHours": 12,
      "defaultDeliveryFeeEur": 9.9,
      "cutOffTimeLocal": "18:00",
      "deliveryWindowIds": ["eeeeeeee-eeee-eeee-eeee-eeeeeeeeee05"],
      "serviceZoneIds": ["aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1", "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3"],
      "cancellationWindowMinutes": 120
    }'::jsonb,
    'Contrato activo para Pescadería Julia'
  )
on conflict (id) do nothing;

insert into public.recurring_plans (
  id,
  contract_id,
  producer_organization_id,
  restaurant_organization_id,
  name,
  cron_expression,
  line_items,
  auto_confirm,
  active,
  next_run_at
)
values
  (
    'fedcbafe-1111-2222-3333-fedcbafedcba',
    '12345678-1111-2222-3333-1234567890ab',
    '22222222-2222-2222-2222-222222222222',
    '11111111-1111-1111-1111-111111111111',
    'Reabastecimiento semanal de carne',
    '0 6 * * 1',
    '[
      {"product_id": "dddddddd-dddd-dddd-dddd-dddddddddd01", "quantity": 1, "unit": "piece"},
      {"product_id": "dddddddd-dddd-dddd-dddd-dddddddddd02", "quantity": 2, "unit": "kg"}
    ]'::jsonb,
    false,
    true,
    now() + interval '1 day'
  )
on conflict (id) do nothing;

# MotoCargo Demo Accounts

These accounts are created in local Supabase and can be used to test role-based flows in Expo Go.

## Credentials

- `restaurante-demo@motocargo.es`
  - Password: `MotoCargoDemo!2026`
  - Role: `restaurant`
  - Linked to seeded restaurant org with active contract data.
- `proveedor-demo@motocargo.es`
  - Password: `MotoCargoDemo!2026`
  - Role: `producer`
  - Linked through invitation flow to seeded producer org.

## Create / refresh accounts

From repo root:

```bash
cd /Users/rayancastillazouine/MotoCargazo
npm run seed:demo-users
```

If you reset the DB, run this again after `supabase db reset`.

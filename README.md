# MotoCargo MVP

MotoCargo is a B2B procurement and logistics MVP for restaurants and produce providers in Seville, Spain.

The mobile app now defaults to a public restaurant demo mode. It launches without login and runs the ordering flow entirely on curated demo data unless you explicitly switch `EXPO_PUBLIC_APP_MODE=live`.

## Monorepo

- `apps/mobile`: Expo React Native app for restaurants and producers
- `apps/admin`: Next.js admin panel for invites, city rules, and catalog operations
- `packages/types`: Shared domain types and Zod schemas
- `supabase`: SQL migrations, seed data, RLS policies, and Edge Functions

## Prerequisites

- Node.js 20+
- npm 10+
- Supabase CLI

## Quick Start

```bash
npm install
npm run dev:mobile
npm run dev:admin
```

Create `.env` from `.env.example` and set:

- `EXPO_PUBLIC_APP_MODE` (`demo` by default, use `live` only when wiring a real backend)
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## Database Setup

```bash
supabase start
supabase db reset
```

## Supabase Edge Functions

Edge functions live under `supabase/functions`:

- `contracts-create-draft`
- `contracts-request-revision`
- `contracts-accept`
- `orders-validate-compliance`
- `orders-checkout`
- `orders-generate-recurring`
- `notifications-dispatch`

Invoke locally with Supabase CLI after `supabase start`.

## Key Product Scope

- Role-based auth for restaurants and producers
- Contract lifecycle: draft, revision request, acceptance and activation
- Order lifecycle with compliance validation and recurring plan automation
- Seville-specific city rules and delivery constraints
- Admin panel for invitations, city rules, producers, contracts and orders

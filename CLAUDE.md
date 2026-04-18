# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Product

Fauna — platform for animal conservation projects. Visitors browse projects by species/biome/country, read progress updates, and donate via Stripe. Organizations register, get verified, and post projects + updates. Admins moderate everything. UI copy is primarily Portuguese (pt-BR) with an i18n layer for other languages.

## Commands

```bash
npm run dev     # next dev — http://localhost:3000
npm run build   # next build (also runs TS typecheck via next)
npm run start   # serve the built app
npm run lint    # next lint (eslint-config-next)
```

No test runner is configured. There's no Dockerfile or `railway.toml` yet — deploy target in the README is Vercel, but see CLAUDE.md global prefs for Railway.

## Environment

`.env.local` (copy from `.env.local.example`):

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — required
- `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET` — required for the donation + shop flows

To apply the schema, paste [supabase/migrations/001_schema.sql](supabase/migrations/001_schema.sql) into the Supabase SQL Editor. There's no migration CLI wired up — edits to the schema are manual SQL against the hosted project.

## Architecture

Next.js 14 App Router, TypeScript strict, Tailwind. Path alias `@/*` → `./src/*`.

### Auth + routing

Supabase auth is wired through three clients that must stay in sync:

- [src/lib/supabase/client.ts](src/lib/supabase/client.ts) — browser (`createBrowserClient`)
- [src/lib/supabase/server.ts](src/lib/supabase/server.ts) — server components / route handlers (`createServerClient` + `cookies()`)
- [src/middleware.ts](src/middleware.ts) — refreshes the session cookie on every request AND enforces route guards

The middleware is the single source of truth for route protection. It only matches `/admin/:path*` and `/org/:path*`:

- `/admin/*` → requires a session **and** `profiles.role = 'admin'`
- `/org/*` → requires a session **and** a row in `organizations` with `user_id = auth.uid()` (otherwise redirects to `/organizacoes/cadastro`)

The three roles (`donor` | `organization` | `admin`) live on `public.profiles.role`. A new `auth.users` row auto-creates its `profiles` row via the `handle_new_user()` trigger.

### Data model

All tables defined in [supabase/migrations/001_schema.sql](supabase/migrations/001_schema.sql):

- `profiles` (1:1 with `auth.users`) — role is the authorization anchor
- `organizations` (1:1 with a profile via `user_id`) — unique `slug`, `verified` flag
- `projects` (N:1 with organization) — unique `slug`, holds `goal_amount`/`raised_amount`, lat/lng for the map, `tags[]`, `biome`, `species`, `currency`
- `updates` — feed posts attached to a project
- `donations` — insertable by anyone; readable only by the donor themself
- `collaborations` — `project_ids uuid[]` for multi-project partnerships

**RLS is on** for every table. Public-read policies cover projects/updates/organizations/collaborations; writes are gated by ownership checks (`user_id = auth.uid()` or a join to `organizations`). Keep this in mind when adding new columns or tables — you must author the policies explicitly or inserts will fail silently from the client.

### Donation flow (Stripe)

Donations go through a PaymentIntent with Stripe Connect (`transfer_data.destination = org.stripe_account_id`) so funds land in the organization's Connect account, not on the platform:

1. `POST /api/donations/create` creates a PaymentIntent and returns its `client_secret` ([route.ts](src/app/api/donations/create/route.ts))
2. The browser confirms the payment via Stripe Elements / `stripe.confirmPayment` ([DonationForm.tsx](src/components/DonationForm.tsx))
3. `POST /api/stripe/webhook` receives `payment_intent.succeeded`, inserts the `donations` row from the intent's metadata, and the `on_donation_created` SQL trigger recomputes `projects.raised_amount` ([route.ts](src/app/api/stripe/webhook/route.ts))

Idempotency: the webhook looks up `donations.stripe_payment_intent_id` before inserting, and the column has a `UNIQUE` constraint ([002_schema_drift_fixes.sql](supabase/migrations/002_schema_drift_fixes.sql)) so Stripe retries don't double-post.

Additional Stripe surface: `/api/stripe/connect` (onboarding org accounts for payouts) and `/api/stripe/shop-checkout` (store items).

### Dashboards

- `/admin/(dashboard)` — [layout.tsx](src/app/admin/(dashboard)/layout.tsx) with sections: `organizations`, `projects`, `updates`, `donations`, `users`. Gated by middleware (admin role).
- `/org/(dashboard)` — [layout.tsx](src/app/org/(dashboard)/layout.tsx) with `painel`, `projetos`, `atualizacoes`, `perfil`. Gated by middleware (must own an `organizations` row).

Both dashboards do their own client-side data fetching with `createClient()` from [@/lib/supabase/client](src/lib/supabase/client.ts); they don't go through `/api/*`.

### i18n

[src/lib/i18n/LanguageContext.tsx](src/lib/i18n/LanguageContext.tsx) wraps the app at the root layout. Components consume `useLanguage()` and read from `t.*` namespaces defined in [translations.ts](src/lib/i18n/translations.ts). The `next-intl` package is in `dependencies` but is **not** the active i18n system — the custom context is. Don't mix the two.

### Design system

Tailwind theme extends colors to a vegetal-ink / aged-paper palette (forest/canopy/cream/sage/terra/ochre — see [tailwind.config.js](tailwind.config.js)). Three font families, all injected via CSS variables in [layout.tsx](src/app/layout.tsx):

- `font-sans` → Inter (body/UI)
- `font-serif` → IM Fell English (headlines)
- `font-display` → Vaelia (local `.woff2` in `public/fonts/` — logo only)

UI primitives in [src/components/ui/](src/components/ui/) (`ProgressBar`, `RulerDivider`, `SpecimenLabel`, `StampBadge`) follow a "scientific illustration" motif — reuse them instead of rolling new badges/labels.

## Conventions

- Route segments in Portuguese (`projetos`, `organizacoes`, `doacao`, `entrar`, `apoie`, `loja`, `perfil`, `academy`, `faq`) — match this when adding pages.
- Types live in [src/types/index.ts](src/types/index.ts). Keep `Project`, `Organization`, `Update`, `Donation`, `Profile` in sync with the SQL schema when you change either side.
- `next/image` remote hosts are allowlisted in [next.config.js](next.config.js) (`images.unsplash.com`, `*.supabase.co`). Add new hosts there before using them.
- Currency amounts are stored as `numeric` decimals in the DB but Stripe needs the smallest unit — multiply by 100 and `Math.round` at the boundary (see the checkout route for the pattern).

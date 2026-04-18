-- ================================================================
-- 002 — Schema drift fixes
-- Three columns that the code uses but were never declared in
-- 001_schema.sql. Each was likely ALTER'd by hand in Supabase Studio;
-- this migration makes them reproducible for fresh environments.
--
-- Safe to run multiple times (IF NOT EXISTS).
-- ================================================================

-- Stripe Connect — per-org Connect account ID, used by
-- /api/stripe/connect, /api/stripe/connect/status,
-- /api/donations/create, /app/projetos/[slug]/page.tsx
alter table public.organizations
  add column if not exists stripe_account_id text;

-- Stripe — PaymentIntent ID persisted by the webhook so duplicate
-- event deliveries from Stripe don't create duplicate donations.
-- UNIQUE is what makes the idempotency check in the webhook reliable.
alter table public.donations
  add column if not exists stripe_payment_intent_id text;

-- Add uniqueness only if it doesn't exist yet (can't use IF NOT EXISTS
-- on constraints directly, so guard with a DO block).
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'donations_stripe_payment_intent_id_key'
  ) then
    alter table public.donations
      add constraint donations_stripe_payment_intent_id_key
      unique (stripe_payment_intent_id);
  end if;
end$$;

-- Projects — optional list of embedded video URLs (YouTube/Vimeo)
-- shown on the project page. Used by /org/projetos/novo insert.
alter table public.projects
  add column if not exists video_links text[];

-- ================================================================
-- 005 — profiles.stripe_customer_id (closes #23)
--
-- Backs the Stripe Customer Portal flow. When a logged-in donor makes
-- a recurring donation, /api/donations/create stores the Stripe
-- Customer ID here so the portal endpoint can look it up later.
--
-- Anonymous donations don't write here (user is null at donation time).
--
-- Safe to run multiple times.
-- ================================================================

alter table public.profiles
  add column if not exists stripe_customer_id text;

create index if not exists profiles_stripe_customer_id_idx
  on public.profiles(stripe_customer_id);

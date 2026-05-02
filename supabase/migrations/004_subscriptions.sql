-- ================================================================
-- 004 — Subscriptions (recurring donations) — closes #22
--
-- Stripe Subscriptions live in our DB so:
--   - donor /perfil can list/cancel them without a round trip to Stripe
--   - org dashboards can count active recurring supporters
--   - webhook can map Stripe events back to a project
--
-- One subscription generates many donations over time (one per
-- successful invoice), hence the 1:N relationship via
-- donations.subscription_id.
--
-- Safe to run multiple times.
-- ================================================================

create table if not exists public.subscriptions (
  id                       uuid default uuid_generate_v4() primary key,

  donor_user_id            uuid references public.profiles(id) on delete set null,
  donor_email              text not null,
  donor_name               text,

  project_id               uuid not null references public.projects(id) on delete cascade,
  organization_id          uuid not null references public.organizations(id) on delete cascade,

  stripe_subscription_id   text not null unique,
  stripe_customer_id       text not null,

  amount                   numeric(10,2) not null,
  currency                 text not null default 'BRL',

  status                   text not null default 'incomplete'
                             check (status in (
                               'incomplete','incomplete_expired','trialing','active',
                               'past_due','canceled','unpaid','paused'
                             )),
  cancel_at_period_end     boolean not null default false,
  current_period_end       timestamptz,
  canceled_at              timestamptz,

  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);

create index if not exists subscriptions_donor_user_id_idx
  on public.subscriptions(donor_user_id);
create index if not exists subscriptions_organization_id_idx
  on public.subscriptions(organization_id);
create index if not exists subscriptions_project_id_idx
  on public.subscriptions(project_id);

-- updated_at touch trigger
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists subscriptions_touch_updated_at on public.subscriptions;
create trigger subscriptions_touch_updated_at
  before update on public.subscriptions
  for each row execute function public.touch_updated_at();

-- ── Link recurring donations back to their subscription ─────────
alter table public.donations
  add column if not exists subscription_id uuid references public.subscriptions(id) on delete set null;

-- ── Stripe Invoice ID — idempotency key for recurring donation rows ─
-- One invoice per renewal cycle. The webhook upserts donations keyed
-- by this column so Stripe's "at-least-once" delivery doesn't duplicate.
alter table public.donations
  add column if not exists stripe_invoice_id text;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'donations_stripe_invoice_id_key'
  ) then
    alter table public.donations
      add constraint donations_stripe_invoice_id_key
      unique (stripe_invoice_id);
  end if;
end$$;

-- ── RLS ─────────────────────────────────────────────────────────
alter table public.subscriptions enable row level security;

drop policy if exists "donor reads own subscriptions" on public.subscriptions;
create policy "donor reads own subscriptions" on public.subscriptions
  for select using (auth.uid() = donor_user_id);

drop policy if exists "org reads its project subscriptions" on public.subscriptions;
create policy "org reads its project subscriptions" on public.subscriptions
  for select using (
    organization_id in (
      select id from public.organizations where user_id = auth.uid()
    )
  );

-- Server-side inserts/updates (route handlers + webhook use the anon
-- key today). Same pragmatic pattern already used for `donations`.
-- TODO(security): when we wire SUPABASE_SERVICE_ROLE_KEY, restrict
--                 these policies to service_role only.
drop policy if exists "anyone can create subscriptions" on public.subscriptions;
create policy "anyone can create subscriptions" on public.subscriptions
  for insert with check (true);

drop policy if exists "anyone can update subscriptions" on public.subscriptions;
create policy "anyone can update subscriptions" on public.subscriptions
  for update using (true);

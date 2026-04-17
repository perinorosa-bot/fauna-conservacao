-- ============================================================
-- FAUNA PLATFORM — SQL Setup
-- Rodar no Supabase SQL Editor
-- ============================================================

-- 1. Adicionar colunas faltando na tabela donations
alter table donations add column if not exists stripe_session_id text;
alter table donations add column if not exists user_id uuid references auth.users(id);
alter table donations add column if not exists anonymous boolean default false;
alter table donations add column if not exists message text;

-- 2. Trigger para criar profile automaticamente ao signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    'donor'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 3. Habilitar RLS em todas as tabelas
alter table profiles      enable row level security;
alter table organizations enable row level security;
alter table projects      enable row level security;
alter table donations     enable row level security;
alter table updates       enable row level security;

-- 4. RLS — profiles
drop policy if exists "own profile" on profiles;
create policy "own profile" on profiles for all using (auth.uid() = id);

-- 5. RLS — organizations
drop policy if exists "orgs public read"  on organizations;
drop policy if exists "orgs owner write"  on organizations;
create policy "orgs public read" on organizations for select using (true);
create policy "orgs owner write" on organizations for all   using (auth.uid() = user_id);

-- 6. RLS — projects
drop policy if exists "projects public read" on projects;
drop policy if exists "projects org write"   on projects;
create policy "projects public read" on projects for select using (true);
create policy "projects org write" on projects for all using (
  exists (
    select 1 from organizations o
    where o.id = organization_id and o.user_id = auth.uid()
  )
);

-- 7. RLS — donations (inserts via Stripe webhook usam service role, ignora RLS)
drop policy if exists "donations insert" on donations;
drop policy if exists "donations own read" on donations;
create policy "donations insert" on donations for insert with check (true);
create policy "donations own read" on donations for select using (
  auth.uid() = user_id
);

-- 8. RLS — updates
drop policy if exists "updates public read" on updates;
drop policy if exists "updates org write"   on updates;
create policy "updates public read" on updates for select using (true);
create policy "updates org write" on updates for all using (
  exists (
    select 1 from projects p
    join organizations o on o.id = p.organization_id
    where p.id = project_id and o.user_id = auth.uid()
  )
);

-- 9. Tornar seu usuário admin (substitua pelo seu e-mail)
-- update profiles set role = 'admin' where email = 'seu@email.com';

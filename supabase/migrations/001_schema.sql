-- ================================================================
-- FAUNA PLATFORM — Schema completo
-- Cole isso no SQL Editor do Supabase (dashboard → SQL Editor)
-- ================================================================

-- Extensão para UUIDs
create extension if not exists "uuid-ossp";

-- ── PROFILES (extends auth.users) ──────────────────────────────
create table public.profiles (
  id          uuid references auth.users on delete cascade primary key,
  email       text not null,
  full_name   text,
  avatar_url  text,
  role        text not null default 'donor' check (role in ('donor','organization','admin')),
  created_at  timestamptz default now()
);

-- Cria profile automaticamente ao cadastrar usuário
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── ORGANIZATIONS ───────────────────────────────────────────────
create table public.organizations (
  id           uuid default uuid_generate_v4() primary key,
  user_id      uuid references public.profiles(id) on delete cascade,
  name         text not null,
  slug         text not null unique,
  description  text not null,
  country      text not null,
  website      text,
  logo_url     text,
  verified     boolean default false,
  created_at   timestamptz default now()
);

-- ── PROJECTS ────────────────────────────────────────────────────
create table public.projects (
  id                 uuid default uuid_generate_v4() primary key,
  organization_id    uuid references public.organizations(id) on delete cascade,
  title              text not null,
  slug               text not null unique,
  description        text not null,            -- resumo curto
  full_description   text not null default '', -- texto completo
  species            text not null,
  biome              text not null,
  country            text not null,
  lat                double precision,
  lng                double precision,
  cover_image_url    text,
  goal_amount        numeric(12,2) not null default 0,
  raised_amount      numeric(12,2) not null default 0,
  currency           text not null default 'BRL',
  status             text not null default 'active'
                       check (status in ('active','completed','paused')),
  tags               text[] default '{}',
  created_at         timestamptz default now()
);

-- ── UPDATES (feed posts) ────────────────────────────────────────
create table public.updates (
  id           uuid default uuid_generate_v4() primary key,
  project_id   uuid references public.projects(id) on delete cascade,
  title        text not null,
  content      text not null,
  image_url    text,
  author_name  text not null,
  created_at   timestamptz default now()
);

-- ── DONATIONS ───────────────────────────────────────────────────
create table public.donations (
  id           uuid default uuid_generate_v4() primary key,
  project_id   uuid references public.projects(id) on delete cascade,
  user_id      uuid references public.profiles(id) on delete set null,
  donor_name   text not null,
  donor_email  text not null,
  amount       numeric(10,2) not null,
  currency     text not null default 'BRL',
  message      text,
  anonymous    boolean default false,
  created_at   timestamptz default now()
);

-- Atualiza raised_amount automaticamente ao receber doação
create or replace function public.update_raised_amount()
returns trigger language plpgsql security definer
as $$
begin
  update public.projects
  set raised_amount = (
    select coalesce(sum(amount), 0)
    from public.donations
    where project_id = new.project_id
  )
  where id = new.project_id;
  return new;
end;
$$;

create trigger on_donation_created
  after insert on public.donations
  for each row execute procedure public.update_raised_amount();

-- ── COLLABORATIONS ──────────────────────────────────────────────
create table public.collaborations (
  id          uuid default uuid_generate_v4() primary key,
  project_ids uuid[] not null,        -- projetos participantes
  title       text not null,
  description text not null,
  status      text default 'forming'
                check (status in ('forming','active','completed')),
  created_at  timestamptz default now()
);

-- ── ROW LEVEL SECURITY ──────────────────────────────────────────
-- Leitura pública para tudo
alter table public.profiles       enable row level security;
alter table public.organizations  enable row level security;
alter table public.projects       enable row level security;
alter table public.updates        enable row level security;
alter table public.donations      enable row level security;
alter table public.collaborations enable row level security;

-- Qualquer pessoa pode ler projetos, updates, organizações
create policy "public read projects"       on public.projects       for select using (true);
create policy "public read updates"        on public.updates        for select using (true);
create policy "public read organizations"  on public.organizations  for select using (true);
create policy "public read collaborations" on public.collaborations for select using (true);

-- Apenas o dono pode editar sua organização
create policy "org owner can insert" on public.organizations
  for insert with check (auth.uid() = user_id);
create policy "org owner can update" on public.organizations
  for update using (auth.uid() = user_id);

-- Organização pode criar projetos próprios
create policy "org can insert projects" on public.projects
  for insert with check (
    exists (
      select 1 from public.organizations
      where id = organization_id and user_id = auth.uid()
    )
  );
create policy "org can update own projects" on public.projects
  for update using (
    exists (
      select 1 from public.organizations
      where id = organization_id and user_id = auth.uid()
    )
  );

-- Organização pode postar updates nos seus projetos
create policy "org can insert updates" on public.updates
  for insert with check (
    exists (
      select 1 from public.projects p
      join public.organizations o on o.id = p.organization_id
      where p.id = project_id and o.user_id = auth.uid()
    )
  );

-- Qualquer um pode fazer doação
create policy "anyone can donate" on public.donations
  for insert with check (true);

-- Usuário vê suas próprias doações
create policy "user sees own donations" on public.donations
  for select using (auth.uid() = user_id);

-- ── DADOS DE EXEMPLO ────────────────────────────────────────────
insert into public.organizations (id, user_id, name, slug, description, country, website, verified)
values (
  'a1b2c3d4-0000-0000-0000-000000000001',
  null,
  'Instituto Onça-Pintada',
  'instituto-onca-pintada',
  'Organização dedicada à conservação da onça-pintada e seus habitats no Pantanal e Cerrado brasileiro.',
  'Brasil',
  'https://institutooncapintada.org.br',
  true
);

insert into public.projects (id, organization_id, title, slug, description, species, biome, country, lat, lng, goal_amount, raised_amount, currency, tags, cover_image_url)
values (
  'p1000000-0000-0000-0000-000000000001',
  'a1b2c3d4-0000-0000-0000-000000000001',
  'Monitoramento de Onças-Pintadas no Pantanal Norte',
  'oncas-pantanal-norte',
  'Fêmea com filhotes confirmada na subregião de Cáceres — primeiro registro em 12 anos.',
  'Panthera onca',
  'Pantanal',
  'Brasil',
  -16.05, -57.65,
  50000, 38400, 'BRL',
  array['Mamífero','Armadilha fotográfica','Corredor ecológico'],
  'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=800&auto=format&fit=crop&q=80'
);

insert into public.updates (project_id, title, content, author_name, image_url)
values (
  'p1000000-0000-0000-0000-000000000001',
  'Fêmea com filhotes confirmada no Pantanal norte',
  'Após 8 meses de instalação de armadilhas fotográficas, registramos a presença confirmada de uma fêmea adulta com dois filhotes na região. É o primeiro registro documentado desta espécie na subregião de Cáceres nos últimos 12 anos. As câmeras foram posicionadas em 14 pontos estratégicos ao longo de 320km² de área monitorada.',
  'Dr. Carlos Peres',
  'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=800&auto=format&fit=crop&q=80'
);

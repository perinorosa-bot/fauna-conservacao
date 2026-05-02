-- ================================================================
-- 004 — Admin RLS + políticas de delete que faltavam
-- Cole no SQL Editor do Supabase. Idempotente (drop + create).
-- ================================================================

-- ── Coluna que faltava ─────────────────────────────────────────
-- O código de /org/atualizacoes/nova já insere video_links em updates,
-- mas a coluna não estava em nenhuma migration. Adicionando aqui.
alter table public.updates add column if not exists video_links text[];

-- ── Helper: is_admin(uid) ───────────────────────────────────────
-- Evita repetir o subselect em cada policy.
create or replace function public.is_admin(uid uuid)
returns boolean language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.profiles where id = uid and role = 'admin');
$$;

-- ── DONATIONS — admin pode ler tudo ─────────────────────────────
drop policy if exists "admin reads all donations" on public.donations;
create policy "admin reads all donations" on public.donations
  for select using (public.is_admin(auth.uid()));

-- Org dona do projeto pode ler doações dos próprios projetos.
drop policy if exists "org reads own project donations" on public.donations;
create policy "org reads own project donations" on public.donations
  for select using (
    exists (
      select 1 from public.projects p
      join public.organizations o on o.id = p.organization_id
      where p.id = donations.project_id and o.user_id = auth.uid()
    )
  );

-- ── PROJECTS — org dona pode deletar; admin pode tudo ──────────
drop policy if exists "org can delete own projects" on public.projects;
create policy "org can delete own projects" on public.projects
  for delete using (
    exists (
      select 1 from public.organizations
      where id = organization_id and user_id = auth.uid()
    )
  );

drop policy if exists "admin manages projects" on public.projects;
create policy "admin manages projects" on public.projects
  for all using (public.is_admin(auth.uid()))
          with check (public.is_admin(auth.uid()));

-- ── UPDATES — org pode editar/deletar updates dos próprios projetos
drop policy if exists "org can update own updates" on public.updates;
create policy "org can update own updates" on public.updates
  for update using (
    exists (
      select 1 from public.projects p
      join public.organizations o on o.id = p.organization_id
      where p.id = project_id and o.user_id = auth.uid()
    )
  );

drop policy if exists "org can delete own updates" on public.updates;
create policy "org can delete own updates" on public.updates
  for delete using (
    exists (
      select 1 from public.projects p
      join public.organizations o on o.id = p.organization_id
      where p.id = project_id and o.user_id = auth.uid()
    )
  );

drop policy if exists "admin manages updates" on public.updates;
create policy "admin manages updates" on public.updates
  for all using (public.is_admin(auth.uid()))
          with check (public.is_admin(auth.uid()));

-- ── ORGANIZATIONS — admin pode tudo (verificar, deletar) ───────
drop policy if exists "admin manages organizations" on public.organizations;
create policy "admin manages organizations" on public.organizations
  for all using (public.is_admin(auth.uid()))
          with check (public.is_admin(auth.uid()));

-- ── PROFILES — admin pode ler/editar todos ──────────────────────
drop policy if exists "users read own profile" on public.profiles;
create policy "users read own profile" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "admin reads all profiles" on public.profiles;
create policy "admin reads all profiles" on public.profiles
  for select using (public.is_admin(auth.uid()));

drop policy if exists "users update own profile" on public.profiles;
create policy "users update own profile" on public.profiles
  for update using (auth.uid() = id);

drop policy if exists "admin updates profiles" on public.profiles;
create policy "admin updates profiles" on public.profiles
  for update using (public.is_admin(auth.uid()))
            with check (public.is_admin(auth.uid()));

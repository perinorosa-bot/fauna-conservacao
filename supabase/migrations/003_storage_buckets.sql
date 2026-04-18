-- ================================================================
-- 003 — Storage bucket for project covers + org logos
-- Creates the public "project-images" bucket and RLS policies.
-- Required by:
--   - /org/projetos/novo           (cover upload, path "projects/*")
--   - /organizacoes/cadastro       (org logo upload, path "logos/*")
-- Both features hit the same bucket via the browser client.
--
-- Safe to run multiple times.
-- ================================================================

insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do nothing;

-- Public read — cover images render via <Image src={publicUrl}/>,
-- so anonymous visitors must be able to SELECT from this bucket.
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects'
      and policyname = 'project_images_public_read'
  ) then
    create policy project_images_public_read
      on storage.objects for select
      using (bucket_id = 'project-images');
  end if;
end$$;

-- Authenticated users can upload. The middleware already gates the
-- org dashboard, so in practice only org owners ever hit this path.
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects'
      and policyname = 'project_images_authenticated_insert'
  ) then
    create policy project_images_authenticated_insert
      on storage.objects for insert
      to authenticated
      with check (bucket_id = 'project-images');
  end if;
end$$;

-- Only the uploader can modify their own files.
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects'
      and policyname = 'project_images_owner_update'
  ) then
    create policy project_images_owner_update
      on storage.objects for update
      to authenticated
      using  (bucket_id = 'project-images' and owner = auth.uid())
      with check (bucket_id = 'project-images');
  end if;
end$$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects'
      and policyname = 'project_images_owner_delete'
  ) then
    create policy project_images_owner_delete
      on storage.objects for delete
      to authenticated
      using (bucket_id = 'project-images' and owner = auth.uid());
  end if;
end$$;

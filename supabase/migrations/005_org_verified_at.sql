-- ================================================================
-- 005 — Data pública de verificação da organização
-- Cole no SQL Editor do Supabase. Idempotente.
-- ================================================================

-- Coluna nova: quando o admin marcou a org como verificada.
-- Exibida publicamente nas páginas da org e do projeto.
alter table public.organizations
  add column if not exists verified_at timestamptz;

-- Backfill: orgs já verificadas no passado ganham verified_at = created_at
-- (não temos histórico real do momento da verificação, então usamos a data
-- de cadastro como melhor aproximação para não exibir “sem data”).
update public.organizations
   set verified_at = created_at
 where verified = true
   and verified_at is null;

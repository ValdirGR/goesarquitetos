-- =========================================================
-- Góes Arquitetos — Schema Supabase
-- Execute este arquivo no SQL Editor do Supabase (uma única vez).
-- =========================================================

-- ---------- Tabelas ----------

create table if not exists public.projects (
  id          text primary key,
  title       text not null,
  category    text not null check (category in ('residencial','comercial')),
  year        int  not null,
  location    text not null default '',
  area        text not null default '',
  description text not null default '',
  cover       text not null default '',
  gallery     text[] not null default '{}',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.news (
  id         text primary key,
  title      text not null,
  excerpt    text not null default '',
  content    text not null default '',
  cover      text not null default '',
  category   text not null default '',
  author     text not null default '',
  date       date not null,
  sources    jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_content (
  id         text primary key default 'main',
  data       jsonb not null,
  updated_at timestamptz not null default now()
);

-- ---------- Trigger updated_at ----------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists trg_projects_updated on public.projects;
create trigger trg_projects_updated before update on public.projects
for each row execute function public.set_updated_at();

drop trigger if exists trg_news_updated on public.news;
create trigger trg_news_updated before update on public.news
for each row execute function public.set_updated_at();

drop trigger if exists trg_site_content_updated on public.site_content;
create trigger trg_site_content_updated before update on public.site_content
for each row execute function public.set_updated_at();

-- ---------- RLS ----------
alter table public.projects     enable row level security;
alter table public.news         enable row level security;
alter table public.site_content enable row level security;

-- Leitura pública
drop policy if exists "projects_read" on public.projects;
create policy "projects_read" on public.projects for select using (true);

drop policy if exists "news_read" on public.news;
create policy "news_read" on public.news for select using (true);

drop policy if exists "site_content_read" on public.site_content;
create policy "site_content_read" on public.site_content for select using (true);

-- Escrita apenas para autenticados
drop policy if exists "projects_write" on public.projects;
create policy "projects_write" on public.projects for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "news_write" on public.news;
create policy "news_write" on public.news for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "site_content_write" on public.site_content;
create policy "site_content_write" on public.site_content for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ---------- Storage bucket "media" ----------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

-- Leitura pública do bucket
drop policy if exists "media_read" on storage.objects;
create policy "media_read" on storage.objects for select
  using (bucket_id = 'media');

-- Upload apenas autenticado
drop policy if exists "media_insert" on storage.objects;
create policy "media_insert" on storage.objects for insert
  with check (bucket_id = 'media' and auth.role() = 'authenticated');

drop policy if exists "media_update" on storage.objects;
create policy "media_update" on storage.objects for update
  using (bucket_id = 'media' and auth.role() = 'authenticated');

drop policy if exists "media_delete" on storage.objects;
create policy "media_delete" on storage.objects for delete
  using (bucket_id = 'media' and auth.role() = 'authenticated');

create table if not exists public.about_profile_media (
  id integer primary key default 1 check (id = 1),
  avatar_url text,
  portrait_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.about_profile_media enable row level security;

drop policy if exists "Public can read about profile media" on public.about_profile_media;
create policy "Public can read about profile media"
  on public.about_profile_media
  for select
  to anon, authenticated
  using (true);

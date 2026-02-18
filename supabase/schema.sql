-- Create the posts table
create table public.posts (
  id uuid default gen_random_uuid() primary key,
  slug text not null unique,
  title text not null,
  content text,     -- Markdown content
  excerpt text,
  seo_title text,
  seo_description text,
  category text,
  tags text[],
  cover_image text,
  lifecycle_status text default 'draft',
  lang text default 'zh',
  date timestamptz default now(),
  updated_at timestamptz default now(),
  published boolean default false,
  author_id uuid references auth.users(id)
);

-- Enable Row Level Security (RLS)
alter table public.posts enable row level security;

-- Create policies
-- Allow public read access to published posts
create policy "Public posts are viewable by everyone"
  on public.posts for select
  using ( published = true );

-- Allow authenticated users (admin) to do everything
create policy "Admins can do everything"
  on public.posts for all
  using ( auth.role() = 'authenticated' );

-- Create a storage bucket for blog assets
insert into storage.buckets (id, name, public)
values ('blog-assets', 'blog-assets', true);

-- Storage policies
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'blog-assets' );

create policy "Auth Upload"
  on storage.objects for insert
  with check ( bucket_id = 'blog-assets' and auth.role() = 'authenticated' );

-- Post edit history
create table if not exists public.post_history (
  id uuid primary key default gen_random_uuid(),
  post_slug text not null,
  action text not null,
  actor text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_post_history_slug_created_at
  on public.post_history (post_slug, created_at desc);

-- Product analytics / CTA / dwell / pageview
create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  session_id text,
  event_name text not null,
  event_category text,
  event_label text,
  path text,
  value double precision,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_analytics_events_created_at
  on public.analytics_events (created_at desc);

create index if not exists idx_analytics_events_event_name
  on public.analytics_events (event_name);

-- Create the posts table
create table public.posts (
  id uuid default gen_random_uuid() primary key,
  slug text not null unique,
  title text not null,
  content text,     -- Markdown content
  excerpt text,
  category text,
  tags text[],
  cover_image text,
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

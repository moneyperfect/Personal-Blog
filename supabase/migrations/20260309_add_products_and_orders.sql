create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  lang text not null default 'zh',
  title text not null,
  summary text default '',
  content text default '',
  tags text[] default '{}'::text[],
  cover_image text,
  seo_title text,
  seo_description text,
  price_display text not null,
  price_amount integer not null default 0,
  currency text not null default 'CNY',
  featured boolean not null default false,
  published boolean not null default false,
  fulfillment_url text,
  payment_methods text[] not null default '{"wechat","alipay"}'::text[],
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (slug, lang)
);

alter table public.products enable row level security;

create policy "Published products are viewable by everyone"
  on public.products for select
  using (published = true);

create policy "Admins can manage products"
  on public.products for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create index if not exists idx_products_lang_published_updated
  on public.products (lang, published, updated_at desc);

create index if not exists idx_products_slug_lang
  on public.products (slug, lang);

create table if not exists public.product_orders (
  id uuid primary key default gen_random_uuid(),
  order_no text not null unique,
  product_slug text not null,
  product_lang text not null,
  product_title text not null,
  amount integer not null,
  currency text not null default 'CNY',
  payment_provider text not null,
  payment_status text not null default 'pending',
  customer_email text,
  external_trade_no text,
  provider_qr_content text,
  provider_response jsonb default '{}'::jsonb,
  fulfillment_url text,
  paid_at timestamptz,
  fulfilled_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.product_orders enable row level security;

create policy "Admins can manage product orders"
  on public.product_orders for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create index if not exists idx_product_orders_status_created
  on public.product_orders (payment_status, created_at desc);

create index if not exists idx_product_orders_slug_created
  on public.product_orders (product_slug, created_at desc);

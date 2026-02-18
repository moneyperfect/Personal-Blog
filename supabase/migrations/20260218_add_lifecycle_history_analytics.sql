ALTER TABLE public.posts
ADD COLUMN IF NOT EXISTS lifecycle_status text DEFAULT 'draft';

CREATE TABLE IF NOT EXISTS public.post_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_slug text NOT NULL,
  action text NOT NULL,
  actor text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_post_history_slug_created_at
  ON public.post_history (post_slug, created_at DESC);

CREATE TABLE IF NOT EXISTS public.analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text,
  event_name text NOT NULL,
  event_category text,
  event_label text,
  path text,
  value double precision,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at
  ON public.analytics_events (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_analytics_events_event_name
  ON public.analytics_events (event_name);

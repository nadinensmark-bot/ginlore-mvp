-- Ginlore backend — základní schéma
-- Účty + cloud sync, sdílený katalog ginů s moderací, veřejný feed.
-- Spouštěj přes Supabase CLI (`supabase db push`) nebo v SQL editoru.

-- ─────────────────────────────────────────────────────────────
-- Rozšíření
-- ─────────────────────────────────────────────────────────────
create extension if not exists "pgcrypto"; -- gen_random_uuid()

-- ─────────────────────────────────────────────────────────────
-- Admini (moderace). Uživatele povyšuješ vložením jeho UID
-- ze SQL editoru (service role), ne z aplikace.
-- ─────────────────────────────────────────────────────────────
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- ─────────────────────────────────────────────────────────────
-- Profily — 1:1 s auth.users, zakládá se automaticky při registraci
-- ─────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null default '',
  xp integer not null default 0,
  streak_count integer not null default 0,
  streak_last_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-založení profilu po registraci
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─────────────────────────────────────────────────────────────
-- Sdílený katalog ginů
--   status: approved = viditelný všem; pending = čeká na moderaci
--   (vidí ho jen autor a admin); rejected = zamítnutý
--   source: seed = z MVP databáze; community = přidaný uživatelem
-- ─────────────────────────────────────────────────────────────
create table if not exists public.gins (
  id text primary key,
  name text not null,
  distillery text,
  country text,
  style text,
  abv numeric(4, 1),
  botanicals text[] not null default '{}',
  description text,
  pairing jsonb,
  community_median numeric(3, 2),
  community_count integer not null default 0,
  status text not null default 'approved'
    check (status in ('approved', 'pending', 'rejected')),
  source text not null default 'seed'
    check (source in ('seed', 'community')),
  submitted_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists gins_status_idx on public.gins (status);
create index if not exists gins_submitted_by_idx on public.gins (submitted_by);

-- ─────────────────────────────────────────────────────────────
-- Ochutnávky
-- ─────────────────────────────────────────────────────────────
-- id je text (ne uuid) — klient posílá stabilní vlastní ID, takže sync
-- je idempotentní (upsert) a lajky u nezměněných ochutnávek přežijí.
create table if not exists public.tastings (
  id text primary key default gen_random_uuid()::text,
  user_id uuid not null references public.profiles (id) on delete cascade,
  gin_id text not null references public.gins (id) on delete cascade,
  rating numeric(2, 1) check (rating >= 1 and rating <= 5),
  serve text,
  tags text[] not null default '{}',
  note text,
  tasted_on date not null,
  dg jsonb,
  is_public boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists tastings_user_idx on public.tastings (user_id);
create index if not exists tastings_gin_idx on public.tastings (gin_id);
create index if not exists tastings_public_idx
  on public.tastings (is_public, created_at desc) where is_public;

-- ─────────────────────────────────────────────────────────────
-- Můj bar — stav lahve u uživatele
-- ─────────────────────────────────────────────────────────────
create table if not exists public.bar (
  user_id uuid not null references public.profiles (id) on delete cascade,
  gin_id text not null references public.gins (id) on delete cascade,
  status text not null check (status in ('doma', 'chci')),
  stock text,
  updated_at timestamptz not null default now(),
  primary key (user_id, gin_id)
);

-- ─────────────────────────────────────────────────────────────
-- Postup v učení — obecná key-value tabulka
--   kind: lesson_done | quiz_right | bot_read | card_read
--   value: jsonb (true, nebo datum u karet)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.learning_progress (
  user_id uuid not null references public.profiles (id) on delete cascade,
  kind text not null
    check (kind in ('lesson_done', 'quiz_right', 'bot_read', 'card_read')),
  item_key text not null,
  value jsonb not null default 'true',
  updated_at timestamptz not null default now(),
  primary key (user_id, kind, item_key)
);

-- ─────────────────────────────────────────────────────────────
-- Feed likes (pro živý feed)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.tasting_likes (
  tasting_id text not null references public.tastings (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (tasting_id, user_id)
);

-- ═════════════════════════════════════════════════════════════
-- Row Level Security
-- ═════════════════════════════════════════════════════════════
alter table public.profiles enable row level security;
alter table public.gins enable row level security;
alter table public.tastings enable row level security;
alter table public.bar enable row level security;
alter table public.learning_progress enable row level security;
alter table public.tasting_likes enable row level security;
-- admins: RLS zapnuté, ale žádná politika = přístup jen přes service role

alter table public.admins enable row level security;

-- Profily: přihlášení vidí všechny (kvůli jménům ve feedu),
-- každý edituje jen svůj.
create policy "profiles_select_authenticated" on public.profiles
  for select to authenticated using (true);

create policy "profiles_update_own" on public.profiles
  for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

-- Giny: schválené vidí kdokoli (i anonym), pending vidí autor a admin.
create policy "gins_select_approved_or_own" on public.gins
  for select using (
    status = 'approved'
    or submitted_by = auth.uid()
    or public.is_admin()
  );

-- Uživatel smí navrhnout gin — vždy jako pending/community, pod svým UID.
create policy "gins_insert_submission" on public.gins
  for insert to authenticated
  with check (
    submitted_by = auth.uid()
    and status = 'pending'
    and source = 'community'
  );

-- Editovat/moderovat smí jen admin.
create policy "gins_update_admin" on public.gins
  for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Ochutnávky: vlastní plně; veřejné čte kdokoli.
create policy "tastings_select_own" on public.tastings
  for select to authenticated using (user_id = auth.uid());

create policy "tastings_select_public" on public.tastings
  for select using (is_public = true);

create policy "tastings_insert_own" on public.tastings
  for insert to authenticated with check (user_id = auth.uid());

create policy "tastings_update_own" on public.tastings
  for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "tastings_delete_own" on public.tastings
  for delete to authenticated using (user_id = auth.uid());

-- Bar: jen vlastní.
create policy "bar_all_own" on public.bar
  for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Postup v učení: jen vlastní.
create policy "progress_all_own" on public.learning_progress
  for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Likes: čte kdokoli (počty), píše jen za sebe.
create policy "likes_select_all" on public.tasting_likes
  for select using (true);

create policy "likes_insert_own" on public.tasting_likes
  for insert to authenticated with check (user_id = auth.uid());

create policy "likes_delete_own" on public.tasting_likes
  for delete to authenticated using (user_id = auth.uid());

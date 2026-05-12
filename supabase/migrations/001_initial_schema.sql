-- =============================================================================
-- Glam Studio — Initial Schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. profiles
--    One row per auth user. Created on first updateProfile() call (upsert).
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id               uuid primary key references auth.users(id) on delete cascade,
  name             text         not null default '',
  email            text                  default '',
  skin_type        text         not null default '',
  skin_tone        text         not null default '',
  complexion       text         not null default '',
  undertone        text         not null default '',
  location         text         not null default '',
  preferred_brands text[]       not null default '{}',
  preferred_looks  text[]       not null default '{}',
  hero_gradient    text         not null default '',
  has_onboarded    boolean      not null default false,
  created_at       timestamptz  not null default now(),
  updated_at       timestamptz  not null default now()
);

alter table public.profiles enable row level security;

create policy "users can manage own profile"
  on public.profiles for all
  using  (auth.uid() = id)
  with check (auth.uid() = id);

-- ---------------------------------------------------------------------------
-- 2. looks
-- ---------------------------------------------------------------------------
create table if not exists public.looks (
  id            uuid        primary key default gen_random_uuid(),
  user_id       uuid        not null references auth.users(id) on delete cascade,
  name          text        not null,
  image_urls    text[]      not null default '{}',
  height_class  text        not null default 'h-72',
  is_top_five   boolean     not null default false,
  steps         text[]      not null default '{}',
  products_used text[]      not null default '{}',
  mood_boards   text[]      not null default '{}',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.looks enable row level security;

create policy "users can manage own looks"
  on public.looks for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- 3. products
-- ---------------------------------------------------------------------------
create table if not exists public.products (
  id           uuid        primary key default gen_random_uuid(),
  user_id      uuid        not null references auth.users(id) on delete cascade,
  name         text        not null,
  brand        text        not null default '',
  image_url    text        not null default '',
  is_favourite boolean     not null default false,
  created_at   timestamptz not null default now()
);

alter table public.products enable row level security;

create policy "users can manage own products"
  on public.products for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- 4. brands
-- ---------------------------------------------------------------------------
create table if not exists public.brands (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references auth.users(id) on delete cascade,
  name        text        not null,
  website_url text,
  created_at  timestamptz not null default now()
);

alter table public.brands enable row level security;

create policy "users can manage own brands"
  on public.brands for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- 5. moodboards
-- ---------------------------------------------------------------------------
create table if not exists public.moodboards (
  id                  uuid        primary key default gen_random_uuid(),
  user_id             uuid        not null references auth.users(id) on delete cascade,
  name                text        not null,
  image_urls          text[]      not null default '{}',
  ai_description      text,
  pinterest_board_url text,
  created_at          timestamptz not null default now()
);

alter table public.moodboards enable row level security;

create policy "users can manage own moodboards"
  on public.moodboards for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

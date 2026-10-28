-- Wardrobe MVP — Postgres schema (Supabase)
-- Run this in the Supabase SQL editor.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Users (mirrors Supabase auth.users)
-- ---------------------------------------------------------------------------
create table public.users (
  id         uuid primary key references auth.users (id) on delete cascade,
  email      text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Clothing items
-- ---------------------------------------------------------------------------
create table public.clothing_items (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.users (id) on delete cascade,
  image_url    text,
  category     text,          -- top | bottom | dress | shoes | outerwear | accessory
  color        text,          -- primary color
  colors       text[] not null default '{}',
  season       text[] not null default '{}', -- spring | summer | fall | winter
  formality    text,          -- casual | smart-casual | business | formal
  is_favorite  boolean not null default false,
  ai_assisted  boolean not null default false, -- true if fields came from DeepSeek
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index clothing_items_user_id_idx on public.clothing_items (user_id);

-- ---------------------------------------------------------------------------
-- Outfits
-- ---------------------------------------------------------------------------
create table public.outfits (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.users (id) on delete cascade,
  status      text not null default 'suggested'
              check (status in ('suggested', 'saved', 'rejected')),
  occasion    text,           -- e.g. work, dinner, casual, wedding
  weather     jsonb,          -- { temp_c, condition }
  rationale   text,           -- why the engine chose these pieces
  created_at  timestamptz not null default now()
);

create index outfits_user_id_idx on public.outfits (user_id);

-- ---------------------------------------------------------------------------
-- Outfit <-> item join
-- ---------------------------------------------------------------------------
create table public.outfit_items (
  outfit_id  uuid not null references public.outfits (id) on delete cascade,
  item_id    uuid not null references public.clothing_items (id) on delete cascade,
  position   int not null default 0,
  primary key (outfit_id, item_id)
);

-- ---------------------------------------------------------------------------
-- Outfit feedback (save / reject / rate)
-- ---------------------------------------------------------------------------
create table public.outfit_feedback (
  id          uuid primary key default gen_random_uuid(),
  outfit_id   uuid not null references public.outfits (id) on delete cascade,
  rating      int check (rating between 1 and 5),
  action      text,           -- saved | rejected | rated
  created_at  timestamptz not null default now()
);

create index outfit_feedback_outfit_id_idx on public.outfit_feedback (outfit_id);

-- ---------------------------------------------------------------------------
-- Row Level Security (each user sees only their own data)
-- ---------------------------------------------------------------------------
alter table public.users           enable row level security;
alter table public.clothing_items  enable row level security;
alter table public.outfits         enable row level security;
alter table public.outfit_items    enable row level security;
alter table public.outfit_feedback enable row level security;

create policy "users: own rows" on public.users
  for all using (auth.uid() = id);

create policy "clothing_items: own rows" on public.clothing_items
  for all using (auth.uid() = user_id);

create policy "outfits: own rows" on public.outfits
  for all using (auth.uid() = user_id);

create policy "outfit_items: own rows" on public.outfit_items
  for all using (
    exists (select 1 from public.outfits o where o.id = outfit_id and o.user_id = auth.uid())
  );

create policy "outfit_feedback: own rows" on public.outfit_feedback
  for all using (
    exists (select 1 from public.outfits o where o.id = outfit_id and o.user_id = auth.uid())
  );

-- ---------------------------------------------------------------------------
-- Trigger: keep users table in sync with auth.users
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

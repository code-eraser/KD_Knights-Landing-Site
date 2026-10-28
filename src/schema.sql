-- Run in Supabase Dashboard > SQL Editor
create table if not exists public.students (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  rating      text not null,
  timezone    text not null,
  tier        text check (tier in ('beginner', 'intermediate', 'advanced')),
  created_at  timestamptz not null default now()
);

alter table public.students enable row level security;

-- Visitors (anon key) may INSERT only. They cannot read, update or delete rows.
create policy "Anyone can register"
  on public.students
  for insert
  to anon
  with check (true);

-- Admin allowlist podle e-mailu.
-- Předschválené e-maily jsou adminy automaticky, jakmile se zaregistrují —
-- není potřeba je ručně povyšovat přes public.admins po registraci.

create table if not exists public.admin_emails (
  email text primary key,
  created_at timestamptz not null default now()
);

alter table public.admin_emails enable row level security;
-- žádná politika = čte/píše jen service role (a security-definer funkce níže)

-- is_admin() nově uznává i shodu e-mailu z JWT s allowlistem.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    exists (select 1 from public.admins where user_id = auth.uid())
    or lower(coalesce(auth.jwt() ->> 'email', '')) in (
      select lower(email) from public.admin_emails
    );
$$;

-- Předschválení adminové.
insert into public.admin_emails (email) values
  ('admin1@ginlore.app'),
  ('admin2@ginlore.app'),
  ('nadine.nsmark@gmail.com')
on conflict (email) do nothing;

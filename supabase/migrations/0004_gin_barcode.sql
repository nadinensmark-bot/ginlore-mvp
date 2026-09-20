-- Čárový kód (EAN/UPC) u ginu — pro skenování etikety.
-- Jeden gin může mít víc balení/kódů, proto zvlášť tabulka barcode → gin.

create table if not exists public.gin_barcodes (
  barcode text primary key,
  gin_id text not null references public.gins (id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists gin_barcodes_gin_idx on public.gin_barcodes (gin_id);

alter table public.gin_barcodes enable row level security;

-- Kódy schválených ginů čte kdokoli (kvůli skenování bez přihlášení).
create policy "gin_barcodes_select_all" on public.gin_barcodes
  for select using (true);

-- Přihlášený uživatel může přiřadit kód (když naskenuje a doplní),
-- ale jen k ginu, který je schválený nebo který sám navrhl.
create policy "gin_barcodes_insert_auth" on public.gin_barcodes
  for insert to authenticated
  with check (
    exists (
      select 1 from public.gins g
      where g.id = gin_id
        and (g.status = 'approved' or g.submitted_by = auth.uid())
    )
  );

-- Editovat/maazat smí jen admin.
create policy "gin_barcodes_update_admin" on public.gin_barcodes
  for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "gin_barcodes_delete_admin" on public.gin_barcodes
  for delete to authenticated using (public.is_admin());

-- Ejecutar en el SQL Editor de un proyecto Supabase nuevo.
begin;
create table if not exists public.admin_users (user_id uuid primary key references auth.users(id) on delete cascade);
alter table public.admin_users enable row level security;
create or replace function public.is_admin() returns boolean language sql stable security definer set search_path = '' as $$ select exists(select 1 from public.admin_users where user_id = (select auth.uid())); $$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;
revoke all on public.admin_users from anon, authenticated;

create table if not exists public.categories (
 id uuid primary key default gen_random_uuid(),
 name text not null unique check(length(trim(name)) between 1 and 60),
 created_at timestamptz not null default now()
);
create table if not exists public.products (
 id uuid primary key default gen_random_uuid(),
 category_id uuid not null references public.categories(id) on delete restrict,
 name text not null check(length(trim(name)) between 1 and 100),
 description text not null default '' check(length(description)<=2000),
 price_uyu numeric(12,2) not null check(price_uyu>0),
 price_brl numeric(12,2) not null check(price_brl>0),
 in_stock boolean not null default true,
 images text[] not null default '{}',
 created_at timestamptz not null default now()
);
create index if not exists products_category_idx on public.products(category_id);
alter table public.products enable row level security;
alter table public.categories enable row level security;
grant select on public.products, public.categories to anon, authenticated;
grant insert,update,delete on public.products, public.categories to authenticated;
create policy "Read categories" on public.categories for select to anon, authenticated using(true);
create policy "Admin categories" on public.categories for all to authenticated using((select public.is_admin())) with check((select public.is_admin()));
create policy "Read available products" on public.products for select to anon, authenticated using(in_stock or (select public.is_admin()));
create policy "Admin products" on public.products for all to authenticated using((select public.is_admin())) with check((select public.is_admin()));
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types) values ('product-images','product-images',true,5242880,array['image/jpeg','image/png','image/webp']) on conflict(id) do nothing;
create policy "Admin photo upload" on storage.objects for insert to authenticated with check(bucket_id='product-images' and (select public.is_admin()));
create policy "Admin photo update" on storage.objects for update to authenticated using(bucket_id='product-images' and (select public.is_admin())) with check(bucket_id='product-images' and (select public.is_admin()));
create policy "Admin photo delete" on storage.objects for delete to authenticated using(bucket_id='product-images' and (select public.is_admin()));
create policy "Admin photo list" on storage.objects for select to authenticated using(bucket_id='product-images' and (select public.is_admin()));
insert into public.categories(name) values('Textiles'),('Electrodomésticos'),('Infantil') on conflict(name) do nothing;
commit;
-- Crear a Jessica en Authentication > Users > Add user, con correo y contraseña.
-- Copiar su UUID real y ejecutar por separado:
-- insert into public.admin_users(user_id) values ('UUID-DE-JESSICA');
-- No habilitar políticas de escritura para todos los usuarios autenticados.

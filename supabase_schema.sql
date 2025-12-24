-- Create the bookings table
create table public.bookings (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  guest_name text not null,
  guest_phone text not null,
  start_date date not null,
  end_date date not null,
  total_price numeric not null,
  message text null,
  status text not null default 'pending', -- pending, confirmed, rejected
  constraint bookings_pkey primary key (id)
);

-- Create the settings table
create table public.settings (
  id uuid not null default gen_random_uuid (),
  base_rate numeric not null default 50,
  holiday_rate numeric not null default 75,
  holidays date[] null,
  requirements text[] null,
  constraint settings_pkey primary key (id)
);

-- Insert default settings
insert into public.settings (base_rate, holiday_rate, holidays, requirements)
values (50, 75, array[]::date[], array['Dogs must be at least 1 year old.', 'Must be fully vaccinated.']);

-- Enable RLS
alter table public.bookings enable row level security;
alter table public.settings enable row level security;

-- Policies for bookings
create policy "Enable insert for everyone" on public.bookings
  for insert with check (true);

create policy "Enable read for authenticated users only" on public.bookings
  for select using (auth.role() = 'authenticated');

create policy "Enable update for authenticated users only" on public.bookings
  for update using (auth.role() = 'authenticated');

-- Policies for settings
create policy "Enable read for everyone" on public.settings
  for select using (true);

create policy "Enable update for authenticated users only" on public.settings
  for update using (auth.role() = 'authenticated');

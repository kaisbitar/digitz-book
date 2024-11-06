-- Enable UUID extension if not enabled
create extension if not exists "uuid-ossp";

-- Create user settings table
create table if not exists public.user_settings (
    id uuid references auth.users on delete cascade primary key,
    display_name text,
    preferences jsonb default '{}'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.user_settings enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Users can read own settings" on public.user_settings;
drop policy if exists "Users can update own settings" on public.user_settings;
drop policy if exists "Users can insert own settings" on public.user_settings;

-- Create policies
create policy "Users can read own settings"
    on public.user_settings for select
    using (auth.uid() = id);

create policy "Users can update own settings"
    on public.user_settings for update
    using (auth.uid() = id);

create policy "Users can insert own settings"
    on public.user_settings for insert
    with check (auth.uid() = id);
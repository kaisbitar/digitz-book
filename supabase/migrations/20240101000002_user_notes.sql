-- Create user notes table
create table if not exists public.user_notes (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users on delete cascade not null,
    word text not null,                    -- The Quranic word (Ratl)
    note text not null,                    -- The user's note content
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    -- Composite unique constraint to prevent duplicate notes for same word by same user
    unique(user_id, word)
);

-- Enable RLS
alter table public.user_notes enable row level security;

-- Policies
create policy "Users can read own notes"
    on public.user_notes for select
    using (auth.uid() = user_id);

create policy "Users can insert own notes"
    on public.user_notes for insert
    with check (auth.uid() = user_id);

create policy "Users can update own notes"
    on public.user_notes for update
    using (auth.uid() = user_id);

create policy "Users can delete own notes"
    on public.user_notes for delete
    using (auth.uid() = user_id);

-- Create index for faster queries
create index idx_user_notes_user_word on public.user_notes(user_id, word); 
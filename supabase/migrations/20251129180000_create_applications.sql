create table if not exists applications (
  id uuid default gen_random_uuid() primary key,
  student_id uuid references students(id) on delete cascade not null,
  university_id text not null, -- Can be a UUID or a string ID from our universities list
  university_name text not null,
  status text default 'Planning' check (status in ('Planning', 'Applied', 'Accepted', 'Rejected', 'Waitlisted', 'Visa Pending', 'Enrolled')),
  documents jsonb default '[]'::jsonb, -- Array of { name, status, date }
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table applications enable row level security;

-- Policy
drop policy if exists "Allow all access" on applications;
create policy "Allow all access" on applications for all using (true) with check (true);

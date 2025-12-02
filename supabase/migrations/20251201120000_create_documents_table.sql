-- Create documents table
create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  student_id bigint references students(id) on delete cascade not null,
  name text not null,
  file_path text not null,
  file_type text,
  size integer,
  created_at timestamptz default now()
);

-- Enable RLS
alter table documents enable row level security;

-- Policies for documents table
create policy "Enable read access for authenticated users"
on documents for select
to authenticated
using (true);

create policy "Enable insert access for authenticated users"
on documents for insert
to authenticated
with check (true);

create policy "Enable delete access for authenticated users"
on documents for delete
to authenticated
using (true);

-- Storage bucket setup (idempotent-ish)
insert into storage.buckets (id, name, public)
values ('student-documents', 'student-documents', true)
on conflict (id) do nothing;

-- Storage policies
create policy "Give users access to own folder 1oj01k_0" on storage.objects
  for select
  to authenticated
  using (bucket_id = 'student-documents');

create policy "Give users access to own folder 1oj01k_1" on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'student-documents');

create policy "Give users access to own folder 1oj01k_2" on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'student-documents');

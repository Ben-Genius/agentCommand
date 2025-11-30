alter table applications add column if not exists checklist jsonb default '[]'::jsonb;

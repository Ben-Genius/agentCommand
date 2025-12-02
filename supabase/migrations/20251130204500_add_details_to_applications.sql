alter table applications add column if not exists program text;
alter table applications add column if not exists supplementary_essay text;
alter table applications add column if not exists bio_info text;
alter table applications add column if not exists custom_fields jsonb default '[]'::jsonb;

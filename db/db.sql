-- Users table (auth.users is managed by Supabase Auth)
create table stories (
    id uuid not null default gen_random_uuid (),
    title text not null,
    user_id uuid null,
    created_at timestamp with time zone null default now(),
    language text not null default 'English'::text,
    author text null,
    constraint stories_pkey primary key (id),
    constraint stories_user_id_fkey foreign key (user_id) references auth.users (id) on delete cascade
  );

create index if not exists idx_stories_user_id on public.stories using btree (user_id) tablespace pg_default;
-- Chapters table
create table chapters (
    id uuid not null default gen_random_uuid (),
    title text not null,
    summary text null,
    chapter_number integer not null,
    story_id uuid null,
    chapter_data jsonb null,
    created_at timestamp with time zone null default now(),
    pov_character text null,
    pov_type text null default 'Third Person Omniscient'::text,
    constraint chapters_pkey primary key (id),
    constraint chapters_story_id_chapter_number_key unique (story_id, chapter_number),
    constraint chapters_story_id_fkey foreign key (story_id) references stories (id) on delete cascade
  );

create index if not exists idx_chapters_story_id on public.chapters using btree (story_id) tablespace pg_default;

-- Lorebooks table
create table lorebooks (
    id uuid not null default gen_random_uuid (),
    name text not null,
    story_id uuid null,
    created_at timestamp with time zone null default now(),
    constraint lorebooks_pkey primary key (id),
    constraint lorebooks_story_id_key unique (story_id),
    constraint lorebooks_story_id_fkey foreign key (story_id) references stories (id) on delete cascade
  );

-- Lorebook Items table
create table lorebook_items (
    id uuid not null default gen_random_uuid (),
    name text not null,
    tags text null,
    classification text null,
    lore_type text null,
    description text null,
    lorebook_id uuid null,
    created_at timestamp with time zone null default now(),
    constraint lorebook_items_pkey primary key (id),
    constraint lorebook_items_lorebook_id_fkey foreign key (lorebook_id) references lorebooks (id) on delete cascade,
    constraint lorebook_items_classification_check check (
      (
        classification = any (
          array['Character'::text, 'Item'::text, 'Location'::text]
        )
      )
    )
  );

create index if not exists idx_lorebook_items_lorebook_id on public.lorebook_items using btree (lorebook_id) tablespace pg_default;

-- Prompts table
create table prompts (
    id uuid not null default gen_random_uuid (),
    user_id uuid null,
    name text not null,
    prompt_data jsonb null,
    created_at timestamp with time zone null default now(),
    allowed_models text null,
    prompt_type text null default 'scene_beat'::text,
    constraint prompts_pkey primary key (id),
    constraint prompts_user_id_fkey foreign key (user_id) references auth.users (id) on delete cascade
  );    

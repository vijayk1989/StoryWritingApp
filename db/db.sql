CREATE TABLE stories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    synopsis TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE chapters (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    summary TEXT,
    chapter_number INT NOT NULL,
    story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
    chapter_data JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (story_id, chapter_number)
);

CREATE TABLE ai_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    ai_host TEXT CHECK (ai_host IN ('Open Router', 'Open AI', 'Mistral', 'Local', 'Claude')),
    api_key TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE prompts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NULL,
    name TEXT NOT NULL,
    prompt_data JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE lorebooks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    story_id UUID UNIQUE REFERENCES stories(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now()
);


CREATE TABLE lorebook_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    tags TEXT,  -- comma-separated list of tags
    classification TEXT CHECK (classification IN ('Character', 'Item', 'Location')),
    lore_type TEXT,
    lorebook_id UUID REFERENCES lorebooks(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now()
);

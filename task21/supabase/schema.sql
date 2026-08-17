-- ============================================================
-- SHAREVAULT SUPABASE DATABASE SCHEMA & STORAGE POLICIES
-- ============================================================

-- 1. Create Profiles Table (Sync with Auth Users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    storage_limit BIGINT DEFAULT 10737418240, -- 10 GB default
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Files Table
CREATE TABLE IF NOT EXISTS public.files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    original_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_type TEXT NOT NULL, -- document, image, video, archive, code, audio, other
    file_size BIGINT NOT NULL,
    mime_type TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    is_favorite BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    download_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create File Shares Table
CREATE TABLE IF NOT EXISTS public.file_shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_id UUID NOT NULL REFERENCES public.files(id) ON DELETE CASCADE,
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    shared_with_email TEXT NOT NULL,
    permission TEXT DEFAULT 'read', -- read, download
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info', -- info, success, warning, error
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for optimal search performance
CREATE INDEX IF NOT EXISTS idx_files_user_id ON public.files(user_id);
CREATE INDEX IF NOT EXISTS idx_files_file_type ON public.files(file_type);
CREATE INDEX IF NOT EXISTS idx_files_is_favorite ON public.files(is_favorite);
CREATE INDEX IF NOT EXISTS idx_files_is_deleted ON public.files(is_deleted);
CREATE INDEX IF NOT EXISTS idx_file_shares_shared_with ON public.file_shares(shared_with_email);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.file_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES FOR PROFILES
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- RLS POLICIES FOR FILES
CREATE POLICY "Users can view own files" ON public.files
    FOR SELECT USING (
        auth.uid() = user_id 
        OR 
        id IN (
            SELECT file_id FROM public.file_shares 
            WHERE LOWER(shared_with_email) = LOWER(auth.jwt() ->> 'email')
        )
    );

CREATE POLICY "Users can insert own files" ON public.files
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own files" ON public.files
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own files" ON public.files
    FOR DELETE USING (auth.uid() = user_id);

-- RLS POLICIES FOR FILE SHARES
CREATE POLICY "File owners can manage shares" ON public.file_shares
    FOR ALL USING (auth.uid() = owner_id);

CREATE POLICY "Shared users can view share entries" ON public.file_shares
    FOR SELECT USING (LOWER(shared_with_email) = LOWER(auth.jwt() ->> 'email'));

-- RLS POLICIES FOR NOTIFICATIONS
CREATE POLICY "Users can view own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- STORAGE BUCKET CONFIGURATION (Execute in Supabase Storage UI or via SQL)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('user-files', 'user-files', false)
ON CONFLICT (id) DO NOTHING;

-- STORAGE POLICIES
CREATE POLICY "Users can upload to their folder" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'user-files' AND 
        (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Users can view their files" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'user-files' AND 
        (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Users can update their files" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'user-files' AND 
        (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Users can delete their files" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'user-files' AND 
        (storage.foldername(name))[1] = auth.uid()::text
    );

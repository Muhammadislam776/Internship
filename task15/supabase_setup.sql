-- ====================================================================
-- AdminSphere Supabase Database & Auth Setup SQL Script
-- Project: https://trlfqixivlddirlatymn.supabase.co
-- ====================================================================

-- 1. Create Public Profiles Table linked to Supabase Auth Users
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'moderator', 'user')),
    phone TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. RLS Policies
-- Allow users to view their own profile or public profiles
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT 
USING (true);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- Note: The Service Role Key bypasses RLS automatically on the server!

-- 3. Automatic Trigger to Sync New Supabase Auth Registrations into Profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role, phone, status)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80'),
    COALESCE(NEW.raw_app_meta_data->>'role', NEW.raw_user_meta_data->>'role', 'user'),
    COALESCE(NEW.phone, 'N/A'),
    'active'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. View to Inspect All Auth Users with Profile Metadata
CREATE OR REPLACE VIEW public.admin_user_overview AS
SELECT 
    u.id,
    u.email,
    p.full_name,
    p.avatar_url,
    p.role,
    p.status,
    p.phone,
    u.email_confirmed_at IS NOT NULL AS is_email_verified,
    u.created_at,
    u.last_sign_in_at
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id;

-- 5. Verification Notice
SELECT 'AdminSphere Supabase Database Schema Successfully Installed!' AS status;

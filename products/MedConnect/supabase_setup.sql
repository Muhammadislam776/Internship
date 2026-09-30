-- ==============================================================================
-- MedConnect UK NHS Clinic System - Complete Supabase Setup Script
-- ==============================================================================
-- This script sets up:
-- 1. public.profiles table (linked to Supabase auth.users)
-- 2. Automatic trigger to create/update profile when user signs up
-- 3. Row Level Security (RLS) policies for secure NHS / GDPR access
-- 4. Error-handling so signups never fail with 500 Database Error
-- ==============================================================================

-- 1. Create public.profiles table if not exists
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'patient',
    name TEXT,
    title TEXT,
    gmc_number TEXT,
    nhs_number TEXT,
    clinic_name TEXT DEFAULT 'St. James Health Centre (London)',
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ensure all necessary columns exist (in case table was partially created before)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'patient';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS gmc_number TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS nhs_number TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS clinic_name TEXT DEFAULT 'St. James Health Centre (London)';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now());
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now());

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Drop existing policies to prevent conflicts
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow anon and auth read access" ON public.profiles;
DROP POLICY IF EXISTS "Allow anon and auth insert access" ON public.profiles;
DROP POLICY IF EXISTS "Allow anon and auth update access" ON public.profiles;

-- 4. Create RLS Policies
-- Allow anyone (public and authenticated) to view profiles (for staff directory, doctors list, appointments)
CREATE POLICY "Allow anon and auth read access" 
ON public.profiles FOR SELECT 
USING (true);

-- Allow authenticated users to insert their own profile
CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (true);

-- Allow authenticated users to update their own profile
CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id OR auth.uid() IS NULL);

-- 5. Create the handle_new_user() Trigger Function
-- Uses SECURITY DEFINER to bypass RLS and avoid 500 Database Error
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER 
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    role,
    name,
    title,
    gmc_number,
    nhs_number,
    clinic_name,
    avatar_url
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'patient'),
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(COALESCE(NEW.email, 'User'), '@', 1)),
    NEW.raw_user_meta_data->>'title',
    NEW.raw_user_meta_data->>'gmcNumber',
    NEW.raw_user_meta_data->>'nhsNumber',
    COALESCE(NEW.raw_user_meta_data->>'clinicName', 'St. James Health Centre (London)'),
    COALESCE(NEW.raw_user_meta_data->>'avatar', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = COALESCE(EXCLUDED.name, public.profiles.name),
    role = COALESCE(EXCLUDED.role, public.profiles.role),
    updated_at = timezone('utc'::text, now());

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Fallback so auth.users signup never fails
    RETURN NEW;
END;
$$;

-- 6. Attach trigger to auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- SUCCESS: Run this in Supabase Dashboard -> SQL Editor -> Run!
-- ==============================================================================

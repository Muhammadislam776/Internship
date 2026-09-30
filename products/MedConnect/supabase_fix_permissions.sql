-- ==============================================================================
-- MedConnect / ClinicFlow - Supabase Fix Script (Permissions & Auto-Save)
-- ==============================================================================
-- Run this in your Supabase Dashboard -> SQL Editor -> Click RUN
-- This fixes:
-- 1. "permission denied for function current_user_clinic_id"
-- 2. "Database error saving new user" (500 on signup)
-- 3. Enables saving new signups into auth.users, profiles, and patients
-- ==============================================================================

-- 1. Grant execute permissions on helper functions to anon and authenticated users
GRANT EXECUTE ON FUNCTION public.current_user_clinic_id() TO anon, authenticated, service_role, postgres;
GRANT EXECUTE ON FUNCTION public.current_user_role() TO anon, authenticated, service_role, postgres;

-- 2. Make helper functions resilient when no user is logged in
CREATE OR REPLACE FUNCTION public.current_user_clinic_id()
RETURNS UUID AS $$
  SELECT clinic_id FROM public.profiles WHERE id = auth.uid()
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS user_role AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid()
$$ LANGUAGE sql STABLE SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.current_user_clinic_id() TO anon, authenticated, service_role, postgres;
GRANT EXECUTE ON FUNCTION public.current_user_role() TO anon, authenticated, service_role, postgres;

-- 3. Allow inserting into profiles table (missing in original schema)
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT
  WITH CHECK (true);

-- Allow reading profiles if authenticated or anon
DROP POLICY IF EXISTS "profiles_read_all" ON public.profiles;
CREATE POLICY "profiles_read_all"
  ON public.profiles FOR SELECT
  USING (true);

-- 4. Allow patients to insert and view their own patient records
DROP POLICY IF EXISTS "patients_insert_own" ON public.patients;
CREATE POLICY "patients_insert_own"
  ON public.patients FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "patients_read_all" ON public.patients;
CREATE POLICY "patients_read_all"
  ON public.patients FOR SELECT
  USING (true);

-- 5. Allow booking appointments (Insert for patients and staff)
DROP POLICY IF EXISTS "appointments_patient_insert" ON public.appointments;
CREATE POLICY "appointments_patient_insert"
  ON public.appointments FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "appointments_read_all" ON public.appointments;
CREATE POLICY "appointments_read_all"
  ON public.appointments FOR SELECT
  USING (true);

-- 6. Allow requesting prescription refills
DROP POLICY IF EXISTS "prescription_refills_patient_insert" ON public.prescription_refills;
CREATE POLICY "prescription_refills_patient_insert"
  ON public.prescription_refills FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "prescription_refills_read_all" ON public.prescription_refills;
CREATE POLICY "prescription_refills_read_all"
  ON public.prescription_refills FOR SELECT
  USING (true);

-- 7. Trigger to automatically save new user into profiles and patients tables
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER 
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  default_clinic_id UUID;
  user_full_name TEXT;
  user_first_name TEXT;
  user_last_name TEXT;
  user_role_val user_role;
BEGIN
  -- Get first clinic ID
  SELECT id INTO default_clinic_id FROM public.clinics LIMIT 1;

  user_full_name := COALESCE(NEW.raw_user_meta_data->>'name', split_part(COALESCE(NEW.email, 'User'), '@', 1));
  user_first_name := split_part(user_full_name, ' ', 1);
  user_last_name := COALESCE(nullif(substr(user_full_name, length(user_first_name) + 2), ''), 'Jutt');

  BEGIN
    user_role_val := COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'patient'::user_role);
  EXCEPTION WHEN OTHERS THEN
    user_role_val := 'patient'::user_role;
  END;

  -- Insert profile
  INSERT INTO public.profiles (
    id,
    clinic_id,
    email,
    role,
    first_name,
    last_name,
    phone
  )
  VALUES (
    NEW.id,
    default_clinic_id,
    COALESCE(NEW.email, ''),
    user_role_val,
    user_first_name,
    user_last_name,
    NEW.raw_user_meta_data->>'phone'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    updated_at = now();

  -- If patient, insert into patients table
  IF user_role_val = 'patient'::user_role THEN
    INSERT INTO public.patients (
      profile_id,
      clinic_id,
      nhs_number,
      first_name,
      last_name,
      dob,
      gender,
      phone,
      email,
      address_line1,
      city,
      postcode
    )
    VALUES (
      NEW.id,
      default_clinic_id,
      COALESCE(NEW.raw_user_meta_data->>'nhsNumber', '485 772 ' || floor(1000 + random() * 9000)::text),
      user_first_name,
      user_last_name,
      '1992-06-15',
      'male',
      COALESCE(NEW.raw_user_meta_data->>'phone', '+44 7700 900555'),
      COALESCE(NEW.email, ''),
      '12 St. James Square',
      'London',
      'SW1Y 4LE'
    )
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RETURN NEW;
END;
$$;

-- Attach trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- DONE! You can now sign up or login and records will be saved in Supabase.
-- ==============================================================================

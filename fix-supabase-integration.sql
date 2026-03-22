-- ============================================================
-- FIX: Supabase Integration Issues
-- Run this entire script in your Supabase SQL Editor
-- https://supabase.com/dashboard → Your Project → SQL Editor
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- STEP 1: Fix the handle_new_student trigger
-- The old trigger may have been blocked by RLS or missing columns.
-- This version uses SECURITY DEFINER to bypass RLS on insert.
-- ────────────────────────────────────────────────────────────
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_student() CASCADE;

CREATE OR REPLACE FUNCTION public.handle_new_student()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_name text;
BEGIN
  v_name := COALESCE(
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'full_name',
    split_part(new.email, '@', 1)
  );

  INSERT INTO public.students (id, email, name, role, status, avatar)
  VALUES (
    new.id::text,
    new.email,
    v_name,
    COALESCE(new.raw_user_meta_data->>'role', 'User'),
    'Pending',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=' || v_name
  )
  ON CONFLICT (id) DO NOTHING;  -- safe to re-run; won't overwrite existing records

  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_student();


-- ────────────────────────────────────────────────────────────
-- STEP 2: Backfill any auth users who don't have a students row yet
-- This fixes existing accounts that were missed by the broken trigger.
-- ────────────────────────────────────────────────────────────
INSERT INTO public.students (id, email, name, role, status, avatar)
SELECT
  u.id::text,
  u.email,
  COALESCE(u.raw_user_meta_data->>'name', u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1)),
  COALESCE(u.raw_user_meta_data->>'role', 'User'),
  'Active',  -- existing users are active, not pending
  'https://api.dicebear.com/7.x/avataaars/svg?seed=' || split_part(u.email, '@', 1)
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.students s WHERE s.id = u.id::text
);


-- ────────────────────────────────────────────────────────────
-- STEP 3: Make study_materials.url nullable
-- (allows saving metadata even without a storage bucket)
-- ────────────────────────────────────────────────────────────
ALTER TABLE public.study_materials
  ALTER COLUMN url DROP NOT NULL;


-- ────────────────────────────────────────────────────────────
-- STEP 4: Ensure RLS policies allow authenticated inserts on study_materials
-- Drop any old conflicting policies first, then re-create them cleanly.
-- ────────────────────────────────────────────────────────────
DO $$
BEGIN
  -- Drop old policies if they exist (ignore errors if they don't)
  BEGIN DROP POLICY IF EXISTS "Allow all operations on study_materials" ON study_materials; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN DROP POLICY IF EXISTS "All users can view study materials" ON study_materials; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN DROP POLICY IF EXISTS "Users can update their own study materials" ON study_materials; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN DROP POLICY IF EXISTS "Authenticated users can upload study materials" ON study_materials; EXCEPTION WHEN OTHERS THEN NULL; END;
END $$;

-- Simple, permissive policies for study_materials (all authenticated users can read/write)
CREATE POLICY "study_materials_select" ON study_materials FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "study_materials_insert" ON study_materials FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "study_materials_update" ON study_materials FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "study_materials_delete" ON study_materials FOR DELETE USING (auth.role() = 'authenticated');


-- ────────────────────────────────────────────────────────────
-- STEP 5: Ensure RLS on students allows all authenticated reads
-- ────────────────────────────────────────────────────────────
DO $$
BEGIN
  BEGIN DROP POLICY IF EXISTS "Allow all operations on students" ON students; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN DROP POLICY IF EXISTS "Students can be viewed by all authenticated users" ON students; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN DROP POLICY IF EXISTS "Users can update their own profile" ON students; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN DROP POLICY IF EXISTS "Admins can create students" ON students; EXCEPTION WHEN OTHERS THEN NULL; END;
END $$;

CREATE POLICY "students_select" ON students FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "students_insert" ON students FOR INSERT WITH CHECK (auth.uid()::text = id);
CREATE POLICY "students_update" ON students FOR UPDATE USING (auth.role() = 'authenticated');


-- ────────────────────────────────────────────────────────────
-- DONE! After running this script:
-- 1. Sign out and sign back in to your app
-- 2. Your user will now have a proper row in the students table
-- 3. Study material uploads will save correctly
-- 4. For file/PDF uploads, also create a "study-materials" bucket
--    in Supabase Dashboard → Storage → New Bucket → Public: Yes
-- ────────────────────────────────────────────────────────────

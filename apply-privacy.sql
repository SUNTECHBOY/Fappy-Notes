-- 1. Add the column to the students table
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS invited_by TEXT REFERENCES public.students(id) ON DELETE SET NULL;

-- 2. Update the trigger function to capture the inviter
CREATE OR REPLACE FUNCTION public.handle_new_student()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_name text;
BEGIN
  -- Default name to the part before the @ in the email
  v_name := COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1));
  
  INSERT INTO public.students (
    id, 
    email, 
    name, 
    role, 
    status,
    avatar,
    email_verified,
    invited_by
  )
  VALUES (
    new.id,
    new.email,
    v_name,
    COALESCE(new.raw_user_meta_data->>'role', 'User'),
    'Pending',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=' || v_name,
    false,
    new.raw_user_meta_data->>'invited_by' -- Capture from the admin invite
  );
  RETURN new;
END;
$$;

-- 3. Apply Row Level Security to hide students from unauthorized users
-- First, enable RLS
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- Drop the old overly-permissive policy
DROP POLICY IF EXISTS "Allow all operations on students" ON public.students;

-- Create the new secure policy
CREATE POLICY "Users can only view/edit themselves, people they invited, or Admins see all"
ON public.students
FOR ALL
USING (
  -- 1. They are viewing themselves
  id = auth.uid() 
  -- 2. They invited this person
  OR invited_by = auth.uid()
  -- 3. They are an Admin (Admins can see everyone)
  OR (SELECT role FROM public.students WHERE id = auth.uid()) = 'Admin'
);

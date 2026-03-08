-- 1. Drop the old function
DROP FUNCTION IF EXISTS public.handle_new_student() CASCADE;

-- 2. Create the updated function without emailVerified
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
    avatar
  )
  VALUES (
    new.id,
    new.email,
    v_name,
    COALESCE(new.raw_user_meta_data->>'role', 'User'),
    'Pending',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=' || v_name
  );
  RETURN new;
END;
$$;

-- 3. Re-attach the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_student();

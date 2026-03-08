-- 1. Drop the old trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 2. Drop the old function if it exists
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 3. Create the updated function that inserts into 'students' instead of 'users'/'profiles'
CREATE OR REPLACE FUNCTION public.handle_new_student()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.students (id, email, name, role, status)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_app_meta_data->>'name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_app_meta_data->>'role', 'User'),
    'Active'
  );
  RETURN new;
END;
$$;

-- 4. Create the new trigger using the correct function
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_student();

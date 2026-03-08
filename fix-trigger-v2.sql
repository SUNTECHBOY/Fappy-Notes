-- 1. Drop the old trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_student();

-- 2. Create the updated function that handles missing constraints like avatar
CREATE OR REPLACE FUNCTION public.handle_new_student()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_name text;
BEGIN
  v_name := COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1));
  
  INSERT INTO public.students (
    id, 
    email, 
    name, 
    role, 
    status,
    avatar,
    "emailVerified"
  )
  VALUES (
    new.id,
    new.email,
    v_name,
    COALESCE(new.raw_user_meta_data->>'role', 'User'),
    'Pending', -- Use 'Pending' until they actually log in
    'https://api.dicebear.com/7.x/avataaars/svg?seed=' || v_name, -- Default avatar
    false -- emailVerified defaults to false
  );
  RETURN new;
END;
$$;

-- 3. Create the new trigger using the correct function
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_student();

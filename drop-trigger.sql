-- A script to totally disable the trigger for debugging
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_student() CASCADE;

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { toast } from 'sonner';
import * as db from '../services/database';

interface AuthUser {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

interface UseAuthResult {
  user: AuthUser | null;
  authLoading: boolean;
  authError: string | null;
  signUp: (params: { email: string; password: string; name?: string }) => Promise<void>;
  signIn: (params: { email: string; password: string }) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuth = (): UseAuthResult => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Initialize auth state and listen for changes
  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        setAuthLoading(true);
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error) {
          console.error('Error loading auth user:', error);
          if (isMounted) {
            setAuthError(error.message);
          }
        } else {
          if (isMounted) {
            setUser(user as AuthUser | null);
            setAuthError(null);
          }
        }
      } catch (err) {
        console.error('Unexpected auth init error:', err);
        if (isMounted) {
          const msg = err instanceof Error ? err.message : String(err);
          setAuthError(msg);
        }
      } finally {
        if (isMounted) {
          setAuthLoading(false);
        }
      }
    };

    initAuth();

    const {
      data: authListener,
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;
      const currentUser = session?.user ?? null;
      setUser(currentUser as AuthUser | null);
      setAuthError(null);
    });

    return () => {
      isMounted = false;
      try {
        authListener.subscription.unsubscribe();
      } catch (err) {
        console.error('Error cleaning up auth listener:', err);
      }
    };
  }, []);

  const signUp: UseAuthResult['signUp'] = async ({ email, password, name }) => {
    try {
      setAuthLoading(true);
      setAuthError(null);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) {
        console.error('Sign up error:', error);
        setAuthError(error.message);
        toast.error(error.message);
        return;
      }

      if (data.user) {
        try {
          await db.createStudent({
            id: data.user.id,
            name: name || email.split('@')[0],
            email: email,
            status: 'Pending',
            avatar: '',
            bio: '',
          } as any);
        } catch (dbErr) {
          console.error('Failed to create initial student profile:', dbErr);
        }
        setUser(data.user as AuthUser);
      }

      toast.success(
        'Sign up successful. Please check your email to confirm your account before logging in.'
      );
    } catch (err) {
      console.error('Unexpected sign up error:', err);
      const msg = err instanceof Error ? err.message : String(err);
      setAuthError(msg);
      toast.error(msg);
    } finally {
      setAuthLoading(false);
    }
  };

  const signIn: UseAuthResult['signIn'] = async ({ email, password }) => {
    try {
      setAuthLoading(true);
      setAuthError(null);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        setAuthError(error.message);
        toast.error(error.message);
        return;
      }

      if (data.user) {
        setUser(data.user as AuthUser);
      }

      toast.success('Signed in successfully');
    } catch (err) {
      console.error('Unexpected sign in error:', err);
      const msg = err instanceof Error ? err.message : String(err);
      setAuthError(msg);
      toast.error(msg);
    } finally {
      setAuthLoading(false);
    }
  };

  const signOut: UseAuthResult['signOut'] = async () => {
    try {
      setAuthLoading(true);
      setAuthError(null);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
        setAuthError(error.message);
        toast.error(error.message);
        return;
      }
      setUser(null);
      toast.success('Signed out');
    } catch (err) {
      console.error('Unexpected sign out error:', err);
      const msg = err instanceof Error ? err.message : String(err);
      setAuthError(msg);
      toast.error(msg);
    } finally {
      setAuthLoading(false);
    }
  };

  return {
    user,
    authLoading,
    authError,
    signUp,
    signIn,
    signOut,
  };
};


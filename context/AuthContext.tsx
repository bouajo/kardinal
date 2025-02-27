// context/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { router } from 'expo-router';

// Define types for our context
type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
};

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check for existing session
    const getSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (!error && data.session) {
          setUser(data.session.user);
        }
      } catch (error) {
        console.warn('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    try {
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user || null);
      });
      
      // Return cleanup function
      return () => {
        // Skip unsubscribe if not available (e.g. on web)
        if (data?.subscription?.unsubscribe) {
          data.subscription.unsubscribe();
        }
      };
    } catch (error) {
      console.warn('Error setting up auth listener:', error);
      setLoading(false);
      return () => {}; // Return empty cleanup function
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error: any) {
      console.error('Error signing in:', error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    setLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });
      
      if (authError) throw authError;
      
      if (authData?.user) {
        try {
          const { error: profileError } = await supabase
            .from('driver_profiles')
            .insert({
              id: authData.user.id,
              full_name: fullName,
              is_active: true
            });
          
          if (profileError) console.warn('Error creating profile:', profileError);
        } catch (error) {
          console.warn('Error creating profile:', error);
        }
      }
    } catch (error: any) {
      console.error('Error signing up:', error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      console.error('Error signing out:', error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
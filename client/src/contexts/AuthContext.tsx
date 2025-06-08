import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { supabase } from '@/config/supabaseClient';
import type { Session, User } from '@supabase/supabase-js';

// NEW: The context will now also provide an authError state and a way to clear it.
interface AuthState {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  authError: string | null;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null); // NEW: State for auth errors

  useEffect(() => {
    setIsLoading(true);

    // NEW: Check for OAuth errors in the URL hash on initial load.
    // Supabase puts session info and errors in the hash fragment.
    const hash = window.location.hash;
    if (hash.includes('error=') && hash.includes('error_description=')) {
      const params = new URLSearchParams(hash.substring(1)); // Remove the '#'
      const errorDescription = params.get('error_description');
      if (errorDescription) {
        // Set the error so components can display it.
        setAuthError(decodeURIComponent(errorDescription.replace(/\+/g, ' ')));
        // Clean the URL to remove the error details, so it doesn't reappear on refresh.
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const clearAuthError = () => setAuthError(null);

  const value = { session, user, isLoading, authError, clearAuthError };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
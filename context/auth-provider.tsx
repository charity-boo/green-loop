'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onIdTokenChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { useFCMToken } from '@/lib/firebase/messaging';
import { useRouter } from 'next/navigation';

function setAuthCookie(token: string) {
  const expires = new Date(Date.now() + 2 * 60 * 60 * 1000).toUTCString();
  const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:';
  document.cookie = `firebase-token=${token}; path=/; expires=${expires}; ${isSecure ? 'secure;' : ''} samesite=Lax`;
}

function clearAuthCookie() {
  document.cookie = 'firebase-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=Lax';
}

interface AuthContextType {
  user: User | null;
  role: string | null;
  status: 'loading' | 'authenticated' | 'unauthenticated';
  error: Error | null;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');
  const [error, setError] = useState<Error | null>(null);

  // Register FCM token whenever the user is authenticated
  useFCMToken(user?.uid ?? null);

  useEffect(() => {
    console.log('AuthProvider useEffect triggered. Initial auth object:', auth);
    if (!auth) {
      console.warn('Firebase Auth is not initialized. Check your environment variables.');
      setStatus('unauthenticated');
      return;
    }

    // Listen to Firebase auth state changes (including token refresh)
    const unsubscribe = onIdTokenChanged(
      auth,
      async (firebaseUser) => {
        console.log('onIdTokenChanged fired. firebaseUser:', firebaseUser ? firebaseUser.uid : 'null');
        if (firebaseUser) {
          setUser(firebaseUser);
          
          try {
            // Extract role from custom claims and set cookie before marking authenticated
            console.log('Fetching ID token result for:', firebaseUser.uid);
            const idTokenResult = await firebaseUser.getIdTokenResult();
            const userRole = idTokenResult.claims.role as string;
            console.log('ID token claims fetched. Role:', userRole);
            // Set the cookie here so middleware sees it before any redirect fires
            setAuthCookie(idTokenResult.token);
            setRole(userRole?.toUpperCase() || 'USER');
            setStatus('authenticated');
            console.log('Auth status set to authenticated. User role:', userRole || 'USER');
          } catch (err) {
            console.error('Error fetching token claims:', err);
            // Still try to set cookie with a basic token
            try {
              const token = await firebaseUser.getIdToken();
              setAuthCookie(token);
            } catch {
              // ignore
            }
            setRole('USER');
            setStatus('authenticated'); // Still sets to authenticated even on error to avoid infinite loading
            console.log('Auth status set to authenticated (with claims error). User role: USER');
          }
        } else {
          setUser(null);
          setRole(null);
          clearAuthCookie();
          setStatus('unauthenticated');
          console.log('Auth status set to unauthenticated. No user.');
        }
      },
      (err) => {
        setError(err);
        setStatus('unauthenticated');
        console.error('onAuthStateChanged error:', err);
      }
    );

    return () => {
      console.log('AuthProvider useEffect cleanup. Unsubscribing from auth state changes.');
      unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    console.log('handleSignOut called.');
    if (!auth) {
      setUser(null);
      setRole(null);
      setStatus('unauthenticated');
      console.log('Firebase Auth not initialized during signOut. Setting unauthenticated.');
      return;
    }
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setRole(null);
      clearAuthCookie();
      setStatus('unauthenticated');
      console.log('Firebase signOut successful. Setting unauthenticated.');
      router.push('/');
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error('Sign out failed');
      setError(errorObj);
      console.error('Firebase signOut error:', errorObj);
      throw errorObj;
    }
  };

  const value: AuthContextType = {
    user,
    role,
    status,
    error,
    signOut: handleSignOut,
  };

  useEffect(() => {
    console.log('AuthProvider context value updated. Current status:', value.status, 'role:', value.role);
  }, [value.status, value.role]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * Hook to check if user is authenticated
 */
export function useFirebaseAuth() {
  const { user, status } = useAuth();
  return {
    isAuthenticated: status === 'authenticated',
    loading: status === 'loading',
    user,
  };
}

/**
 * Hook to get user's role
 */
export function useUserRole(): string | null {
  const { role } = useAuth();
  return role;
}

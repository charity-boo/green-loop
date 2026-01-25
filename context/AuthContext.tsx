'use client';

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';

export type RoleType = 'user' | 'collector' | 'admin';

export interface RoleUser {
  id: string;
  email: string;
  role: RoleType;
}

interface AuthContextType {
  user: RoleUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock role fetch (replace with Firestore in real app)
const fetchUserRole = async (uid: string): Promise<RoleUser> => {
  const mockRole = (localStorage.getItem('mockRole') as RoleType) || 'user';
  await new Promise((res) => setTimeout(res, 300)); // simulate network
  return {
    id: uid,
    email: auth.currentUser?.email || '',
    role: mockRole,
  };
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<RoleUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        const roleData = await fetchUserRole(firebaseUser.uid);
        setUser(roleData);
      } catch (err) {
        console.error('Role fetch failed:', err);
        auth.signOut();
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsub();
  }, []);

  const logout = () => {
    auth.signOut();
    localStorage.removeItem('mockRole');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};

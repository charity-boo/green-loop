'use client';

import { useAuth as useFirebaseAuth } from '@/context/auth-provider';
import { useRouter } from 'next/navigation';
import { User } from 'firebase/auth';

export interface UseAuthReturn {
  user: User | null;
  role: string | null;
  status: string;
  isLoading: boolean;
  logout: () => Promise<void>;
}

/**
 * Client-side hook to access the current user.
 */
export function useAuth(): UseAuthReturn {
  const { user, role, status, signOut } = useFirebaseAuth();
  const router = useRouter();

  const logout = async () => {
    await signOut();
    router.push('/');
  };

  return {
    user,
    role,
    status,
    isLoading: status === 'loading',
    logout,
  };
}

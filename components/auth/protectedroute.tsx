'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, RoleType } from '@/context/AuthContext';

interface ProtectedRouteProps {
  allowedRole: RoleType;
  children: React.ReactNode;
}

export default function ProtectedRoute({ allowedRole, children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace('/login');
      return;
    }

    const path = window.location.pathname;

    // Redirect only if visiting root or login page
    if (path === '/' || path === '/login') {
      if (user.role !== allowedRole) {
        router.replace(`/dashboard/${user.role}`);
      }
    }
  }, [user, isLoading, allowedRole, router]);

  if (isLoading) return <div>Loading...</div>;

  return <>{children}</>;
}

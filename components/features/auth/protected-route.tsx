'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-provider';

interface ProtectedRouteProps {
  allowedRole?: string;
  children: React.ReactNode;
}

export function ProtectedRoute({ allowedRole, children }: ProtectedRouteProps) {
  const { user, role, status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const isLoading = status === 'loading';
    if (isLoading) return; // Don't do anything while loading

    // If not authenticated, redirect to login page
    if (status !== 'authenticated') {
      router.replace('/auth/login');
      return;
    }

    // If authenticated user's role does not match (and allowedRole is provided), redirect to their dashboard
    if (allowedRole && user && role !== allowedRole) {
      router.replace('/dashboard');
    }

  }, [user, role, status, allowedRole, router]);

  if (status === 'loading' || (allowedRole && status === 'authenticated' && user && role !== allowedRole)) {
    // Show a loading spinner or a null component while we determine the user's auth status
    // and role. This prevents a flash of the protected content.
    return <div>Loading...</div>;
  }

  // If authenticated and (role matches or no role required), render the children
  if (status === 'authenticated' && user && (!allowedRole || role === allowedRole)) {
    return <>{children}</>;
  }

  // Fallback, should ideally not be reached
  return null;
}

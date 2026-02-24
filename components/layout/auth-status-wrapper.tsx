'use client';

import React from 'react';
import { useAuth } from '@/context/auth-provider';

interface AuthStatusWrapperProps {
  children: React.ReactNode;
}

export default function AuthStatusWrapper({ children }: AuthStatusWrapperProps) {
  const { status } = useAuth();

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        {/* You can replace this with a more sophisticated spinner */}
        <p>Loading application...</p>
      </div>
    );
  }

  return <>{children}</>;
}

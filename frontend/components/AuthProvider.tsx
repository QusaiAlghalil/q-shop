'use client';

import { validateToken } from '@/lib/auth';
import { useAuthStore } from '@/store';
import { useEffect, useState } from 'react';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isChecking, setISChecking] = useState(true);
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        const isValid = await validateToken();
        if (!isValid) {
          console.log('Token expired or invalid - logging out');
          logout();
        }
      }
      setISChecking(false);
    };
    checkAuth();
  }, [logout, token]);

  if (isChecking && token) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
};

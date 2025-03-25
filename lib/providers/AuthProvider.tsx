'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/lib/redux/features/authSlice';

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useDispatch();

  useEffect(() => {
    // Kiểm tra nếu đang ở phía client
    if (typeof window !== 'undefined') {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const userInfo = localStorage.getItem('userInfo');

        if (accessToken && userInfo) {
          const user = JSON.parse(userInfo);
          dispatch(setCredentials({
            user,
            accessToken,
          }));
        }
      } catch (error) {
        console.error('Failed to restore auth state:', error);
      }
    }
  }, [dispatch]);

  return <>{children}</>;
} 
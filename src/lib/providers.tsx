'use client';

import { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/lib/redux/store';
import AuthProvider from '@/lib/providers/AuthProvider';

export function Providers({ children }: PropsWithChildren) {
  return (
    <Provider store={store}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </Provider>
  );
} 
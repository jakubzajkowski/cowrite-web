import React, { createContext, useContext, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useCurrentUser } from '@/lib/api/hooks';
import type { UserResponse } from '../api';

interface AuthContextValue {
  user: UserResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useCurrentUser();

  const unauthenticated = !!error || !data;

  const value: AuthContextValue = useMemo(
    () => ({
      user: unauthenticated ? null : (data ?? null),
      isAuthenticated: !!data && !error,
      isLoading,
    }),
    [data, isLoading, unauthenticated, queryClient]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from './auth';
import { apiClient } from './client';
import { ROUTES } from '@/routes/config';
import type { LoginRequest, RegisterRequest, AuthResponse } from './types';

// Query keys
export const authKeys = {
  all: ['auth'] as const,
  currentUser: () => [...authKeys.all, 'currentUser'] as const,
} as const;

// Hook for user login
export const useLogin = () => {
  return useMutation({
    mutationFn: (credentials: LoginRequest) => authApi.login(credentials),
    onSuccess: (data: AuthResponse) => {
        console.log('Login successful:', data);
    },
    onError: (error) => {
      console.error('Login failed:', error);
      // You can add toast notifications here
    },
  });
};

// Hook for user registration
export const useRegister = () => {
  return useMutation({
    mutationFn: (userData: RegisterRequest) => authApi.register(userData),
    onSuccess: (data: AuthResponse) => {
      console.log('Registration successful:', data);
    },
    onError: (error) => {
      console.error('Registration failed:', error);
      // You can add toast notifications here
    },
  });
};

// Hook for getting current user
export const useCurrentUser = () => {
  return useQuery({
    queryKey: authKeys.currentUser(),
    queryFn: authApi.getCurrentUser,
    enabled: !!localStorage.getItem('auth_token'), // Only fetch if token exists
    retry: false, // Don't retry on auth failures
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for logout
export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
    console.log('Logout successful');
    },
    onError: (error) => {
      console.error('Logout failed:', error);
      // Even if logout fails on server, clear local data
      localStorage.removeItem('auth_token');
      apiClient.clearAuthToken();
      queryClient.clear();
      navigate(ROUTES.HOME);
    },
  });
};

// Hook to check if user is authenticated
export const useIsAuthenticated = () => {
  const { data: user, isLoading } = useCurrentUser();
  return {
    isAuthenticated: !!user,
    user,
    isLoading,
  };
};

// Function to initialize auth token from localStorage (call on app start)
export const initializeAuth = () => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    apiClient.setAuthToken(token);
  }
};

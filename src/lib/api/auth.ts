import { apiClient } from './client';
import type { LoginRequest, RegisterRequest, UserResponse } from './types';

export const authApi = {
  // User login
  login: async (credentials: LoginRequest): Promise<string> => {
    return apiClient.post<string>('/api/auth/login', credentials);
  },

  // User registration
  register: async (userData: RegisterRequest): Promise<string> => {
    return apiClient.post<string>('/api/auth/register', userData);
  },

  // Get current user
  getCurrentUser: async (): Promise<UserResponse> => {
    const user = await apiClient.get<UserResponse>('/api/auth/me');
    console.log('Fetched current user:', user);
    if (!user) {
      throw new Error('Unauthenticated');
    }
    console.log('Fetched current user:', user);
    return user;
  },

  logout: async (): Promise<void> => {
    return apiClient.post<void>('/api/auth/logout');
  },
};

import { apiClient } from './client';
import type { LoginRequest, RegisterRequest, AuthResponse, User } from './types';

export const authApi = {
  // User login
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/api/auth/login', credentials);
  },

  // User registration
  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/api/auth/register', userData);
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    return apiClient.get<User>('/api/auth/me');
  },

  // Logout (if needed)
  logout: async (): Promise<void> => {
    return apiClient.post<void>('/api/auth/logout');
  },
};
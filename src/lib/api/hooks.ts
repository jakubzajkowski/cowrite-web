import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from './auth';
import { apiClient } from './client';
import { ROUTES } from '@/routes/config';
import type {
  CloudCreateFileRequest,
  ConversationIdRequest,
  LoginRequest,
  RegisterRequest,
} from './types';
import { chatApi } from './chat';
import { cloudApi } from './cloud';

export const authKeys = {
  all: ['auth'] as const,
  currentUser: () => [...authKeys.all, 'currentUser'] as const,
} as const;

export const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (credentials: LoginRequest) => authApi.login(credentials),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: authKeys.currentUser() });
      console.log('Login successful');
      navigate(ROUTES.NOTES);
    },
    onError: error => {
      console.error('Login failed:', error);
    },
  });
};

export const useRegister = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (userData: RegisterRequest) => authApi.register(userData),
    onSuccess: async () => {
      console.log('Registration successful');
      navigate(ROUTES.SIGNIN);
    },
    onError: error => {
      console.error('Registration failed:', error);
    },
  });
};

// Hook for getting current user
export const useCurrentUser = () => {
  return useQuery({
    queryKey: authKeys.currentUser(),
    queryFn: authApi.getCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
};

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      queryClient.removeQueries({ queryKey: authKeys.currentUser() });
      apiClient.clearAuthToken();
      navigate(ROUTES.SIGNIN);
    },
  });
};

export const useCreateConversation = () => {
  return useMutation({
    mutationFn: (conversationId: ConversationIdRequest) =>
      chatApi.createConversation(conversationId),
    onSuccess: async () => {
      console.log('Conversation created successfully');
    },
    onError: error => {
      console.error('Conversation creation failed:', error);
    },
  });
};

export const useCloudFiles = () => {
  return useQuery({
    queryKey: ['cloudFiles'],
    queryFn: cloudApi.getFiles,
  });
};

export const useCloudFileContent = (id: number) => {
  return useQuery({
    queryKey: ['cloudFileContent', id],
    queryFn: () => cloudApi.getFileContent(id),
    enabled: id > 0,
    staleTime: 0,
    gcTime: 0,
  });
};

export const useCreateCloudFile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CloudCreateFileRequest) => cloudApi.createFile(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['cloudFiles'] });
      console.log('Cloud file created successfully');
    },
    onError: error => {
      console.error('Cloud file creation failed:', error);
    },
  });
};

export const useCloudUpdateFile = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (content: string) => cloudApi.updateFile(id, { content }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['cloudFileContent', id] });
      await queryClient.invalidateQueries({ queryKey: ['cloudFiles'] });
    },
  });
};

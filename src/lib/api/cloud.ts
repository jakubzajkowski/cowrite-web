import { apiClient } from './client';
import type {
  CloudCreateFileRequest,
  CloudCreateFileResponse,
  CloudFileContentResponse,
  CloudFileResponse,
  CloudUpdateFileRequest,
} from './types';

export const cloudApi = {
  getFiles: async (): Promise<CloudFileResponse[]> => {
    return apiClient.get<CloudFileResponse[]>(`/api/cloud/notes`);
  },
  getFileContent: async (id: number): Promise<CloudFileContentResponse> => {
    return apiClient.get<CloudFileContentResponse>(`/api/cloud/notes/${id}`);
  },
  createFile: async (data: CloudCreateFileRequest): Promise<CloudCreateFileResponse> => {
    return apiClient.post<CloudCreateFileResponse>(`/api/cloud/notes`, data);
  },
  updateFile: async (id: number, data: CloudUpdateFileRequest): Promise<void> => {
    return apiClient.patch<void>(`/api/cloud/notes/${id}`, data);
  },
  deleteFile: async (id: number): Promise<void> => {
    return apiClient.delete<void>(`/api/cloud/notes/${id}`);
  },
};

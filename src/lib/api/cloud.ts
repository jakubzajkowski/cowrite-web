import { apiClient } from './client';
import type {
  CloudCreateFileRequest,
  CloudCreateFileResponse,
  CloudFileContentResponse,
  CloudFileResponse,
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
};
